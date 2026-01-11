import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { Navigation } from '../entities/navigation.entity';
import { Category } from '../entities/category.entity';
import { Product } from '../entities/product.entity';
import { ProductDetail } from '../entities/product-detail.entity';
import { Review } from '../entities/review.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Navigation, Category, Product, ProductDetail, Review])
    ],
    controllers: [SeedController],
    providers: [SeedService],
})
export class SeedModule {}
