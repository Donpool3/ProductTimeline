import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Project } from './project.entity';
import { Phase } from './phase.entity';
import { Artifact } from './artifact.entity';
import { Metric } from './metric.entity';
import { Decision } from './decision.entity';
import { StakeholderFeedback } from './stakeholder-feedback.entity';
import { LessonLearned } from './lesson-learned.entity';
import { QuickNote } from './quick-note.entity';
import { Meeting } from './meeting.entity';
import { BusinessContext } from './business-context.entity';

@Entity('milestones')
@Index(['projectId'])
@Index(['phaseId'])
@Index(['date'])
@Index(['type'])
export class Milestone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'project_id' })
  projectId: string;

  @Column({ type: 'uuid', name: 'phase_id' })
  phaseId: string;

  @Column({ type: 'varchar', length: 500 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ type: 'varchar', length: 20, default: 'auto' })
  type: 'auto' | 'manual';

  @Column({ type: 'varchar', length: 500, nullable: true })
  source: string;

  @Column({ type: 'text', nullable: true })
  narrative: string;

  @Column({ type: 'text', array: true, default: '{}' })
  stakeholders: string[];

  @Column({ type: 'uuid', nullable: true, name: 'business_context_id' })
  businessContextId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Project, (project) => project.milestones, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => Phase, (phase) => phase.milestones, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'phase_id' })
  phase: Phase;

  @OneToOne(() => BusinessContext, { nullable: true })
  @JoinColumn({ name: 'business_context_id' })
  businessContext: BusinessContext;

  @OneToMany(() => Artifact, (artifact) => artifact.milestone)
  artifacts: Artifact[];

  @OneToMany(() => Metric, (metric) => metric.milestone)
  metrics: Metric[];

  @OneToMany(() => Decision, (decision) => decision.milestone)
  decisions: Decision[];

  @OneToMany(
    () => StakeholderFeedback,
    (feedback) => feedback.milestone,
  )
  stakeholderFeedback: StakeholderFeedback[];

  @OneToMany(() => LessonLearned, (lesson) => lesson.milestone)
  lessonsLearned: LessonLearned[];

  @OneToMany(() => QuickNote, (note) => note.milestone)
  quickNotes: QuickNote[];

  @OneToMany(() => Meeting, (meeting) => meeting.milestone)
  meetings: Meeting[];
}
