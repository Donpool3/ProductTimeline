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

@Entity('decisions')
@Index(['milestoneId'])
@Index(['projectId'])
@Index(['date'])
export class Decision {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'project_id' })
  projectId: string;

  @Column({ type: 'uuid', name: 'milestone_id' })
  milestoneId: string;

  @Column({ type: 'varchar', length: 500 })
  title: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ type: 'text' })
  context: string;

  @Column({ type: 'text', array: true, default: '{}', name: 'options_considered' })
  optionsConsidered: string[];

  @Column({ type: 'text', name: 'chosen_approach' })
  chosenApproach: string;

  @Column({ type: 'text' })
  rationale: string;

  @Column({ type: 'text', array: true, default: '{}' })
  stakeholders: string[];

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Milestone, (milestone) => milestone.decisions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'milestone_id' })
  milestone: Milestone;
}
