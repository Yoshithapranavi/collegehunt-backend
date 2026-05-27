FROM node:18-slim AS builder

WORKDIR /app
ENV PORT=3000
ENV DATABASE_URL=file:./dev.db

RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma
RUN npm install --legacy-peer-deps --no-optional
RUN npx prisma generate

COPY tsconfig.json ./
COPY src ./src
RUN npm run build
RUN rm -f dev.db
RUN npx prisma db push
RUN npm run prisma:seed

FROM node:18-slim AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL=file:./dev.db

RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma
RUN npm install --omit=dev --legacy-peer-deps --no-optional && npx prisma generate

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/dev.db ./dev.db

EXPOSE 3000
CMD ["node", "dist/index.js"]
