FROM node:16-alpine

WORKDIR /app

COPY package*.json .

RUN npm install --force

COPY . .

RUN npm run-script stg-build

EXPOSE 4200

CMD ["npm", "run", "build-prod"]