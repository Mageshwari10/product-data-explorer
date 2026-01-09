# Product Data Explorer

A full-stack application to explore book data scraped from World of Books.

## Tech Stack
- **Frontend**: Next.js (App Router), Tailwind CSS
- **Backend**: NestJS, TypeORM, PostgreSQL
- **Scraping**: Crawlee + Playwright

## Prerequisites
- Node.js (v18+)
- Docker & Docker Compose (for Database)

## Getting Started

### 1. Start the Database
```bash
docker compose up -d
```
*Note: If Docker is not available, you must configure `backend/.env` to point to a running PostgreSQL instance.*

### 2. Backend Setup
```bash
cd backend
npm install
npm run start:dev
```
The backend runs on `http://localhost:3001`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend runs on `http://localhost:3000`.

## Features
- **Live Scraping**: Trigger scraps via the UI or API.
- **Categorization**: Browse books by category.
- **Persistence**: Data is saved to PostgreSQL to avoid redundant scraping.

## API Endpoints
- `GET /navigation`: Get simplified navigation structure.
- `GET /categories/:slug`: Get details and products for a category.
- `POST /scraper/navigation`: Trigger full navigation scrape.
