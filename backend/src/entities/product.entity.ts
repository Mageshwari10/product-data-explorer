import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, OneToMany } from 'typeorm';
import { Category } from './category.entity';
import { ProductDetail } from './product-detail.entity';
import { Review } from './review.entity';

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: true })
    sourceId: string; // e.g., from World of Books

    @Column()
    title: string;

    @Column({ type: 'decimal', nullable: true })
    price: number;

    @Column({ nullable: true })
    currency: string;

    @Column({ nullable: true })
    imageUrl: string;

    @Column({ nullable: true })
    author: string;

    @Column({ unique: true })
    sourceUrl: string;

    @Column({ nullable: true })
    lastScrapedAt: Date;

    @ManyToOne(() => Category, (category) => category.products)
    category: Category;

    @OneToOne(() => ProductDetail, (detail) => detail.product, { cascade: true })
    detail: ProductDetail;

    @OneToMany(() => Review, (review) => review.product)
    reviews: Review[];
}
