import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    author: string;

    @Column({ type: 'decimal', nullable: true })
    rating: number;

    @Column({ type: 'text', nullable: true })
    text: string;

    @Column({ nullable: true })
    createdAt: Date;

    @ManyToOne(() => Product, (product) => product.reviews)
    product: Product;
}
