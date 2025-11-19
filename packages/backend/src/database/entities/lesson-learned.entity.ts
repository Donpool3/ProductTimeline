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

@Entity('lessons_learned')
@Index(['milestoneId'])
@Index(['category'])
@Index(['impact'])
export class LessonLearned {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'milestone_id' })
  milestoneId: string;

  @Column({ type: 'text' })
  lesson: string;

  @Column({ type: 'varchar', length: 50 })
  category: 'technical' | 'process' | 'communication' | 'planning' | 'other';

  @Column({ type: 'varchar', length: 20 })
  impact: 'low' | 'medium' | 'high';

  @Column({ type: 'text', nullable: true })
  actionable: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => Milestone, (milestone) => milestone.lessonsLearned, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'milestone_id' })
  milestone: Milestone;
}
