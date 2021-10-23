FROM node:alpine

WORKDIR /app
COPY package.json .
COPY tsconfig.json .
COPY tsconfig.build.json .
RUN npm i -g @nestjs/cli
RUN npm install
RUN npm run build
COPY . .

CMD ["npm","run","start:prod"]