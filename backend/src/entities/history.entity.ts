import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ViewHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: string; // Store a client-generated UUID to persist across reloads

    @ManyToOne(() => Product, { eager: true })
    product: Product;

    @CreateDateColumn()
    viewedAt: Date;
}
