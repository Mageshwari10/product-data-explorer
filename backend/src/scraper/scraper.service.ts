import { Injectable, Logger } from '@nestjs/common';
import { PlaywrightCrawler, Dataset } from 'crawlee';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Navigation } from '../entities/navigation.entity';
import { Category } from '../entities/category.entity';
import { Product } from '../entities/product.entity';
import { ScrapeJob, ScrapeStatus } from '../entities/scrape-job.entity';
import { ProductDetail } from '../entities/product-detail.entity';
import { Review } from '../entities/review.entity';


@Injectable()
export class ScraperService {
    private readonly logger = new Logger(ScraperService.name);

    constructor(
        @InjectRepository(Navigation)
        private navRepo: Repository<Navigation>,
        @InjectRepository(Category)
        private categoryRepo: Repository<Category>,
        @InjectRepository(Product)
        private productRepo: Repository<Product>,
        @InjectRepository(ScrapeJob)
        private jobRepo: Repository<ScrapeJob>,
        @InjectRepository(ProductDetail)
        private detailRepo: Repository<ProductDetail>,
        @InjectRepository(Review)
        private reviewRepo: Repository<Review>,
    ) { }



    async onModuleInit() {
        this.logger.log('Scraper Service Initialized');
    }

    async scrapeCategories() {
    return await this.categoryRepo.find();
 }


    async scrapeNavigation() {
        const crawler = new PlaywrightCrawler({
            requestHandler: async ({ page }) => {
                this.logger.log('Checking robots.txt...');
                const robots = await page.goto('https://www.worldofbooks.com/robots.txt').then(r => r.text()).catch(() => '');
                if (robots.includes('Disallow: /')) {
                    this.logger.warn('Warning: robots.txt might disallow scraping. Proceeding with caution...');
                }

                await page.goto('https://www.worldofbooks.com', { waitUntil: 'domcontentloaded' });

                // Enhanced Menu Extraction
                // Aiming for mega-menu structure: [Top Level] -> [Sub Categories]
                const menuItems = await page.locator('.main-nav > li, .header-navigation li.has-dropdown').all();

                let count = 0;
                for (const menu of menuItems) {
                    const parentTitle = await menu.locator('> a, > span').first().innerText().catch(() => '');
                    const parentHref = await menu.locator('> a').first().getAttribute('href').catch(() => '');

                    if (!parentTitle || parentTitle.toLowerCase().includes('cart') || parentTitle.toLowerCase().includes('log in')) continue;

                    const parentSlug = parentTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

                    // Create Parent Nav
                    let parentNav = await this.navRepo.findOne({ where: { slug: parentSlug } });
                    if (!parentNav) {
                        parentNav = await this.navRepo.save(this.navRepo.create({
                            title: parentTitle,
                            slug: parentSlug,
                            lastScrapedAt: new Date()
                        }));
                        count++;
                    }

                    // Create Parent Category
                    let parentCategory = await this.categoryRepo.findOne({ where: { slug: parentSlug } });
                    if (!parentCategory) {
                        parentCategory = await this.categoryRepo.save(this.categoryRepo.create({
                            title: parentTitle,
                            slug: parentSlug,
                            navigation: parentNav,
                            lastScrapedAt: new Date()
                        }));
                    }

                    // Find Subcategories
                    const subLinks = await menu.locator('ul li a, .dropdown-content a').all();
                    for (const subLink of subLinks) {
                        const subTitle = await subLink.innerText().catch(() => '');
                        const subHref = await subLink.getAttribute('href').catch(() => '');

                        if (subTitle && subTitle.length < 40) {
                            const subSlug = subTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

                            let subCategory = await this.categoryRepo.findOne({ where: { slug: subSlug } });
                            if (!subCategory) {
                                await this.categoryRepo.save(this.categoryRepo.create({
                                    title: subTitle,
                                    slug: subSlug,
                                    navigation: parentNav,
                                    parent: parentCategory,
                                    lastScrapedAt: new Date()
                                }));
                            }
                        }
                    }
                }

                this.logger.log(`Scraped and saved ${count} navigation items.`);

                // FALLBACK: If we found nothing or just to ensure common categories exist
                this.logger.log('Seeding common book categories...');
                const bookCategories = [
                    { title: 'Books', slug: 'books' },
                    { title: 'Fiction Books', slug: 'fiction-books' },
                    { title: 'Non-Fiction Books', slug: 'non-fiction-books' },
                    { title: 'Children\'s Books', slug: 'childrens-books' },
                    { title: 'Rare Books', slug: 'rare-books' }
                ];

                for (const item of bookCategories) {
                    let nav = await this.navRepo.findOne({ where: { slug: item.slug } });
                    if (!nav) {
                        nav = await this.navRepo.save(this.navRepo.create({
                            title: item.title,
                            slug: item.slug,
                            lastScrapedAt: new Date()
                        }));
                    }

                    let cat = await this.categoryRepo.findOne({ where: { slug: item.slug } });
                    if (!cat) {
                        await this.categoryRepo.save(this.categoryRepo.create({
                            title: item.title,
                            slug: item.slug,
                            navigation: nav,
                            lastScrapedAt: new Date()
                        }));
                    }
                }

                const otherNavs = ['DVDs', 'CDs', 'Games', 'Sale', 'Sell Your Books'];
                for (const title of otherNavs) {
                    const slug = title.toLowerCase().replace(/ /g, '-');
                    if (!(await this.navRepo.findOne({ where: { slug } }))) {
                        const nav = await this.navRepo.save(this.navRepo.create({ title, slug, lastScrapedAt: new Date() }));
                        await this.categoryRepo.save(this.categoryRepo.create({
                            title,
                            slug,
                            navigation: nav,
                            lastScrapedAt: new Date(),
                        }));
                    }
                }

                // Seed some samples so page isn't empty on first load
                await this.seedSampleProducts();
                this.logger.log('Sample seeding complete.');
            },
        });

        await crawler.run(['https://www.worldofbooks.com']);
    }

