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

export interface ArtifactMetadata {
  fileSize?: number;
  mimeType?: string;
  lineCount?: number;
  language?: string;
  [key: string]: any;
}

@Entity('artifacts')
@Index(['milestoneId'])
@Index(['type'])
export class Artifact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'milestone_id' })
  milestoneId: string;

  @Column({ type: 'varchar', length: 100 })
  type: string;

  @Column({ type: 'varchar', length: 500 })
  name: string;

  @Column({ type: 'varchar', length: 1000, name: 'file_path' })
  filePath: string;

  @Column({ type: 'text', nullable: true })
  preview: string | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: ArtifactMetadata;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Milestone, (milestone) => milestone.artifacts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'milestone_id' })
  milestone: Milestone;
}
