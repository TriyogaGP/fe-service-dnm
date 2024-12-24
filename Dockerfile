FROM node:16-alpine

WORKDIR /app

COPY package*.json .

RUN npm install --force

COPY . .

RUN npm run stg-build

EXPOSE 4500

CMD ["npm", "run", "stg-serve"]