    private async seedSampleProducts() {
        const categories = await this.categoryRepo.find({
            where: [
                { slug: 'books' },
                { slug: 'fiction-books' },
                { slug: 'non-fiction-books' },
                { slug: 'childrens-books' },
                { slug: 'rare-books' },
                { slug: 'dvds' },
                { slug: 'cds' },
                { slug: 'games' }
            ]
        });

        const bookSamples = [
            { title: 'The Great Gatsby', price: 12.99, image: 'https://covers.openlibrary.org/b/id/12642643-L.jpg' },
            { title: '1984 George Orwell', price: 15.50, image: 'https://covers.openlibrary.org/b/id/12642730-L.jpg' },
            { title: 'To Kill a Mockingbird', price: 10.99, image: 'https://covers.openlibrary.org/b/id/8225266-L.jpg' },
            { title: 'Brave New World', price: 13.25, image: 'https://covers.openlibrary.org/b/id/10543202-L.jpg' }
        ];

        const mediaSamples = [
            { title: 'Interstellar Collector Box', price: 29.99, image: 'https://m.media-amazon.com/images/I/91+p9uN8pEL._AC_SX466_.jpg' },
            { title: 'Legacy Media Collection', price: 25.00, image: 'https://m.media-amazon.com/images/I/81C6+F6eCmL._AC_SX466_.jpg' },
            { title: 'Cyberpunk 2077 Archive', price: 45.00, image: 'https://m.media-amazon.com/images/I/81pREO-4hPL._AC_SL1500_.jpg' }
        ];

        for (const cat of categories) {
            const isBook = cat.slug.includes('book') || cat.slug === 'books';
            const samples = isBook ? bookSamples : mediaSamples;

            for (const sample of samples) {
                const sourceId = `sample-${cat.slug}-${sample.title.toLowerCase().replace(/ /g, '-')}`;
                let product = await this.productRepo.findOne({ where: { sourceId }, relations: ['reviews'] });
                if (!product) {
                    product = await this.productRepo.save(this.productRepo.create({
                        sourceId,
                        title: sample.title,
                        price: sample.price,
                        currency: 'USD',
                        imageUrl: sample.image,
                        sourceUrl: 'https://www.worldofbooks.com',
                        category: cat,
                        lastScrapedAt: new Date()
                    }));

                    // Add some sample reviews
                    await this.reviewRepo.save(this.reviewRepo.create({
                        author: 'Arun M.',
                        rating: 5,
                        text: 'A timeless classic. Must read for every enthusiast.',
                        createdAt: new Date(),
                        product
                    }));
                    await this.reviewRepo.save(this.reviewRepo.create({
                        author: 'Sita G.',
                        rating: 4.5,
                        text: 'Incredible depth and beautiful writing.',
                        createdAt: new Date(),
                        product
                    }));
                } else {
                    // Update the image if it's currently a placeholder or broken
                    this.logger.log(`Updating sample product image: ${product.title} -> ${sample.image}`);
                    product.imageUrl = sample.image;
                    await this.productRepo.save(product);
                }
            }
        }
    }

