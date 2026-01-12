// Quick script to populate your database with sample book data
// Run this in your browser console or with Node.js

const API_BASE_URL = 'https://product-explorer-backend-ph5e.onrender.com';

async function populateDatabase() {
    console.log('🌱 Populating database with sample books...');
    
    try {
        const response = await fetch(`${API_BASE_URL}/seed`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ Success:', result.message);
            
            // Check the results
            console.log('\n📊 Checking populated data...');
            
            const navResponse = await fetch(`${API_BASE_URL}/navigation`);
            const navigation = await navResponse.json();
            console.log(`🧭 Navigation items: ${navigation.length}`);

            const categoriesCount = Array.isArray(navigation)
                ? navigation.reduce((sum, n) => sum + (Array.isArray(n.categories) ? n.categories.length : 0), 0)
                : 0;
            console.log(`📂 Categories (from navigation): ${categoriesCount}`);

            const prodResponse = await fetch(`${API_BASE_URL}/products/search/find`);
            const prodData = await prodResponse.json();
            const productsCount = Array.isArray(prodData?.products) ? prodData.products.length : 0;
            console.log(`� Products: ${productsCount}`);

            if (Array.isArray(navigation) && navigation[0]?.slug) {
                const sampleSlug = navigation[0].slug;
                const sampleCatResponse = await fetch(`${API_BASE_URL}/categories/${sampleSlug}?page=1&limit=5`);
                const sampleCat = await sampleCatResponse.json();
                const sampleCatProducts = Array.isArray(sampleCat?.products) ? sampleCat.products.length : 0;
                console.log(`🧪 Sample category '${sampleSlug}' products: ${sampleCatProducts}`);
            }
            
            console.log('\n🎉 Database populated successfully!');
            console.log('🌐 Refresh your Vercel frontend to see the data!');
            
        } else {
            console.error('❌ Failed to populate database:', response.statusText);
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Auto-run the script
populateDatabase();
