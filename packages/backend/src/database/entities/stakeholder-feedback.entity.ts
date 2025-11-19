import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Milestone } from './milestone.entity';

@Entity('stakeholder_feedback')
@Index(['milestoneId'])
@Index(['stakeholder'])
export class StakeholderFeedback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'milestone_id' })
  milestoneId: string;

  @Column({ type: 'varchar', length: 255 })
  stakeholder: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  role: string;

  @Column({ type: 'text' })
  feedback: string;

  @Column({ type: 'varchar', length: 20 })
  sentiment: 'positive' | 'neutral' | 'concern' | 'blocker';

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ type: 'text', nullable: true })
  context: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => Milestone, (milestone) => milestone.stakeholderFeedback, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'milestone_id' })
  milestone: Milestone;
}