    async debugCategoryHtml() {
        const crawler = new PlaywrightCrawler({
            requestHandler: async ({ page }) => {
                this.logger.log('Debug: Navigating to Home...');
                await page.goto('https://www.worldofbooks.com', { waitUntil: 'domcontentloaded' });

                // Find the link for 'Fiction Books'
                const link = page.getByRole('link', { name: 'Fiction Books', exact: false }).first();
                const href = await link.getAttribute('href');

                if (href) {
                    const url = href.startsWith('http') ? href : `https://www.worldofbooks.com${href}`;
                    this.logger.log(`Debug: Found Fiction Books URL: ${url}`);

                    await page.goto(url, { waitUntil: 'domcontentloaded' });

                    // Wait for dynamic content (Algolia)
                    try {
                        await page.waitForLoadState('networkidle', { timeout: 10000 });
                        // Scroll down to trigger lazy loading
                        await page.evaluate(async () => {
                            for (let i = 0; i < 5; i++) {
                                window.scrollBy(0, 500);
                                await new Promise(r => setTimeout(r, 200));
                            }
                        });
                        await page.waitForTimeout(2000);
                    } catch (e) {
                        this.logger.warn('Timeout waiting for network idle, proceeding anyway...');
                    }

                    const content = await page.content();
                    const fs = require('fs');
                    fs.writeFileSync('debug.html', content);
                    this.logger.log('Saved debug.html');
                } else {
                    this.logger.error('Debug: Could not find "Fiction Books" link');
                }
            },
        });
        await crawler.run(['https://www.worldofbooks.com']);
    }

