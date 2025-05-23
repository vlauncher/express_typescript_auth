FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --unsafe-perm

COPY . .

RUN npm run build

EXPOSE 8000

CMD ["npm", "run","dev"]

