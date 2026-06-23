FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "run", "server"] # Ya "node server.js" jo bhi tumhara entry point hai