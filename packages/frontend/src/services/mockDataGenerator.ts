/**
 * Mock Data Generator
 *
 * Provides utilities for generating realistic mock data for testing and development.
 * Can generate multiple projects with configurable parameters.
 */

import { Project, Phase, Milestone, Artifact, Metric, Decision } from '../types';

export interface MockProjectConfig {
  phaseCount?: number;
  milestonesPerPhase?: number;
  includeNarratives?: boolean;
  includeDecisions?: boolean;
  includeMetrics?: boolean;
  dateRange?: { start: Date; end: Date };
}

/**
 * Mock Data Generator Service
 */
export class MockDataGenerator {
  private idCounter = 0;

  /**
   * Generate a unique ID
   */
  private generateId(prefix: string = 'mock'): string {
    return `${prefix}-${Date.now()}-${this.idCounter++}`;
  }

  /**
   * Generate a mock project with configurable parameters
   */
  generateProject(name: string, config?: MockProjectConfig): Project {
    const startDate = config?.dateRange?.start || new Date('2025-11-01');
    const endDate = config?.dateRange?.end || new Date();

    return {
      id: this.generateId('project'),
      name,
      description: `Mock project: ${name}`,
      documentationPath: `/mock/${name.toLowerCase().replace(/\s+/g, '-')}`,
      status: 'active',
      createdAt: startDate.toISOString(),
      updatedAt: endDate.toISOString(),
      createdBy: 'mock.user@example.com',
      metadata: {
        tags: ['mock', 'generated'],
        stakeholders: [
          { name: 'Mock User', role: 'Product Manager' },
          { name: 'Mock Developer', role: 'Developer' },
        ],
        customFields: {
          mockData: true,
        },
      },
    };
  }

  /**
   * Generate mock phases for a project
   */
  generatePhases(projectId: string, count: number = 4): Phase[] {
    const phaseNames = ['Discovery', 'Requirements', 'Design', 'Implementation', 'Testing', 'Deployment'];
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DFE6E9'];

    const phases: Phase[] = [];
    const startDate = new Date('2025-11-01');

    for (let i = 0; i < Math.min(count, phaseNames.length); i++) {
      const phaseStart = new Date(startDate);
      phaseStart.setDate(phaseStart.getDate() + i * 7);

      const phaseEnd = new Date(phaseStart);
      phaseEnd.setDate(phaseEnd.getDate() + 6);

      phases.push({
        id: this.generateId('phase'),
        projectId,
        name: phaseNames[i],
        description: `${phaseNames[i]} phase`,
        startDate: phaseStart.toISOString(),
        endDate: i < count - 1 ? phaseEnd.toISOString() : undefined,
        order: i + 1,
        color: colors[i],
        milestoneCount: 0,
      });
    }

    return phases;
  }

  /**
   * Generate mock milestones for phases
   */
  generateMilestones(
    projectId: string,
    phases: Phase[],
    milestonesPerPhase: number = 3,
    config?: MockProjectConfig,
  ): Milestone[] {
    const milestones: Milestone[] = [];

    phases.forEach((phase, phaseIndex) => {
      for (let i = 0; i < milestonesPerPhase; i++) {
        const milestoneDate = new Date(phase.startDate);
        milestoneDate.setDate(milestoneDate.getDate() + i * 2);

        const milestone: Milestone = {
          id: this.generateId('milestone'),
          projectId,
          phaseId: phase.id,
          title: `${phase.name} Milestone ${i + 1}`,
          description: `Milestone ${i + 1} in ${phase.name} phase`,
          date: milestoneDate.toISOString(),
          type: i % 2 === 0 ? 'auto' : 'manual',
          source: i % 2 === 0 ? `/mock/doc-${phaseIndex}-${i}.md` : undefined,
          narrative: config?.includeNarratives
            ? `This is a mock narrative for ${phase.name} milestone ${i + 1}. It describes what happened and why it matters.`
            : undefined,
          artifacts: this.generateArtifacts(this.generateId('milestone'), 2),
          metrics: config?.includeMetrics ? this.generateMetrics(2) : [],
          decisions: config?.includeDecisions && i === 0 ? this.generateDecisions(1) : [],
          stakeholders: ['Mock User', 'Mock Developer'],
          stakeholderFeedback: [],
          lessonsLearned: [],
          quickNotes: [],
          meetings: [],
        };

        milestones.push(milestone);
      }
    });

    return milestones;
  }

