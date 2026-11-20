"""Synthetic road network near Siena for the GraphHopper integration test.

    A ==motorway (toll)================ B    fast, boring
    A - secondary via S1, S2 (town), S3 - B    winding, scenic; S2 inside a ZTL box
         S1 - tertiary via T1 - S3             bypass around the town
    A - unclassified gravel via G1 ----- B    short but unpaved

Writes tiny-tuscany.osm next to this file.
"""
import math
import os

nodes = {}
ways = []


def node(lat, lon):
    i = len(nodes) + 1
    nodes[i] = (lat, lon)
    return i


def line(a, b, n, wiggle=True):
    (la, lo), (lb, lob) = nodes[a], nodes[b]
    ids = [a]
    for i in range(1, n):
        t = i / n
        w = math.sin(i * 1.3) * 0.002 if wiggle else 0
        ids.append(node(la + (lb - la) * t + w, lo + (lob - lo) * t))
    ids.append(b)
    return ids


def way(ids, **tags):
    ways.append((ids, tags))


A = node(43.300, 11.300)
B = node(43.300, 11.500)
S1 = node(43.330, 11.350)
S2 = node(43.340, 11.400)
S3 = node(43.330, 11.450)
T1 = node(43.360, 11.400)
G1 = node(43.315, 11.400)

way(line(A, B, 10, wiggle=False), highway='motorway', toll='yes', maxspeed='130', oneway='no')
for a, b in [(A, S1), (S1, S2), (S2, S3), (S3, B)]:
    way(line(a, b, 12), highway='secondary', maxspeed='70')
for a, b in [(S1, T1), (T1, S3)]:
    way(line(a, b, 12), highway='tertiary', maxspeed='60')
for a, b in [(A, G1), (G1, B)]:
    way(line(a, b, 4, wiggle=False), highway='unclassified', surface='gravel', maxspeed='50')

out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'tiny-tuscany.osm')
with open(out, 'w') as f:
    f.write('<?xml version="1.0" encoding="UTF-8"?>\n<osm version="0.6" generator="scenic-route-test">\n')
    for i, (la, lo) in nodes.items():
        f.write(f'  <node id="{i}" version="1" lat="{la:.6f}" lon="{lo:.6f}"/>\n')
    for k, (ids, tags) in enumerate(ways, 1):
        f.write(f'  <way id="{k}" version="1">\n')
        for i in ids:
            f.write(f'    <nd ref="{i}"/>\n')
        for t, v in tags.items():
            f.write(f'    <tag k="{t}" v="{v}"/>\n')
        f.write('  </way>\n')
    f.write('</osm>\n')
print(out, len(nodes), 'nodes', len(ways), 'ways')
