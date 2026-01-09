import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { ViewHistory } from '../entities/history.entity';
import { Product } from '../entities/product.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ViewHistory, Product])],
    providers: [HistoryService],
    controllers: [HistoryController],
    exports: [HistoryService],
})
export class HistoryModule { }
