FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

RUN npm install -g @nestjs/cli

COPY . .

RUN nest build

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
