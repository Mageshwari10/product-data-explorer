import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) { }

    async findOneBySlug(slug: string, page: number = 1, limit: number = 100): Promise<{ category: Category | null, total: number }> {
        const [category, total] = await Promise.all([
            this.categoryRepository.findOne({
                where: { slug },
                relations: ['subcategories'],
            }),
            this.categoryRepository.manager.count('product', { where: { category: { slug } } })
        ]);

        if (category) {
            category.products = await this.categoryRepository.manager.find('Product', {
                where: { category: { id: category.id } },
                relations: ['reviews'],
                skip: (page - 1) * limit,
                take: limit,
                order: { id: 'DESC' } as any
            }) as any;
        }

        return { category, total };
    }
}
