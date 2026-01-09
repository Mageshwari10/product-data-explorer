import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum ScrapeStatus {
    PENDING = 'PENDING',
    RUNNING = 'RUNNING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
}

@Entity()
export class ScrapeJob {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    targetUrl: string;

    @Column()
    targetType: string; // 'NAVIGATION', 'CATEGORY', 'PRODUCT'

    @Column({
        type: 'simple-enum',
        enum: ScrapeStatus,
        default: ScrapeStatus.PENDING
    })
    status: ScrapeStatus;

    @Column({ nullable: true })
    startedAt: Date;

    @Column({ nullable: true })
    finishedAt: Date;

    @Column({ type: 'text', nullable: true })
    errorLog: string;
}
