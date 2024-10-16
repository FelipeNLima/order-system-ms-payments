FROM node:20 AS builder

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
COPY prisma ./prisma

COPY . .

# Install app dependencies
RUN npm i
# Generate prisma client
RUN npm run generate

COPY . .

RUN npm run build

FROM node:20-buster

ENV DATABASE_URL="uri"
ENV TOKEN_MERCADO_PAGO="uri"
ENV USERID="uri"
ENV POSID="uri"
ENV NODE_LOCAL_PORT="uri"

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist/
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/prisma ./prisma/

EXPOSE 3000

CMD [ "npm run", "start:migrate:prod" ]