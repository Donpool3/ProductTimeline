import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Milestone } from './milestone.entity';

@Entity('meetings')
@Index(['milestoneId'])
@Index(['date'])
export class Meeting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'milestone_id' })
  milestoneId: string;

  @Column({ type: 'varchar', length: 500 })
  title: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ type: 'text', array: true, default: '{}' })
  participants: string[];

  @Column({ type: 'text' })
  purpose: string;

  @Column({ type: 'text', array: true, default: '{}' })
  outcomes: string[];

  @Column({ type: 'uuid', array: true, default: '{}', name: 'decision_ids' })
  decisionIds: string[];

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Milestone, (milestone) => milestone.meetings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'milestone_id' })
  milestone: Milestone;
}
