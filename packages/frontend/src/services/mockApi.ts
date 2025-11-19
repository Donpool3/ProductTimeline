/**
 * Mock API Service
 *
 * Provides mock data for development and testing without requiring a backend.
 * Can be toggled via VITE_MOCK_MODE environment variable.
 */

import { Project, Timeline, Phase, Milestone } from '../types';
import { getMockDelay } from '../utils/env';
import { mockDataGenerator, MockProjectConfig } from './mockDataGenerator';

// Mock delay to simulate network latency
const MOCK_DELAY = getMockDelay();

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock warehouse reception project
const mockWarehouseProject: Project = {
  id: 'warehouse-reception-001',
  name: 'Warehouse Physical Reception App',
  description: 'Mobile app for streamlining warehouse receiving process',
  documentationPath: '/mock/warehouse-reception',
  status: 'active',
  createdAt: new Date('2025-11-15').toISOString(),
  updatedAt: new Date('2025-11-19').toISOString(),
  createdBy: 'don.hiles@qts.com',
  metadata: {
    tags: ['mobile', 'warehouse', 'phase-1'],
    stakeholders: [
      { name: 'Don Hiles', role: 'Product Manager' },
      { name: 'Will', role: 'Warehouse Ops Lead' },
      { name: 'Steven Jackson', role: 'Air Traffic Controller' },
    ],
    customFields: {
      businessImpact: 'Eliminate 6,000 item Frustrated List',
      expectedROI: '2 FTE contractors saved',
    },
  },
};

const mockPhases: Phase[] = [
  {
    id: 'phase-discovery',
    projectId: 'warehouse-reception-001',
    name: 'Discovery',
    description: 'Warehouse tour and problem identification',
    startDate: new Date('2025-11-15').toISOString(),
    endDate: new Date('2025-11-17').toISOString(),
    order: 1,
    color: '#FF6B6B',
    milestoneCount: 3,
  },
  {
    id: 'phase-requirements',
    projectId: 'warehouse-reception-001',
    name: 'Requirements',
    description: 'Requirements gathering and specification',
    startDate: new Date('2025-11-18').toISOString(),
    endDate: new Date('2025-11-18').toISOString(),
    order: 2,
    color: '#4ECDC4',
    milestoneCount: 2,
  },
  {
    id: 'phase-design',
    projectId: 'warehouse-reception-001',
    name: 'Design',
    description: 'System architecture and design',
    startDate: new Date('2025-11-18').toISOString(),
    endDate: new Date('2025-11-18').toISOString(),
    order: 3,
    color: '#45B7D1',
    milestoneCount: 1,
  },
  {
    id: 'phase-implementation',
    projectId: 'warehouse-reception-001',
    name: 'Implementation',
    description: 'Development and testing',
    startDate: new Date('2025-11-19').toISOString(),
    endDate: undefined,
    order: 4,
    color: '#96CEB4',
    milestoneCount: 8,
  },
];

