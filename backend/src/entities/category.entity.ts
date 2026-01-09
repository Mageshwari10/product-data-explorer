import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Navigation } from './navigation.entity';
import { Product } from './product.entity';

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ unique: true })
    slug: string;

    @Column({ nullable: true })
    productCount: number;

    @Column({ nullable: true })
    lastScrapedAt: Date;

    @ManyToOne(() => Navigation, (nav) => nav.categories)
    navigation: Navigation;

    @ManyToOne(() => Category, (cat) => cat.subcategories, { nullable: true })
    parent: Category;

    @OneToMany(() => Category, (cat) => cat.parent)
    subcategories: Category[];

    // Note: Products typically belong to leaf categories, but we can simplify
    @OneToMany(() => Product, (product) => product.category)
    products: Product[];
}
