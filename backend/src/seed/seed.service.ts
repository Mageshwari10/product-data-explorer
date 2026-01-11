import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Navigation } from '../entities/navigation.entity';
import { Category } from '../entities/category.entity';
import { Product } from '../entities/product.entity';
import { ProductDetail } from '../entities/product-detail.entity';
import { Review } from '../entities/review.entity';

@Injectable()
export class SeedService {
    private readonly logger = new Logger(SeedService.name);

    constructor(
        @InjectRepository(Navigation)
        private navRepo: Repository<Navigation>,
        @InjectRepository(Category)
        private categoryRepo: Repository<Category>,
        @InjectRepository(Product)
        private productRepo: Repository<Product>,
        @InjectRepository(ProductDetail)
        private detailRepo: Repository<ProductDetail>,
        @InjectRepository(Review)
        private reviewRepo: Repository<Review>,
    ) {}

    async seedDatabase() {
        this.logger.log('Starting database seeding...');

        // Sample navigation data
        const navigationData = [
            { title: 'Fiction', slug: 'fiction' },
            { title: 'Non-Fiction', slug: 'non-fiction' },
            { title: 'Children\'s Books', slug: 'childrens-books' },
            { title: 'Academic', slug: 'academic' },
            { title: 'Romance', slug: 'romance' }
        ];

        // Create navigation items
        const navigationEntities = [];
        for (const nav of navigationData) {
            let existingNav = await this.navRepo.findOne({ where: { slug: nav.slug } });
            if (!existingNav) {
                existingNav = await this.navRepo.save(this.navRepo.create({
                    ...nav,
                    lastScrapedAt: new Date()
                }));
                this.logger.log(`Created navigation: ${nav.title}`);
            }
            navigationEntities.push(existingNav);
        }

        // Sample categories data
        const categoriesData = [
            { title: 'Science Fiction', slug: 'science-fiction', navSlug: 'fiction' },
            { title: 'Mystery & Thriller', slug: 'mystery-thriller', navSlug: 'fiction' },
            { title: 'Fantasy', slug: 'fantasy', navSlug: 'fiction' },
            { title: 'Biography', slug: 'biography', navSlug: 'non-fiction' },
            { title: 'History', slug: 'history', navSlug: 'non-fiction' },
            { title: 'Picture Books', slug: 'picture-books', navSlug: 'childrens-books' },
            { title: 'Young Adult', slug: 'young-adult', navSlug: 'childrens-books' },
            { title: 'Science & Technology', slug: 'science-technology', navSlug: 'academic' },
            { title: 'Business', slug: 'business', navSlug: 'academic' },
            { title: 'Contemporary Romance', slug: 'contemporary-romance', navSlug: 'romance' }
        ];

        // Create categories
        for (const cat of categoriesData) {
            const navigation = navigationEntities.find(nav => nav.slug === cat.navSlug);
            let existingCategory = await this.categoryRepo.findOne({ where: { slug: cat.slug } });
            if (!existingCategory && navigation) {
                existingCategory = await this.categoryRepo.save(this.categoryRepo.create({
                    title: cat.title,
                    slug: cat.slug,
                    navigation: navigation,
                    lastScrapedAt: new Date()
                }));
                this.logger.log(`Created category: ${cat.title}`);
            }
        }

        // Sample products data
        const productsData = [
            {
                title: 'The Great Gatsby',
                slug: 'the-great-gatsby',
                author: 'F. Scott Fitzgerald',
                price: 8.99,
                isbn: '9780743273565',
                categorySlug: 'fiction',
                description: 'A classic American novel set in the Jazz Age.',
                imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop',
                rating: 4.5,
                publisher: 'Scribner',
                publishedDate: '1923-04-10'
            },
            {
                title: 'To Kill a Mockingbird',
                slug: 'to-kill-a-mockingbird',
                author: 'Harper Lee',
                price: 9.99,
                isbn: '9780061120084',
                categorySlug: 'fiction',
                description: 'A gripping tale of racial injustice and childhood innocence.',
                imageUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&h=300&fit=crop',
                rating: 4.8,
                publisher: 'J.B. Lippincott & Co.',
                publishedDate: '1960-07-11'
            },
            {
                title: '1984',
                slug: '1984',
                author: 'George Orwell',
                price: 7.99,
                isbn: '9780451524935',
                categorySlug: 'science-fiction',
                description: 'A dystopian social science fiction novel.',
                imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop',
                rating: 4.6,
                publisher: 'Secker & Warburg',
                publishedDate: '1949-06-08'
            },
            {
                title: 'Pride and Prejudice',
                slug: 'pride-and-prejudice',
                author: 'Jane Austen',
                price: 6.99,
                isbn: '9780141439518',
                categorySlug: 'romance',
                description: 'A romantic novel of manners.',
                imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop',
                rating: 4.7,
                publisher: 'T. Egerton',
                publishedDate: '1813-01-28'
            },
            {
                title: 'The Hobbit',
                slug: 'the-hobbit',
                author: 'J.R.R. Tolkien',
                price: 10.99,
                isbn: '9780547928227',
                categorySlug: 'fantasy',
                description: 'A fantasy novel about a hobbit\'s adventure.',
                imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=200&h=300&fit=crop',
                rating: 4.9,
                publisher: 'George Allen & Unwin',
                publishedDate: '1937-09-21'
            },
            {
                title: 'Sapiens',
                slug: 'sapiens',
                author: 'Yuval Noah Harari',
                price: 12.99,
                isbn: '9780062316097',
                categorySlug: 'history',
                description: 'A brief history of humankind.',
                imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop',
                rating: 4.4,
                publisher: 'Harper',
                publishedDate: '2011-09-04'
            },
            {
                title: 'The Very Hungry Caterpillar',
                slug: 'the-very-hungry-caterpillar',
                author: 'Eric Carle',
                price: 5.99,
                isbn: '9780399226908',
                categorySlug: 'picture-books',
                description: 'A classic children\'s picture book.',
                imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop',
                rating: 4.8,
                publisher: 'World Publishing Company',
                publishedDate: '1969-06-03'
            },
            {
                title: 'The Lean Startup',
                slug: 'the-lean-startup',
                author: 'Eric Ries',
                price: 14.99,
                isbn: '9780307887894',
                categorySlug: 'business',
                description: 'How today\'s entrepreneurs use continuous innovation.',
                imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop',
                rating: 4.2,
                publisher: 'Crown Business',
                publishedDate: '2011-09-13'
            }
        ];

        // Create products
        for (const productData of productsData) {
            const category = await this.categoryRepo.findOne({ where: { slug: productData.categorySlug } });
            let existingProduct = await this.productRepo.findOne({ where: { sourceUrl: `https://example.com/book/${productData.slug}` } });
            
            if (!existingProduct && category) {
                existingProduct = await this.productRepo.save(this.productRepo.create({
                    title: productData.title,
                    sourceId: productData.isbn,
                    price: productData.price,
                    currency: 'USD',
                    imageUrl: productData.imageUrl,
                    author: productData.author,
                    sourceUrl: `https://example.com/book/${productData.slug}`,
                    category: category,
                    lastScrapedAt: new Date()
                }));

                // Create product details
                await this.detailRepo.save(this.detailRepo.create({
                    product: existingProduct,
                    description: productData.description,
                    ratingsAvg: productData.rating,
                    reviewsCount: 2
                }));

                // Create sample reviews
                const sampleReviews = [
                    {
                        rating: 5,
                        text: 'Excellent book! Highly recommended.',
                        author: 'Book Lover',
                        createdAt: new Date(),
                        product: existingProduct
                    },
                    {
                        rating: 4,
                        text: 'Good read, enjoyed it thoroughly.',
                        author: 'Avid Reader',
                        createdAt: new Date(),
                        product: existingProduct
                    }
                ];

                for (const reviewData of sampleReviews) {
                    await this.reviewRepo.save(this.reviewRepo.create(reviewData));
                }

                this.logger.log(`Created product: ${productData.title}`);
            }
        }

        this.logger.log('Database seeding completed successfully!');
    }
}
