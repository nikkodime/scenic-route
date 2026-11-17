FROM node:22-slim
WORKDIR /repo
COPY package.json package-lock.json tsconfig.base.json ./
COPY packages/core packages/core
COPY services/api services/api
COPY apps/web/package.json apps/web/package.json
COPY infra/data infra/data
RUN npm ci --omit=dev --workspace services/api --include-workspace-root=false
ENV NODE_ENV=production PORT=8787
EXPOSE 8787
CMD ["node", "services/api/src/server.ts"]
