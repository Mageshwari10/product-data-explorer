import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ScraperService } from './scraper.service';

@Controller('scraper')
export class ScraperController {
    constructor(private readonly scraperService: ScraperService) { }

    @Post('navigation')
    async scrapeNavigation() {
        await this.scraperService.scrapeNavigation();
        return { message: 'Navigation scrape triggered' };
    }

    @Post('debug')
    async scrapeDebug() {
        await this.scraperService.debugCategoryHtml();
        return { message: 'Debug scrape triggered' };
    }

    @Post('products/:slug')
    async scrapeProducts(@Param('slug') slug: string) {
        await this.scraperService.scrapeProducts(slug);
        return { message: `Started scraping products for category: ${slug}` };
    }

    @Post('product/:id/details')
    async scrapeProductDetails(@Param('id') id: number) {
        await this.scraperService.scrapeDetail(id, true);
        return { message: `Updated details for product ${id}` };
    }
}
