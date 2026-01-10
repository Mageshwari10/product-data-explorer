FROM mcr.microsoft.com/playwright:v1.48.1-jammy

WORKDIR /app

COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Install Playwright browsers
RUN npx playwright install --with-deps

COPY . .

# Build the application
RUN npm run build

# Expose the port
EXPOSE 3001

# Start the application
CMD ["npm", "run", "start:prod"]
