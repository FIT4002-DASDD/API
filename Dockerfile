FROM node:16-alpine

WORKDIR '/usr/src/app'

COPY package.json .
RUN yarn
RUN npm install pm2 -g

COPY tsconfig.json ./
COPY ./src ./src

RUN yarn build
USER node

CMD ["pm2-runtime", "start", "dist/app.js"]
