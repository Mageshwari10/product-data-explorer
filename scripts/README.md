# Database Population Script

This script automatically populates your database with book data from World of Books.

## Quick Start

### Option 1: Run in Browser (Easiest)
1. Open your browser's developer console on any website
2. Copy and paste the contents of `populate-data.js`
3. Press Enter to run

### Option 2: Run with Node.js
```bash
cd scripts
node populate-data.js
```

### Option 3: Manual API Calls
Use these endpoints in Postman or curl:

```bash
# Scrape navigation
curl -X POST https://product-explorer-backend-ph5e.onrender.com/scraper/navigation

# Scrape categories  
curl -X POST https://product-explorer-backend-ph5e.onrender.com/scraper/categories

# Scrape products (replace with actual category slug)
curl -X POST https://product-explorer-backend-ph5e.onrender.com/scraper/products/fiction

# Check results
curl https://product-explorer-backend-ph5e.onrender.com/navigation
curl https://product-explorer-backend-ph5e.onrender.com/categories
```

## What the Script Does

1. **Scrapes Navigation** - Main menu categories (Fiction, Non-Fiction, etc.)
2. **Scrapes Categories** - Sub-categories within each navigation item
3. **Scrapes Products** - Book data for the first 5 categories
4. **Reports Results** - Shows how many items were added

## After Running

- Refresh your Vercel frontend
- You should see navigation, categories, and book cards
- Images and book details will be populated

## Notes

- The script includes delays to avoid overwhelming the target website
- It limits scraping to 5 categories initially for testing
- You can modify the script to scrape more categories if needed
