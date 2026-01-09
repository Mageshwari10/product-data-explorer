import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NavigationService } from './navigation.service';
import { NavigationController } from './navigation.controller';
import { Navigation } from '../entities/navigation.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Navigation])],
    controllers: [NavigationController],
    providers: [NavigationService],
})
export class NavigationModule { }
