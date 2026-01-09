import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Navigation } from './entities/navigation.entity';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { ProductDetail } from './entities/product-detail.entity';
import { Review } from './entities/review.entity';
import { ScrapeJob } from './entities/scrape-job.entity';
import { ViewHistory } from './entities/history.entity';
import { NavigationModule } from './navigation/navigation.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { ScraperModule } from './scraper/scraper.module';
import { HistoryModule } from './history/history.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DATABASE_HOST,
            port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            entities: [Navigation, Category, Product, ProductDetail, Review, ScrapeJob, ViewHistory],
            synchronize: true, // Auto-create tables (dev only)
        }),
        TypeOrmModule.forFeature([Navigation, Category, Product, ProductDetail, Review, ScrapeJob, ViewHistory]),
        NavigationModule,
        CategoryModule,
        ProductModule,
        ScraperModule,
        HistoryModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
