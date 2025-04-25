import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('billing_records')
@Index('idx_product_location', ['product_code', 'location'])
@Index('idx_product_code', ['product_code'])
@Index('idx_location', ['location'])
export class BillingRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  first_name: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  last_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  photo_url: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  product_code: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  location: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  premium_paid: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
