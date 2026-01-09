import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ViewHistory } from '../entities/history.entity';
import { Product } from '../entities/product.entity';

@Injectable()
export class HistoryService {
    constructor(
        @InjectRepository(ViewHistory)
        private historyRepo: Repository<ViewHistory>,
        @InjectRepository(Product)
        private productRepo: Repository<Product>,
    ) { }

    async recordView(userId: string, productId: number) {
        const product = await this.productRepo.findOne({ where: { id: productId } });
        if (!product) return;

        // Check if already exists to update order (move to top)
        const existing = await this.historyRepo.findOne({
            where: { userId, product: { id: productId } }
        });

        if (existing) {
            existing.viewedAt = new Date();
            return this.historyRepo.save(existing);
        }

        const history = this.historyRepo.create({
            userId,
            product,
            viewedAt: new Date()
        });
        return this.historyRepo.save(history);
    }

    async getHistory(userId: string, limit = 10) {
        return this.historyRepo.find({
            where: { userId },
            order: { viewedAt: 'DESC' },
            take: limit
        });
    }
}
