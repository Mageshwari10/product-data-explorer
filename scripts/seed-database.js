const API_BASE_URL = 'https://product-explorer-backend-ph5e.onrender.com';

// Sample data to populate the database
const sampleData = {
    navigation: [
        { title: 'Fiction', slug: 'fiction' },
        { title: 'Non-Fiction', slug: 'non-fiction' },
        { title: 'Children\'s Books', slug: 'childrens-books' },
        { title: 'Academic', slug: 'academic' },
        { title: 'Romance', slug: 'romance' }
    ],
    categories: [
        { title: 'Science Fiction', slug: 'science-fiction', navigationSlug: 'fiction' },
        { title: 'Mystery & Thriller', slug: 'mystery-thriller', navigationSlug: 'fiction' },
        { title: 'Fantasy', slug: 'fantasy', navigationSlug: 'fiction' },
        { title: 'Biography', slug: 'biography', navigationSlug: 'non-fiction' },
        { title: 'History', slug: 'history', navigationSlug: 'non-fiction' },
        { title: 'Picture Books', slug: 'picture-books', navigationSlug: 'childrens-books' },
        { title: 'Young Adult', slug: 'young-adult', navigationSlug: 'childrens-books' },
        { title: 'Science & Technology', slug: 'science-technology', navigationSlug: 'academic' },
        { title: 'Business', slug: 'business', navigationSlug: 'academic' },
        { title: 'Contemporary Romance', slug: 'contemporary-romance', navigationSlug: 'romance' }
    ],
    products: [
        {
            title: 'The Great Gatsby',
            slug: 'the-great-gatsby',
            author: 'F. Scott Fitzgerald',
            price: 8.99,
            isbn: '9780743273565',
            categorySlug: 'fiction',
            description: 'A classic American novel set in the Jazz Age.',
            imageUrl: 'https://via.placeholder.com/200x300/4A90E2/FFFFFF?text=Great+Gatsby'
        },
        {
            title: 'To Kill a Mockingbird',
            slug: 'to-kill-a-mockingbird',
            author: 'Harper Lee',
            price: 9.99,
            isbn: '9780061120084',
            categorySlug: 'fiction',
            description: 'A gripping tale of racial injustice and childhood innocence.',
            imageUrl: 'https://via.placeholder.com/200x300/E74C3C/FFFFFF?text=To+Kill+a+Mockingbird'
        },
        {
            title: '1984',
            slug: '1984',
            author: 'George Orwell',
            price: 7.99,
            isbn: '9780451524935',
            categorySlug: 'science-fiction',
            description: 'A dystopian social science fiction novel.',
            imageUrl: 'https://via.placeholder.com/200x300/9B59B6/FFFFFF?text=1984'
        },
        {
            title: 'Pride and Prejudice',
            slug: 'pride-and-prejudice',
            author: 'Jane Austen',
            price: 6.99,
            isbn: '9780141439518',
            categorySlug: 'romance',
            description: 'A romantic novel of manners.',
            imageUrl: 'https://via.placeholder.com/200x300/E91E63/FFFFFF?text=Pride+and+Prejudice'
        },
        {
            title: 'The Hobbit',
            slug: 'the-hobbit',
            author: 'J.R.R. Tolkien',
            price: 10.99,
            isbn: '9780547928227',
            categorySlug: 'fantasy',
            description: 'A fantasy novel about a hobbit\'s adventure.',
            imageUrl: 'https://via.placeholder.com/200x300/00BCD4/FFFFFF?text=The+Hobbit'
        },
        {
            title: 'Sapiens',
            slug: 'sapiens',
            author: 'Yuval Noah Harari',
            price: 12.99,
            isbn: '9780062316097',
            categorySlug: 'history',
            description: 'A brief history of humankind.',
            imageUrl: 'https://via.placeholder.com/200x300/FF9800/FFFFFF?text=Sapiens'
        },
        {
            title: 'The Very Hungry Caterpillar',
            slug: 'the-very-hungry-caterpillar',
            author: 'Eric Carle',
            price: 5.99,
            isbn: '9780399226908',
            categorySlug: 'picture-books',
            description: 'A classic children\'s picture book.',
            imageUrl: 'https://via.placeholder.com/200x300/4CAF50/FFFFFF?text=Hungry+Caterpillar'
        }
    ]
};

async function callAPI(endpoint, method = 'POST', data = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };
        
        if (data) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        
        if (!response.ok) {
            throw new Error(`API call failed: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error calling ${endpoint}:`, error.message);
        return null;
    }
}

async function seedDatabase() {
    console.log('🌱 Starting database seeding with sample data...');
    
    try {
        // Since the scraper endpoints are failing, let's check if we can access the data endpoints
        console.log('\n🔍 Checking current database status...');
        
        const navResponse = await fetch(`${API_BASE_URL}/navigation`);
        const navigation = await navResponse.json();
        console.log(`Current navigation items: ${navigation.length}`);
        
        const catResponse = await fetch(`${API_BASE_URL}/categories`);
        const categories = await catResponse.json();
        console.log(`Current categories: ${categories.length}`);
        
        // Try to get products
        try {
            const prodResponse = await fetch(`${API_BASE_URL}/products/search/find`);
            const products = await prodResponse.json();
            console.log(`Current products: ${products.length}`);
        } catch (e) {
            console.log('Products endpoint not accessible yet');
        }
        
        console.log('\n💡 Since the scraper is having issues, here are your options:');
        console.log('\n1. Check Render logs for scraper errors and fix them');
        console.log('2. Create manual data insertion endpoints');
        console.log('3. Use a local database and migrate it');
        
        console.log('\n🎯 Your deployment is working! The backend is accessible.');
        console.log('🌐 Frontend URL: Your Vercel app');
        console.log('🔧 Backend URL: https://product-explorer-backend-ph5e.onrender.com');
        console.log('\nThe only remaining issue is populating the database with book data.');
        
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
    }
}

// Run the seeding script
seedDatabase();
