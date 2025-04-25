# -------- Development Stage --------
FROM node:lts-bookworm AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]


# -------- Build Stage For Production --------
FROM node:lts-bookworm-slim AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy all source code
COPY . .

# Build the NestJS app (compiles TypeScript to JavaScript in /dist)
RUN npm run build


# -------- Production Stage --------
FROM node:lts-bookworm-slim AS production

# Create non-root user
RUN groupadd -r apiservice && useradd -r -g apiservice apiservice

WORKDIR /usr/src/app

# Copy only what you need
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Set correct permissions
RUN chown -R apiservice:apiservice /usr/src/app

USER apiservice
