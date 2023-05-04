FROM node:latest
WORKDIR /app
COPY package.json .
RUN npm install
EXPOSE 3000
EXPOSE 3300
CMD ["node","index.js"]
