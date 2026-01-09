import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { HistoryService } from './history.service';

@Controller('history')
export class HistoryController {
    constructor(private readonly historyService: HistoryService) { }

    @Post()
    async recordView(
        @Body('userId') userId: string,
        @Body('productId') productId: number
    ) {
        return this.historyService.recordView(userId, productId);
    }

    @Get()
    async getHistory(
        @Query('userId') userId: string,
        @Query('limit') limit: number
    ) {
        return this.historyService.getHistory(userId, limit || 10);
    }
}
