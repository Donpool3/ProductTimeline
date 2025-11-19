import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('business_contexts')
export class BusinessContext {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', name: 'problem_statement' })
  problemStatement: string;

  @Column({ type: 'text', name: 'business_impact' })
  businessImpact: string;

  @Column({ type: 'varchar', length: 20 })
  urgency: 'low' | 'medium' | 'high' | 'critical';

  @Column({ type: 'text', nullable: true })
  roi: string;

  @Column({ type: 'text', array: true, name: 'success_metrics' })
  successMetrics: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
