FROM mcr.microsoft.com/playwright:v1.40.0-focal

WORKDIR /app

# Install Node.js (Playwright image comes with it, but let's ensure we are using a compatible version)
# Actually, the playwright image ALREADY has node. Let's just use it.

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npx nest build

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
