import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductDetail {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'jsonb', nullable: true })
    specs: any;

    @Column({ type: 'decimal', nullable: true })
    ratingsAvg: number;

    @Column({ nullable: true })
    reviewsCount: number;

    @OneToOne(() => Product, (product) => product.detail)
    @JoinColumn()
    product: Product;
}
