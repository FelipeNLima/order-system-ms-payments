FROM node:18 as builder

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
COPY ./prisma ./prisma

COPY . .

# Install app dependencies
RUN yarn
RUN yarn build

FROM node:18 as runner 

WORKDIR /app 

ENV DATABASE_URL="uri"
ENV TOKEN_MERCADO_PAGO="uri"
ENV USERID="uri"
ENV POSID="uri"
ENV NODE_LOCAL_PORT="uri"
ENV ENDPOINT="uri"
ENV QUEUE="uri"
ENV AWS_REGION="uri"
ENV AWS_ACCESS_KEY_ID="uri"
ENV AWS_SECRET_ACCESS_KEY="uri"
ENV AWS_SESSION_TOKEN="uri"

COPY --from=builder /app/node_modules ./node_modules/
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/dist/ ./dist/
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/prisma ./prisma/

RUN yarn generate

EXPOSE 3000

CMD ["yarn", "start:migrate:prod"]