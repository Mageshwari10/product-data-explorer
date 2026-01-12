# Product Data Explorer

A beautiful, responsive full-stack application to explore book data scraped from World of Books.

![Product Explorer](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)

## Features

- **Beautiful UI/UX** - Modern, responsive design with smooth animations
- **Product Browsing** - Browse books by categories
- **Search Functionality** - Find books quickly with instant search
- **Mobile-First** - Fully responsive design that works on all devices
- **Real-time Updates** - Live data scraping and updates
- **Professional Pages** - About and Contact pages with working forms

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **SWR** - Data fetching and caching

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeORM** - Object-relational mapping
- **PostgreSQL** - Database
- **Crawlee + Playwright** - Web scraping

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting

## Live Demo

- **Frontend**: [https://product-explorer-app.vercel.app](https://product-explorer-app.vercel.app)
- **Backend**: [https://product-explorer-backend.onrender.com](https://product-explorer-backend.onrender.com)

## Prerequisites

- Node.js (v18+)
- Docker & Docker Compose (for Database)

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/product-data-explorer.git
cd product-data-explorer
```

### 2. Start the Database
```bash
docker compose up -d
```
*Note: If Docker is not available, you must configure `backend/.env` to point to a running PostgreSQL instance.*

### 3. Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 4. Environment Setup

#### Backend Environment Variables
Create `backend/.env`:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/wob_explorer
JWT_SECRET=your-jwt-secret
PORT=3001
```

#### Frontend Environment Variables
Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 5. Run the Application

#### Start Backend
```bash
cd backend
npm run start:dev
```

#### Start Frontend
```bash
cd frontend
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
product-data-explorer/
├── frontend/                 # Next.js frontend
│   ├── app/                  # App router pages
│   │   ├── about/           # About page
│   │   ├── contact/         # Contact page
│   │   ├── category/        # Category pages
│   │   ├── product/         # Product detail pages
│   │   └── search/          # Search page
│   ├── components/          # Reusable components
│   │   ├── Navigation.tsx   # Main navigation
│   │   ├── ProductCard.tsx  # Product card component
│   │   └── Skeleton.tsx     # Loading skeletons
│   ├── lib/                 # Utility functions
│   └── public/              # Static files
├── backend/                  # NestJS backend
│   ├── src/
│   │   ├── modules/         # Feature modules
│   │   ├── shared/          # Shared modules
│   │   └── main.ts          # Application entry
│   └── prisma/              # Database schema
└── docker-compose.yml       # Database setup
```

## API Endpoints

- `GET /navigation` - Get navigation categories
- `GET /categories/:slug` - Get products by category
- `GET /products/search/find` - Search products
- `GET /products/:id` - Get product details
- `POST /scraper/products/:slug` - Trigger scraping for category

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- **Email**: contact@productexplorer.com
- **Website**: [https://product-explorer-app.vercel.app](https://product-explorer-app.vercel.app)
- **GitHub**: [@yourusername](https://github.com/yourusername)

## Acknowledgments

- World of Books for the book data source
- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework

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
