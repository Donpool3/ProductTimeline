import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Project } from './project.entity';
import { Milestone } from './milestone.entity';

@Entity('phases')
@Index(['projectId'])
@Index(['projectId', 'orderIndex'])
export class Phase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'project_id' })
  projectId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamp', name: 'start_date' })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'end_date' })
  endDate: Date;

  @Column({ type: 'integer', name: 'order_index' })
  orderIndex: number;

  @Column({ type: 'varchar', length: 7, nullable: true })
  color: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Project, (project) => project.phases, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @OneToMany(() => Milestone, (milestone) => milestone.phase)
  milestones: Milestone[];
}
