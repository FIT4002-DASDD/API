FROM node:16-alpine

WORKDIR '/usr/src/app'

COPY package.json .
RUN yarn

COPY tsconfig.json ./
COPY ./src ./src

RUN yarn build

CMD ["node", "dist/app.js"]
