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

@Entity('quick_notes')
@Index(['milestoneId'])
@Index(['capturedBy'])
@Index(['processed'])
export class QuickNote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'milestone_id' })
  milestoneId: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 1000, nullable: true, name: 'audio_url' })
  audioUrl: string;

  @Column({ type: 'timestamp', name: 'captured_at' })
  capturedAt: Date;

  @Column({ type: 'varchar', length: 255, name: 'captured_by' })
  capturedBy: string;

  @Column({ type: 'text', array: true, default: '{}' })
  tags: string[];

  @Column({ type: 'boolean', default: false })
  processed: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => Milestone, (milestone) => milestone.quickNotes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'milestone_id' })
  milestone: Milestone;
}
