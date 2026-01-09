import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScraperService } from './scraper.service';
import { ScraperController } from './scraper.controller';
import { Navigation } from '../entities/navigation.entity';
import { Category } from '../entities/category.entity';
import { Product } from '../entities/product.entity';
import { ScrapeJob } from '../entities/scrape-job.entity';
import { ProductDetail } from '../entities/product-detail.entity';
import { Review } from '../entities/review.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Navigation, Category, Product, ScrapeJob, ProductDetail, Review])],
    controllers: [ScraperController],
    providers: [ScraperService],
    exports: [ScraperService],
})
export class ScraperModule { }
