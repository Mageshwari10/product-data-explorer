import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) { }

    async findOne(id: number): Promise<Product | null> {
        return this.productRepository.findOne({
            where: { id },
            relations: ['detail', 'reviews', 'category'],
        });
    }

    // Placeholder for search/grid
    async findAll(categoryId: number, page: number = 1, limit: number = 20) {
        return this.productRepository.findAndCount({
            where: { category: { id: categoryId } },
            take: limit,
            skip: (page - 1) * limit,
        });
    }

    async search(query: string, page: number = 1, limit: number = 20) {
        return this.productRepository.findAndCount({
            where: [
                { title: ILike(`%${query}%`) },
                { author: ILike(`%${query}%`) },
            ],
            relations: ['category'],
            take: limit,
            skip: (page - 1) * limit,
            order: { lastScrapedAt: 'DESC' }
        });
    }
}
