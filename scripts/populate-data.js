const API_BASE_URL = 'https://product-explorer-backend-ph5e.onrender.com';

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function callAPI(endpoint, method = 'POST') {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            throw new Error(`API call failed: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error calling ${endpoint}:`, error.message);
        throw error;
    }
}

async function populateDatabase() {
    console.log('🚀 Starting database population...');
    
    try {
        // Step 1: Scrape Navigation
        console.log('\n📚 Step 1: Scraping navigation...');
        await callAPI('/scraper/navigation');
        console.log('✅ Navigation scraped successfully');
        await sleep(2000);
        
        // Step 2: Scrape Categories
        console.log('\n📂 Step 2: Scraping categories...');
        await callAPI('/scraper/categories');
        console.log('✅ Categories scraped successfully');
        await sleep(2000);
        
        // Step 3: Get available categories to scrape products
        console.log('\n🔍 Step 3: Getting categories to scrape products...');
        const categoriesResponse = await fetch(`${API_BASE_URL}/categories`);
        const categories = await categoriesResponse.json();
        
        if (categories.length === 0) {
            console.log('⚠️  No categories found. Trying to get navigation first...');
            const navResponse = await fetch(`${API_BASE_URL}/navigation`);
            const navigation = await navResponse.json();
            
            if (navigation.length > 0) {
                console.log(`Found ${navigation.length} navigation items. Scraping products for each...`);
                
                for (const navItem of navigation.slice(0, 5)) { // Limit to first 5 to avoid overloading
                    console.log(`📖 Scraping products for: ${navItem.title}`);
                    try {
                        await callAPI(`/scraper/products/${navItem.slug}`);
                        console.log(`✅ Products scraped for ${navItem.title}`);
                        await sleep(3000); // Wait between requests
                    } catch (error) {
                        console.error(`❌ Failed to scrape products for ${navItem.title}:`, error.message);
                    }
                }
            }
        } else {
            console.log(`Found ${categories.length} categories. Scraping products...`);
            
            for (const category of categories.slice(0, 5)) { // Limit to first 5
                console.log(`📖 Scraping products for: ${category.title}`);
                try {
                    await callAPI(`/scraper/products/${category.slug}`);
                    console.log(`✅ Products scraped for ${category.title}`);
                    await sleep(3000);
                } catch (error) {
                    console.error(`❌ Failed to scrape products for ${category.title}:`, error.message);
                }
            }
        }
        
        // Step 4: Wait and check final results
        console.log('\n⏳ Waiting for data to settle...');
        await sleep(5000);
        
        console.log('\n📊 Final Database Status:');
        
        // Check navigation
        const navResponse = await fetch(`${API_BASE_URL}/navigation`);
        const navigation = await navResponse.json();
        console.log(`🧭 Navigation items: ${navigation.length}`);
        
        // Check categories
        const catResponse = await fetch(`${API_BASE_URL}/categories`);
        const categoriesFinal = await catResponse.json();
        console.log(`📂 Categories: ${categoriesFinal.length}`);
        
        // Check products
        const prodResponse = await fetch(`${API_BASE_URL}/products/search/find`);
        const products = await prodResponse.json();
        console.log(`📚 Products: ${products.length}`);
        
        console.log('\n🎉 Database population completed!');
        console.log('🌐 Your frontend should now show data. Refresh your Vercel app!');
        
    } catch (error) {
        console.error('❌ Population failed:', error.message);
        console.log('\n💡 Try running the script again or check the backend logs.');
    }
}

// Run the population script
populateDatabase();