const mockMilestones: Milestone[] = [
  // Discovery Phase
  {
    id: 'milestone-warehouse-tour',
    projectId: 'warehouse-reception-001',
    phaseId: 'phase-discovery',
    title: 'Warehouse Tour and Stakeholder Interviews',
    description: 'Conducted tour of Richmond warehouse, interviewed key stakeholders',
    date: new Date('2025-11-15').toISOString(),
    type: 'auto',
    source: "WarehouseResearch/QTS Warehouse Tour_Bernie's Notes.md",
    narrative:
      'The warehouse tour revealed critical pain points: the "Frustrated List" with 6,000+ items requiring 2 FTE contractors to resolve. Ship To errors account for 80% of issues, BOM errors 15%. Inbound volume expected to triple by Summer 2026.',
    artifacts: [
      {
        id: 'artifact-tour-notes',
        milestoneId: 'milestone-warehouse-tour',
        type: 'document',
        name: 'Warehouse Tour Notes',
        filePath: "WarehouseResearch/QTS Warehouse Tour_Bernie's Notes.md",
        preview: 'The core issue revolves around data inaccuracies...',
        metadata: { fileSize: 5420, mimeType: 'text/markdown' },
      },
      {
        id: 'artifact-equipment-photo',
        milestoneId: 'milestone-warehouse-tour',
        type: 'screenshot',
        name: 'Equipment Label Photo',
        filePath: 'WarehouseResearch/EQLabelPics/1000007089.jpeg',
        preview: undefined,
        metadata: { fileSize: 245000, mimeType: 'image/jpeg' },
      },
    ],
    metrics: [],
    decisions: [],
    stakeholders: ['Will', 'Steven Jackson', 'Brent'],
    stakeholderFeedback: [
      {
        id: 'feedback-1',
        milestoneId: 'milestone-warehouse-tour',
        stakeholder: 'Will',
        role: 'Warehouse Operations Lead',
        feedback: 'We need this badly. The Frustrated List is killing us and volume is about to triple.',
        sentiment: 'concern',
        date: new Date('2025-11-15').toISOString(),
        context: 'During warehouse tour',
      },
    ],
    businessContext: {
      id: 'bc-1',
      problemStatement: 'Warehouse has 6,000+ items on Frustrated List requiring 2 FTE contractors to resolve',
      businessImpact: 'Eliminate manual reconciliation, save 2 FTE contractors, prepare for 3x volume increase',
      urgency: 'high',
      roi: '2 FTE contractors saved, improved accuracy, faster receiving',
      successMetrics: ['Reduce Frustrated List to <100 items', 'Eliminate manual contractor work', 'Handle 3x volume increase'],
    },
    lessonsLearned: [
      {
        id: 'lesson-1',
        milestoneId: 'milestone-warehouse-tour',
        lesson: 'On-site observation is critical. The real problems were different from what was initially described.',
        category: 'process',
        impact: 'high',
        actionable: 'Always start with stakeholder interviews and site visits',
        date: new Date('2025-11-15').toISOString(),
      },
    ],
    quickNotes: [],
    meetings: [],
  },
  {
    id: 'milestone-stakeholder-interviews',
    projectId: 'warehouse-reception-001',
    phaseId: 'phase-discovery',
    title: 'Detailed Stakeholder Interviews',
    description: 'In-depth interviews with warehouse staff and management',
    date: new Date('2025-11-16').toISOString(),
    type: 'manual',
    narrative:
      'Conducted detailed interviews with warehouse staff to understand daily workflows and pain points. Key insight: current process requires manual data entry and reconciliation, leading to errors and delays.',
    artifacts: [],
    metrics: [],
    decisions: [],
    stakeholders: ['Will', 'Warehouse Staff'],
    stakeholderFeedback: [],
    lessonsLearned: [],
    quickNotes: [],
    meetings: [],
  },
  {
    id: 'milestone-problem-analysis',
    projectId: 'warehouse-reception-001',
    phaseId: 'phase-discovery',
    title: 'Problem Analysis and Root Cause Identification',
    description: 'Analyzed data to identify root causes of Frustrated List',
    date: new Date('2025-11-17').toISOString(),
    type: 'manual',
    narrative:
      'Analysis revealed that 80% of Frustrated List items stem from Ship To errors, 15% from BOM errors, and 5% from other causes. Root cause: data entry happens too late in the process.',
    artifacts: [],
    metrics: [
      {
        id: 'metric-ship-to-errors',
        name: 'Ship To Errors',
        value: 80,
        unit: '%',
        timestamp: new Date('2025-11-17').toISOString(),
      },
      {
        id: 'metric-bom-errors',
        name: 'BOM Errors',
        value: 15,
        unit: '%',
        timestamp: new Date('2025-11-17').toISOString(),
      },
    ],
    decisions: [],
    stakeholders: ['Don Hiles', 'Will'],
    stakeholderFeedback: [],
    lessonsLearned: [],
    quickNotes: [],
    meetings: [],
  },
  // Requirements Phase
  {
    id: 'milestone-requirements-doc',
    projectId: 'warehouse-reception-001',
    phaseId: 'phase-requirements',
    title: 'Requirements Document Completed',
    description: 'Comprehensive requirements with 15 user stories',
    date: new Date('2025-11-18T10:00:00').toISOString(),
    type: 'auto',
    source: '.kiro/specs/warehouse-physical-reception/requirements.md',
    narrative:
      'Requirements focused on core receiving workflow: TIN scanning, container entry, photo capture, and batch management. Prioritized offline-first architecture for warehouse environment.',
    artifacts: [
      {
        id: 'artifact-requirements',
        milestoneId: 'milestone-requirements-doc',
        type: 'document',
        name: 'Requirements Document',
        filePath: '.kiro/specs/warehouse-physical-reception/requirements.md',
        preview: 'Requirements Document with 15 user stories and 67 acceptance criteria',
        metadata: { fileSize: 15000, mimeType: 'text/markdown' },
      },
    ],
    metrics: [
      {
        id: 'metric-requirements-count',
        name: 'Requirements Count',
        value: 15,
        unit: 'user stories',
        timestamp: new Date('2025-11-18').toISOString(),
      },
      {
        id: 'metric-acceptance-criteria',
        name: 'Acceptance Criteria',
        value: 67,
        unit: 'criteria',
        timestamp: new Date('2025-11-18').toISOString(),
      },
    ],
    decisions: [
      {
        id: 'decision-react-native',
        title: 'Chose React Native over Native Development',
        context: 'Need to deliver quickly with limited mobile development resources',
        optionsConsidered: [
          'Native iOS/Android (separate codebases)',
          'React Native (shared codebase)',
          'Flutter',
        ],
        chosenApproach: 'React Native with TypeScript',
        rationale:
          'Team has React experience, single codebase reduces development time, mature ecosystem for offline storage and camera integration',
        date: new Date('2025-11-18').toISOString(),
      },
    ],
    stakeholders: ['Don Hiles', 'Will'],
    stakeholderFeedback: [],
    lessonsLearned: [],
    quickNotes: [],
    meetings: [],
  },
  {
    id: 'milestone-requirements-review',
    projectId: 'warehouse-reception-001',
    phaseId: 'phase-requirements',
    title: 'Requirements Review Meeting',
    description: 'Stakeholder review and approval of requirements',
    date: new Date('2025-11-18T15:00:00').toISOString(),
    type: 'manual',
    narrative:
      'Requirements approved by all stakeholders. Team aligned on offline-first approach and React Native technology choice.',
    artifacts: [],
    metrics: [],
    decisions: [],
    stakeholders: ['Don Hiles', 'Will', 'Development Team'],
    stakeholderFeedback: [],
    lessonsLearned: [],
    quickNotes: [],
    meetings: [],
  },
  // Design Phase
  {
    id: 'milestone-design-doc',
    projectId: 'warehouse-reception-001',
    phaseId: 'phase-design',
    title: 'Design Document Completed',
    description: 'System architecture and component design',
    date: new Date('2025-11-18T18:00:00').toISOString(),
    type: 'auto',
    source: '.kiro/specs/warehouse-physical-reception/design.md',
    narrative:
      'Design focused on offline-first architecture with SQLite local storage, Redux state management, and modular service layer. Defined clear separation between UI, business logic, and data access.',
    artifacts: [
      {
        id: 'artifact-design',
        milestoneId: 'milestone-design-doc',
        type: 'document',
        name: 'Design Document',
        filePath: '.kiro/specs/warehouse-physical-reception/design.md',
        preview: 'System architecture and component design',
        metadata: { fileSize: 25000, mimeType: 'text/markdown' },
      },
    ],
    metrics: [],
    decisions: [
      {
        id: 'decision-sqlite',
        title: 'Chose SQLite for Offline Storage',
        context: 'Need reliable offline data storage with sync capabilities',
        optionsConsidered: [
          'AsyncStorage (key-value)',
          'SQLite (relational)',
          'Realm (object DB)',
        ],
        chosenApproach: 'SQLite with TypeORM',
        rationale:
          'Relational model fits our data structure, TypeORM provides type safety, proven solution for React Native offline apps',
        date: new Date('2025-11-18').toISOString(),
      },
    ],
    stakeholders: ['Don Hiles', 'Development Team'],
    stakeholderFeedback: [],
    lessonsLearned: [],
    quickNotes: [],
    meetings: [],
  },
  // Implementation Phase
  {
    id: 'milestone-task-1',
    projectId: 'warehouse-reception-001',
    phaseId: 'phase-implementation',
    title: 'Task 1: Project Setup Complete',
    description: 'React Native project initialized with dependencies',
    date: new Date('2025-11-19T10:00:00').toISOString(),
    type: 'auto',
    source: 'WarehouseReception/docs/TASK_1_IMPLEMENTATION.md',
    narrative:
      'Project scaffolding complete with React Native, TypeScript, Redux Toolkit, and SQLite configured. Development environment ready.',
    artifacts: [],
    metrics: [
      {
        id: 'metric-dependencies',
        name: 'Dependencies Installed',
        value: 25,
        unit: 'packages',
        timestamp: new Date('2025-11-19T10:00:00').toISOString(),
      },
    ],
    decisions: [],
    stakeholders: ['Development Team'],
    stakeholderFeedback: [],
    lessonsLearned: [],
    quickNotes: [],
    meetings: [],
  },
  {
    id: 'milestone-task-2',
    projectId: 'warehouse-reception-001',
    phaseId: 'phase-implementation',
    title: 'Task 2: Authentication System',
    description: 'Login screen and authentication flow implemented',
    date: new Date('2025-11-19T12:00:00').toISOString(),
    type: 'auto',
    source: 'WarehouseReception/docs/TASK_2_IMPLEMENTATION.md',
    narrative:
      'Authentication system complete with login screen, JWT token management, and secure storage. Users can now log in and access the app.',
    artifacts: [],
    metrics: [],
    decisions: [],
    stakeholders: ['Development Team'],
    stakeholderFeedback: [],
    lessonsLearned: [],
    quickNotes: [],
    meetings: [],
  },
  {
    id: 'milestone-task-3',
    projectId: 'warehouse-reception-001',
    phaseId: 'phase-implementation',
    title: 'Task 3: Database Schema',
    description: 'SQLite database schema and entities created',
    date: new Date('2025-11-19T14:00:00').toISOString(),
    type: 'auto',
    source: 'WarehouseReception/docs/TASK_3_IMPLEMENTATION.md',
    narrative:
      'Database schema implemented with TypeORM entities for TINs, containers, batches, and equipment. Offline storage foundation ready.',
    artifacts: [],
    metrics: [],
    decisions: [],
    stakeholders: ['Development Team'],
    stakeholderFeedback: [],
    lessonsLearned: [],
    quickNotes: [],
    meetings: [],
  },
  {
    id: 'milestone-task-4',
    projectId: 'warehouse-reception-001',
    phaseId: 'phase-implementation',
    title: 'Task 4: Main Menu Screen',
    description: 'Main navigation menu implemented',
    date: new Date('2025-11-19T15:00:00').toISOString(),
    type: 'auto',
    source: 'WarehouseReception/docs/TASK_4_IMPLEMENTATION.md',
    narrative:
      'Main menu provides navigation to all core features: TIN scanning, active TINs list, batch summary, and settings.',
    artifacts: [],
    metrics: [],
    decisions: [],
    stakeholders: ['Development Team'],
    stakeholderFeedback: [],
    lessonsLearned: [],
    quickNotes: [],
    meetings: [],
  },
  {
    id: 'milestone-task-5',
    projectId: 'warehouse-reception-001',
    phaseId: 'phase-implementation',
    title: 'Task 5: TIN Scanning',
    description: 'TIN barcode scanning and validation',
    date: new Date('2025-11-19T16:30:00').toISOString(),
    type: 'auto',
    source: 'WarehouseReception/docs/TASK_5_IMPLEMENTATION.md',
    narrative:
      'TIN scanning implemented with barcode reader integration, validation, and error handling. Users can now scan TINs to start receiving process.',
    artifacts: [],
    metrics: [],
    decisions: [],
    stakeholders: ['Development Team'],
    stakeholderFeedback: [],
    lessonsLearned: [],
    quickNotes: [],
    meetings: [],
  },
  {
    id: 'milestone-task-6',
    projectId: 'warehouse-reception-001',
    phaseId: 'phase-implementation',
    title: 'Task 6: Container Entry',
    description: 'Container data entry screen',
    date: new Date('2025-11-19T18:00:00').toISOString(),
    type: 'auto',
    source: 'WarehouseReception/docs/TASK_6_IMPLEMENTATION.md',
    narrative:
      'Container entry screen allows users to input container details, scan barcodes, and capture photos. Offline data storage working.',
    artifacts: [],
    metrics: [],
    decisions: [],
    stakeholders: ['Development Team'],
    stakeholderFeedback: [],
    lessonsLearned: [],
    quickNotes: [],
    meetings: [],
  },
  {
    id: 'milestone-task-7',
    projectId: 'warehouse-reception-001',
    phaseId: 'phase-implementation',
    title: 'Task 7: Active TINs List',
    description: 'List view of active TINs with status',
    date: new Date('2025-11-19T19:30:00').toISOString(),
    type: 'auto',
    source: 'WarehouseReception/docs/TASK_7_IMPLEMENTATION.md',
    narrative:
      'Active TINs list displays all in-progress receiving work with status indicators. Users can resume work on any TIN.',
    artifacts: [],
    metrics: [],
    decisions: [],
    stakeholders: ['Development Team'],
    stakeholderFeedback: [],
    lessonsLearned: [],
    quickNotes: [],
    meetings: [],
  },
  {
    id: 'milestone-task-8',
    projectId: 'warehouse-reception-001',
    phaseId: 'phase-implementation',
    title: 'Task 8: Photo Capture',
    description: 'Camera integration for equipment photos',
    date: new Date('2025-11-19T21:00:00').toISOString(),
    type: 'auto',
    source: 'WarehouseReception/docs/TASK_8_IMPLEMENTATION.md',
    narrative:
      'Photo capture integrated with camera permissions, image storage, and thumbnail generation. Users can document equipment condition.',
    artifacts: [],
    metrics: [],
    decisions: [],
    stakeholders: ['Development Team'],
    stakeholderFeedback: [],
    lessonsLearned: [],
    quickNotes: [],
    meetings: [],
  },
];

