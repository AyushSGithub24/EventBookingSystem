# Base image
FROM node:18-alpine AS builder


COPY package.json package.json
COPY package-lock.json package-lock.json
COPY tsconfig.json tsconfig.json
COPY tsconfig.tsbuildinfo tsconfig.tsbuildinfo

COPY prisma prisma
COPY src src

# install node modules
RUN npm install

# Generate Prisma client
RUN npx prisma generate
# Build typescript
RUN npm run build

EXPOSE 3000


CMD ["node", "dist/index.js"]

