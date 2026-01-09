import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Category } from './category.entity';

@Entity()
export class Navigation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ unique: true })
    slug: string;

    @Column({ nullable: true })
    lastScrapedAt: Date;

    @OneToMany(() => Category, (category) => category.navigation)
    categories: Category[];
}
