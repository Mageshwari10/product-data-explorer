import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Get('search/find')
    async search(
        @Query('q') q: string,
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '20'
    ) {
        const [products, total] = await this.productService.search(q || '', +page, +limit);
        return { products, total };
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const product = await this.productService.findOne(+id);
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        return product;
    }
}
