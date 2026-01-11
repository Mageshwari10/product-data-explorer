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
            
            const catResponse = await fetch(`${API_BASE_URL}/categories`);
            const categories = await catResponse.json();
            console.log(`📂 Categories: ${categories?.length || 0}`);
            
            try {
                const prodResponse = await fetch(`${API_BASE_URL}/products/search/find`);
                const products = await prodResponse.json();
                console.log(`📚 Products: ${products?.length || 0}`);
            } catch (e) {
                console.log('📚 Products: Checking individual endpoints...');
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
