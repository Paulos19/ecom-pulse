# =======================================================
# Dockerfile Multi-Stage Otimizado para Next.js Standalone + Prisma
# =======================================================
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl openssl-dev

FROM base AS deps
WORKDIR /app

# Instala dependências
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Desativa telemetria durante o build
ENV NEXT_TELEMETRY_DISABLED=1

# Gera os artefatos do Prisma client
RUN npx prisma generate

# Constrói o Next.js em modo Standalone
RUN npm run build

# Runner de Produção
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Cria usuário não-root por segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copia arquivos estáticos públicos e os artefatos do build standalone
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copia a engine do prisma gerada para o runner caso necessário
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
