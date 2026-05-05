### 1. Install deps (cached unless package.json/bun.lock change) ###
FROM oven/bun:1 AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

### 2. Build: push Convex functions, then `next build` ###
FROM oven/bun:1 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time secrets and URLs. Pass via Dokploy build args / env.
ARG CONVEX_SELF_HOSTED_URL
ARG CONVEX_SELF_HOSTED_ADMIN_KEY
ARG NEXT_PUBLIC_CONVEX_URL
ARG NEXT_PUBLIC_CONVEX_SITE_URL
ENV CONVEX_SELF_HOSTED_URL=$CONVEX_SELF_HOSTED_URL
ENV CONVEX_SELF_HOSTED_ADMIN_KEY=$CONVEX_SELF_HOSTED_ADMIN_KEY
ENV NEXT_PUBLIC_CONVEX_URL=$NEXT_PUBLIC_CONVEX_URL
ENV NEXT_PUBLIC_CONVEX_SITE_URL=$NEXT_PUBLIC_CONVEX_SITE_URL

# `convex deploy` pushes convex/ functions, then runs next build with the
# correct CONVEX_URL baked into the client bundle.
RUN bunx convex deploy --cmd 'bun run build'

### 3. Runner: minimal image, just the standalone server ###
FROM oven/bun:1-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Next.js standalone output is self-contained (server.js + minimal deps).
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["bun", "server.js"]