  /**
   * Generate mock artifacts
   */
  private generateArtifacts(milestoneId: string, count: number): Artifact[] {
    const artifacts: Artifact[] = [];
    const types: Array<'document' | 'code' | 'diagram' | 'test' | 'screenshot'> = [
      'document',
      'code',
      'diagram',
      'test',
      'screenshot',
    ];

    for (let i = 0; i < count; i++) {
      artifacts.push({
        id: this.generateId('artifact'),
        milestoneId,
        type: types[i % types.length],
        name: `Mock Artifact ${i + 1}`,
        filePath: `/mock/artifact-${i}.md`,
        preview: 'Mock artifact preview content...',
        metadata: {
          fileSize: Math.floor(Math.random() * 10000) + 1000,
          mimeType: 'text/markdown',
        },
      });
    }

    return artifacts;
  }

  /**
   * Generate mock metrics
   */
  private generateMetrics(count: number): Metric[] {
    const metrics: Metric[] = [];
    const metricNames = [
      'Requirements Count',
      'Tasks Completed',
      'Test Coverage',
      'Lines of Code',
      'Velocity',
    ];
    const units = ['user stories', 'tasks', '%', 'lines', 'points/week'];

    for (let i = 0; i < Math.min(count, metricNames.length); i++) {
      metrics.push({
        id: this.generateId('metric'),
        name: metricNames[i],
        value: Math.floor(Math.random() * 100) + 1,
        unit: units[i],
        timestamp: new Date().toISOString(),
      });
    }

    return metrics;
  }

  /**
   * Generate mock decisions
   */
  private generateDecisions(count: number): Decision[] {
    const decisions: Decision[] = [];

    for (let i = 0; i < count; i++) {
      decisions.push({
        id: this.generateId('decision'),
        title: `Mock Decision ${i + 1}`,
        context: 'Context for this decision',
        optionsConsidered: ['Option A', 'Option B', 'Option C'],
        chosenApproach: 'Option B',
        rationale: 'We chose Option B because it provides the best balance of features and complexity.',
        date: new Date().toISOString(),
      });
    }

    return decisions;
  }

  /**
   * Generate a complete mock project with all data
   */
  generateCompleteProject(name: string, config?: MockProjectConfig): {
    project: Project;
    phases: Phase[];
    milestones: Milestone[];
  } {
    const project = this.generateProject(name, config);
    const phases = this.generatePhases(
      project.id,
      config?.phaseCount || 4,
    );
    const milestones = this.generateMilestones(
      project.id,
      phases,
      config?.milestonesPerPhase || 3,
      config,
    );

    // Update phase milestone counts
    phases.forEach((phase) => {
      phase.milestoneCount = milestones.filter((m) => m.phaseId === phase.id).length;
    });

    return { project, phases, milestones };
  }

  /**
   * Generate multiple mock projects
   */
  generateMultipleProjects(count: number, config?: MockProjectConfig): Project[] {
    const projects: Project[] = [];
    const projectNames = [
      'Warehouse Physical Reception App',
      'Customer Portal Redesign',
      'API Gateway Migration',
      'Mobile Analytics Dashboard',
      'Inventory Management System',
    ];

    for (let i = 0; i < Math.min(count, projectNames.length); i++) {
      const project = this.generateProject(projectNames[i], config);
      projects.push(project);
    }

    return projects;
  }
}

// Export singleton instance
export const mockDataGenerator = new MockDataGenerator();
