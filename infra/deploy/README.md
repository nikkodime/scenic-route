# Running Panoramica on a small server

One `docker compose` project with four parts:

| Service | What it does | Memory |
|---|---|---|
| `graphhopper` | Routing engine, serving a graph built in advance | about 2 GB for Italy (measured), 1 GB for central Italy |
| `api` | The Panoramica API (plans, places, trips) | about 300 MB |
| `postgres` | Saved trips and ratings | about 100 MB |
| `tunnel` (optional) | Cloudflare Tunnel: a free HTTPS address for the phone, with no router changes | about 30 MB |

Two places it can run while we test:

* **The Synology NAS** (NikkoNas), if its model can run Container Manager and it has at least 4 GB of RAM for Italy (2 GB will only do central Italy).
* **An Oracle Cloud "Always Free" VM** (Ampere A1: 4 CPUs, 24 GB RAM, 200 GB disk, free indefinitely). This is big enough for all of Italy, and probably the rest of Europe later.

The import is the step that needs a lot of memory: about 12 GB for Italy. Do it on the Mac, then copy the result.
The server only *serves* the finished graph.

## 1. Prepare the data on the Mac (once per refresh)

```sh
cd "~/2. Builds/scenic-route"
mkdir -p infra/deploy/data
# Routing graph (about 15 min for Italy). Uses the Geofabrik extract in ~/2. Builds/osm.
java -Xmx12g \
  "-Ddw.graphhopper.datareader.file=$HOME/2. Builds/osm/italy-latest.osm.pbf" \
  "-Ddw.graphhopper.graph.location=$PWD/infra/deploy/data/graph" \
  "-Ddw.graphhopper.custom_models.directory=$PWD/infra/graphhopper/custom_models" \
  -jar "$HOME/2. Builds/graphhopper/graphhopper-web-11.0.jar" import infra/graphhopper/config.yml
# Elevation tiles for Italy (about 1.2 GB)
DEM_DIR=infra/deploy/data/dem node services/api/scripts/fetch-dem.ts 36,6,47.2,19
```

The scenic places (`infra/data/features/*.json`) are in git and go into the API image.

## 2a. On the Synology NAS

1. **Package Center → Container Manager → Install.** If it isn't listed, the model can't run Docker. Use Oracle (2b) instead.
2. Copy the whole `scenic-route` folder to a shared folder on the NAS, e.g. `/volume1/docker/panoramica` (Finder: the NAS share). Include `infra/deploy/data`.
3. In `infra/deploy`, copy `.env.example` to `.env` and fill in `JWT_SECRET` and `POSTGRES_PASSWORD`. For central Italy only, also set `GH_XMX=1500m`.
4. **Container Manager → Project → Create**, then:
   - Path: `/volume1/docker/panoramica/scenic-route/infra/deploy`
   - Source: "Use existing docker-compose.yml"
   - Then Build.
5. Check from the Mac: `curl http://192.168.1.4:8787/healthz` should answer `"router":"graphhopper"`.

## 2b. On Oracle Cloud Always Free

1. Create the account at cloud.oracle.com. It asks for a card for identity checks, and the Always Free resources are not charged.
2. Create a VM instance with the following settings:
   - Shape: Ampere A1 (VM.Standard.A1.Flex), 4 OCPUs, 24 GB
   - Image: Ubuntu 24.04
   - Add your SSH key.
3. On the VM:

   ```sh
   sudo apt-get update && sudo apt-get install -y docker.io docker-compose-v2 git
   git clone -b claude/project-thread-cnuw77 https://github.com/nikkodime/scenic-route.git
   ```

4. Copy the prepared data from the Mac:

   ```sh
   rsync -a infra/deploy/data/ ubuntu@<vm-ip>:scenic-route/infra/deploy/data/
   ```

5. Create `.env` as in 2a step 3. With 24 GB you can set `GH_XMX=8g`.
6. Start it:

   ```sh
   cd scenic-route/infra/deploy && sudo docker compose up -d --build
   ```

## 3. A web address for the phone (Cloudflare Tunnel, free)

1. Open dash.cloudflare.com and go to **Zero Trust → Networks → Tunnels → Create tunnel** (cloudflared).
2. Copy the token into `.env` as `TUNNEL_TOKEN`.
3. Add a public hostname, e.g. `api.<your domain>`, with Service `HTTP` and URL `api:8787`. A named tunnel needs a domain whose DNS is on Cloudflare (adding a domain is free). Without a domain, Tailscale Funnel gives a free `https://<name>.ts.net` address instead. Install Tailscale on the server and run `tailscale funnel 8787`.
4. Start with the tunnel:

   ```sh
   docker compose --profile tunnel up -d
   ```

5. Build the iOS app with `SCENIC_API_BASE_URL=https://<that hostname>`.

## Refresh

Repeat step 1 monthly: download a fresh extract, re-import and re-fetch the places. Then copy `data/graph`
and restart `graphhopper`.
