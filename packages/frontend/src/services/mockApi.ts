/**
 * Mock API Service
 *
 * Provides mock data for development and testing without requiring a backend.
 * Can be toggled via VITE_MOCK_MODE environment variable.
 */

import { Project, Timeline, Phase, Milestone } from '../types';
import { getMockDelay } from '../utils/env';

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
    artifacts: [],
    metrics: [],
    decisions: [],
    stakeholders: ['Will', 'Steven Jackson', 'Brent'],
  },
];

/**
 * Mock API Client
 * Simulates backend API responses with realistic data
 */
export class MockApiClient {
  /**
   * Get all projects
   */
  async getProjects(): Promise<Project[]> {
    await delay(MOCK_DELAY);
    return [mockWarehouseProject];
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
