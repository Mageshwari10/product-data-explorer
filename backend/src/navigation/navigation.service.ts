import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Navigation } from '../entities/navigation.entity';

@Injectable()
export class NavigationService {
    constructor(
        @InjectRepository(Navigation)
        private navigationRepository: Repository<Navigation>,
    ) { }

    async findAll(): Promise<Navigation[]> {
        return this.navigationRepository.find({ relations: ['categories'] });
    }
}
