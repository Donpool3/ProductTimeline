/**
 * Core type definitions for Product Timeline Application
 */

export interface Project {
  id: string;
  name: string;
  description: string;
  documentationPath: string;
  status: 'active' | 'archived' | 'completed';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  metadata: ProjectMetadata;
}

export interface ProjectMetadata {
  tags: string[];
  stakeholders: Stakeholder[];
  customFields: Record<string, unknown>;
}

export interface Stakeholder {
  name: string;
  role: string;
}

export interface Phase {
  id: string;
  projectId: string;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  order: number;
  color: string;
  milestoneCount: number;
}

export interface Milestone {
  id: string;
  projectId: string;
  phaseId: string;
  title: string;
  description: string;
  date: string;
  type: 'auto' | 'manual';
  source?: string;
  narrative?: string;
  artifacts: Artifact[];
  metrics: Metric[];
  decisions: Decision[];
  stakeholders: string[];
}

export interface Artifact {
  id: string;
  milestoneId: string;
  type: 'document' | 'code' | 'diagram' | 'test' | 'screenshot';
  name: string;
  filePath: string;
  preview?: string;
  metadata: Record<string, unknown>;
}

export interface Metric {
  id: string;
  name: string;
  value: number;
  unit?: string;
  timestamp: string;
}

export interface Decision {
  id: string;
  title: string;
  context: string;
  optionsConsidered: string[];
  chosenApproach: string;
  rationale: string;
  date: string;
}

export interface Timeline {
  projectId: string;
  phases: Phase[];
  milestones: Milestone[];
}

export interface TimelineFilters {
  dateRange?: { start: Date; end: Date };
  phases?: string[];
  stakeholders?: string[];
  showDecisionsOnly?: boolean;
}
