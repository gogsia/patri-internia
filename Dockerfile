# Next.js dev server — hot reload enabled with polling for Docker on Windows
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# Source is bind-mounted at runtime (see docker-compose.yml), so no COPY needed for dev
EXPOSE 3000

ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

CMD ["npm", "run", "dev"]
