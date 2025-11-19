import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Phase } from './phase.entity';
import { Milestone } from './milestone.entity';

export interface ProjectMetadata {
  tags: string[];
  stakeholders: Array<{
    name: string;
    role: string;
  }>;
  customFields: Record<string, any>;
}

@Entity('projects')
@Index(['status'])
@Index(['createdAt'])
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 500, name: 'documentation_path' })
  documentationPath: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'active',
  })
  status: 'active' | 'archived' | 'completed';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'created_by' })
  createdBy: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: ProjectMetadata;

  // Relations
  @OneToMany(() => Phase, (phase) => phase.project)
  phases: Phase[];

  @OneToMany(() => Milestone, (milestone) => milestone.project)
  milestones: Milestone[];
}
