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
  stakeholderFeedback: StakeholderFeedback[];
  businessContext?: BusinessContext;
  lessonsLearned: LessonLearned[];
  quickNotes: QuickNote[];
  meetings: Meeting[];
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

export interface StakeholderFeedback {
  id: string;
  milestoneId: string;
  stakeholder: string;
  role: string;
  feedback: string;
  sentiment: 'positive' | 'neutral' | 'concern' | 'blocker';
  date: string;
  context?: string;
}

export interface BusinessContext {
  id: string;
  problemStatement: string;
  businessImpact: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  roi?: string;
  successMetrics: string[];
}

export interface LessonLearned {
  id: string;
  milestoneId: string;
  lesson: string;
  category: 'technical' | 'process' | 'communication' | 'planning' | 'other';
  impact: 'low' | 'medium' | 'high';
  actionable?: string;
  date: string;
}

export interface QuickNote {
  id: string;
  milestoneId: string;
  content: string;
  audioUrl?: string;
  capturedAt: string;
  capturedBy: string;
  tags?: string[];
  processed: boolean;
}

export interface Meeting {
  id: string;
  milestoneId: string;
  title: string;
  date: string;
  participants: string[];
  purpose: string;
  outcomes: string[];
  notes?: string;
}

export interface TimelineFilters {
  dateRange?: { start: Date; end: Date };
  phases?: string[];
  stakeholders?: string[];
  showDecisionsOnly?: boolean;
}
