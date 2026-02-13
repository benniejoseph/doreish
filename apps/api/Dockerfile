FROM node:20-slim
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --omit=dev
COPY tsconfig.json ./
COPY src ./src
RUN npm install -D typescript && npm run build
EXPOSE 8080
CMD ["node", "dist/index.js"]