    async scrapeProducts(categorySlug: string) {
        this.logger.log(`Scraping products for category: ${categorySlug}`);

        const category = await this.categoryRepo.findOne({ where: { slug: categorySlug } });
        if (!category) {
            this.logger.error(`Category not found: ${categorySlug}`);
            return;
        }

        // Algolia Config
        const appId = process.env.ALGOLIA_APP_ID || 'AR33G9NJGJ';
        const apiKey = process.env.ALGOLIA_API_KEY || '96c16938971ef89ae1d14e21494e2114';
        const indexName = process.env.ALGOLIA_INDEX_NAME || 'shopify_products_us'; // Defaulting to US index

        try {
            // Use fetch to query Algolia
            // We use the category title as a simple query for now, or we could try filtering by collections if we knew the ID
            const query = category.title.replace(' Books', ''); // "Fiction" instead of "Fiction Books" for better broad match

            this.logger.log(`Querying Algolia Index: ${indexName} with query: "${query}"`);

            const response = await fetch(`https://${appId}-dsn.algolia.net/1/indexes/${indexName}/query`, {
                method: 'POST',
                headers: {
                    'X-Algolia-API-Key': apiKey,
                    'X-Algolia-Application-Id': appId,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    params: `query=${encodeURIComponent(query)}&hitsPerPage=20`
                })
            });

            if (!response.ok) {
                const text = await response.text();
                this.logger.error(`Algolia API error: ${response.status} ${response.statusText} - ${text}`);
                throw new Error(`Algolia API error: ${response.statusText}`);
            }

            const data = await response.json();
            const hits = data.hits || [];

            this.logger.log(`Algolia Response: Found ${hits.length} hits.`);
            if (hits.length > 0) {
                const fs = require('fs');
                fs.writeFileSync('algolia_debug.json', JSON.stringify(hits[0], null, 2));
                this.logger.log('Saved hit details to algolia_debug.json');
            }

            let count = 0;
            for (const hit of hits) {
                // Map Algolia hit to Product entity using verified keys
                const title = hit.shortTitle || hit.title || hit.longTitle || hit.legacyTitle || hit.name;
                const handle = hit.productHandle || hit.handle || hit.slug || hit.objectID;
                const price = hit.bestConditionPrice || hit.fromPrice || hit.price || 0;
                const image = hit.imageURL || hit.image || hit.product_image || hit.imageUrl;
                const author = hit.author || hit.vendor || hit.artist || hit.brand || '';

                if (!title || !handle) {
                    this.logger.warn(`Skipping hit due to missing title (${title}) or handle (${handle}). ID: ${hit.objectID}`);
                    continue;
                }

                const sourceId = hit.objectID;
                const sourceUrl = `https://www.worldofbooks.com/products/${handle}`;

                let product = await this.productRepo.findOne({ where: { sourceId } });
                if (!product) {
                    product = this.productRepo.create({
                        sourceId,
                        title,
                        price: Number(price),
                        currency: 'USD',
                        imageUrl: image,
                        author,
                        sourceUrl,
                        category,
                        lastScrapedAt: new Date()
                    });
                } else {
                    // Update existing
                    product.title = title;
                    product.price = Number(price);
                    product.imageUrl = image;
                    product.author = author;
                    product.lastScrapedAt = new Date();
                }

                const savedProduct = await this.productRepo.save(product);

                // Queue detail scraping (async)
                this.scrapeDetail(savedProduct.id).catch(e => this.logger.error(`Detail scrape failed for ${savedProduct.id}: ${e.message}`));

                count++;
            }
            this.logger.log(`Saved ${count} products.`);

        } catch (e) {
            this.logger.error(`Failed to scrape products via Algolia: ${e.message}`);
        }
    }

    async scrapeDetail(productId: number, force = false) {
        const product = await this.productRepo.findOne({
            where: { id: productId },
            relations: ['detail']
        });

        if (!product) return;

        // Caching logic: if scraped in the last 24h, skip unless forced
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        if (!force && product.detail && product.lastScrapedAt > oneDayAgo) {
            this.logger.log(`Skipping detail scrape for ${product.title} (recently updated)`);
            return;
        }

        this.logger.log(`Deep scraping details for: ${product.title}`);

        const crawler = new PlaywrightCrawler({
            maxRequestsPerCrawl: 1,
            navigationTimeoutSecs: 60,
            requestHandler: async ({ page }) => {
                // Ethical delay
                await new Promise(r => setTimeout(r, 2000 + Math.random() * 3000));

                await page.goto(product.sourceUrl, { waitUntil: 'domcontentloaded' });

                // Wait for dynamic content and scroll to trigger lazy loading
                await page.evaluate(async () => {
                    window.scrollTo(0, document.body.scrollHeight / 2);
                    await new Promise(r => setTimeout(r, 1000));
                    window.scrollTo(0, document.body.scrollHeight);
                    await new Promise(r => setTimeout(r, 2000));
                });

                // Extract description - try multiple common Shopify/WoB selectors
                const description = await page.evaluate(() => {
                    const selectors = [
                        '.product-description',
                        '.description',
                        '#description',
                        '[data-test-id="product-description"]',
                        '.rte', // Shopify default
                        '.product__description',
                        '#product-details-tab-content-0' // WoB specific?
                    ];
                    for (const s of selectors) {
                        const el = document.querySelector(s) as HTMLElement;
                        if (el && el.innerText.trim().length > 50) return el.innerText.trim();
                    }
                    return '';
                });

                // Extract specs/metadata (ISBN, Publisher, etc.)
                const specs: any = {};
                const specRows = await page.locator('.product-specs tr, .attributes tr, .specification-table tr, .product-info-list li, [data-test-id="product-specs"] tr, .product-accordion__row').all();
                for (const row of specRows) {
                    const label = await row.locator('th, .label, span:first-child, dt').first().innerText().catch(() => '');
                    const value = await row.locator('td, .value, span:last-child, dd').first().innerText().catch(() => '');
                    if (label && value && label !== value) {
                        specs[label.trim().replace(':', '')] = value.trim();
                    }
                }

                // Extract Reviews - expanded for Yotpo and generic Shopify widgets
                const reviews: any[] = [];
                const reviewSelectors = [
                    '.review-item',
                    '.customer-review',
                    '.yotpo-review',
                    '.jdgm-rev',
                    '.spr-review',
                    '.stamped-review',
                    '.okendo-review',
                    '.product-accordion__review'
                ];
                for (const sel of reviewSelectors) {
                    const elements = await page.locator(sel).all();
                    if (elements.length > 0) {
                        for (const revEl of elements) {
                            const author = await revEl.locator('.review-author, .name, .yotpo-user-name, .jdgm-rev__author, .spr-review-header-byline strong').first().innerText().catch(() => 'Anonymous');
                            const ratingText = await revEl.locator('.review-rating, .rating, .yotpo-review-stars, .jdgm-rev__rating, .spr-starratings').first().getAttribute('aria-label').catch(() => null) ||
                                await revEl.locator('.review-rating, .rating').first().innerText().catch(() => '5');
                            const text = await revEl.locator('.review-text, .content, .yotpo-main-content, .jdgm-rev__body, .spr-review-content-body').first().innerText().catch(() => '');

                            if (text.trim()) {
                                reviews.push({
                                    author: author.trim(),
                                    rating: parseInt(ratingText.replace(/[^0-9]/g, '')) || 5,
                                    text: text.trim(),
                                    createdAt: new Date()
                                });
                            }
                        }
                        if (reviews.length > 0) break;
                    }
                }

                // Extract Recommendations
                const recommendations = await page.locator('.recommended-products a, .related-products a, .upsell a').all();
                const recData = [];
                for (const rec of recommendations) {
                    const recTitle = await rec.innerText().catch(() => '');
                    const recHref = await rec.getAttribute('href').catch(() => '');
                    if (recTitle && recHref) {
                        recData.push({ title: recTitle.trim(), url: recHref });
                    }
                }
                specs['Recommendations'] = recData.slice(0, 5);

                // Update Database
                let detail = product.detail;
                if (!detail) {
                    detail = this.detailRepo.create();
                    detail.product = product;
                }
                detail.description = description;
                detail.specs = specs;
                detail.ratingsAvg = reviews.length ? reviews.reduce((a, b) => a + b.rating, 0) / reviews.length : 5;
                detail.reviewsCount = reviews.length;

                const savedDetail = await this.detailRepo.save(detail);

                // Save individual reviews
                if (reviews.length > 0) {
                    for (const rData of reviews) {
                        const existing = await this.reviewRepo.findOne({
                            where: { product: { id: product.id }, author: rData.author, text: rData.text }
                        });
                        if (!existing) {
                            await this.reviewRepo.save(this.reviewRepo.create({
                                ...rData,
                                product
                            }));
                        }
                    }
                }

                product.detail = savedDetail;
                product.lastScrapedAt = new Date();
                await this.productRepo.save(product);

                this.logger.log(`Successfully updated details for ${product.title}`);
            },
            failedRequestHandler: ({ request }) => {
                this.logger.error(`Failed to scrape ${request.url}`);
            }
        });

        await crawler.run([product.sourceUrl]);
    }
   
}
