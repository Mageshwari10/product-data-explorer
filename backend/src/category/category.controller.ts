import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    @Get(':slug')
    async findOne(
        @Param('slug') slug: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 12
    ) {
        const { category, total } = await this.categoryService.findOneBySlug(slug, Number(page), Number(limit));
        if (!category) {
            throw new NotFoundException('Category not found');
        }
        return { ...category, totalProducts: total };
    }
}