/**
 * Mock API Client
 * Simulates backend API responses with realistic data
 */
export class MockApiClient {
  private additionalProjects: Project[] = [];

  /**
   * Generate additional mock projects
   */
  generateAdditionalProjects(count: number, config?: MockProjectConfig): void {
    this.additionalProjects = mockDataGenerator.generateMultipleProjects(count, config);
  }

  /**
   * Get all projects
   */
  async getProjects(): Promise<Project[]> {
    await delay(MOCK_DELAY);
    return [mockWarehouseProject, ...this.additionalProjects];
  }

  /**
   * Get a single project by ID
   */
  async getProject(projectId: string): Promise<Project> {
    await delay(MOCK_DELAY);
    if (projectId === mockWarehouseProject.id) {
      return mockWarehouseProject;
    }
    throw new Error('Project not found');
  }

  /**
   * Get timeline for a project
   */
  async getTimeline(projectId: string): Promise<Timeline> {
    await delay(MOCK_DELAY);
    return {
      projectId,
      phases: mockPhases,
      milestones: mockMilestones,
    };
  }

  /**
   * Get phases for a project
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getPhases(_projectId: string): Promise<Phase[]> {
    await delay(MOCK_DELAY);
    return mockPhases;
  }

  /**
   * Get milestones for a project
   */
  async getMilestones(_projectId: string, phaseId?: string): Promise<Milestone[]> {
    await delay(MOCK_DELAY);
    if (phaseId) {
      return mockMilestones.filter((m) => m.phaseId === phaseId);
    }
    return mockMilestones;
  }
}

// Export singleton instance
export const mockApiClient = new MockApiClient();

// Generate additional mock projects for demo purposes
mockApiClient.generateAdditionalProjects(4, {
  phaseCount: 4,
  milestonesPerPhase: 3,
  includeNarratives: true,
  includeDecisions: true,
  includeMetrics: true,
});
