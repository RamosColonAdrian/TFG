FROM node:16

WORKDIR app

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY . .

RUN yarn prisma generate

RUN yarn build

EXPOSE 8007

CMD ["yarn", "start"]