import { MockDataService } from './mock-data.service';

describe('MockDataService', () => {
  let service: MockDataService;

  beforeEach(() => {
    service = new MockDataService();
  });

  describe('generateMockProject', () => {
    it('should generate a project with required fields', () => {
      const project = service.generateMockProject();

      expect(project).toBeDefined();
      expect(project.id).toBeDefined();
      expect(project.name).toBe('Warehouse Physical Reception App');
      expect(project.status).toBe('active');
      expect(project.metadata).toBeDefined();
      expect(project.metadata.stakeholders).toHaveLength(3);
    });

    it('should generate project with custom date range', () => {
      const startDate = new Date('2025-01-01');
      const project = service.generateMockProject({
        dateRange: { start: startDate, end: new Date() },
      });

      expect(project.createdAt).toEqual(startDate);
    });
  });

  describe('generateMockPhases', () => {
    it('should generate default 4 phases', () => {
      const phases = service.generateMockPhases('test-project-id');

      expect(phases).toHaveLength(4);
      expect(phases[0].name).toBe('Discovery');
      expect(phases[1].name).toBe('Requirements');
      expect(phases[2].name).toBe('Design');
      expect(phases[3].name).toBe('Implementation');
    });

    it('should generate custom number of phases', () => {
      const phases = service.generateMockPhases('test-project-id', 2);

      expect(phases).toHaveLength(2);
    });

    it('should set correct order indices', () => {
      const phases = service.generateMockPhases('test-project-id');

      phases.forEach((phase, index) => {
        expect(phase.orderIndex).toBe(index + 1);
      });
    });
  });

  describe('generateMockTimeline', () => {
    it('should generate timeline with phases and milestones', () => {
      const timeline = service.generateMockTimeline('test-project-id');

      expect(timeline.phases).toBeDefined();
      expect(timeline.milestones).toBeDefined();
      expect(timeline.phases.length).toBeGreaterThan(0);
      expect(timeline.milestones.length).toBeGreaterThan(0);
    });

    it('should limit milestones when maxMilestones is set', () => {
      const timeline = service.generateMockTimeline('test-project-id', {
        maxMilestones: 5,
      });

      expect(timeline.milestones.length).toBeLessThanOrEqual(5);
    });
  });

  describe('generateMockMilestones', () => {
    it('should generate milestones for all phases', () => {
      const phases = service.generateMockPhases('test-project-id');
      const milestones = service.generateMockMilestones('test-project-id', phases);

      expect(milestones.length).toBeGreaterThan(0);

      // Verify milestones are associated with phases
      phases.forEach((phase) => {
        const phaseMilestones = milestones.filter((m) => m.phaseId === phase.id);
        expect(phaseMilestones.length).toBeGreaterThan(0);
      });
    });

    it('should include related entities in milestones', () => {
      const phases = service.generateMockPhases('test-project-id');
      const milestones = service.generateMockMilestones('test-project-id', phases);

      // Check first milestone has related data
      const firstMilestone = milestones[0];
      expect(firstMilestone.artifacts).toBeDefined();
      expect(firstMilestone.stakeholderFeedback).toBeDefined();
      expect(firstMilestone.businessContext).toBeDefined();
    });
  });

  describe('generateMockArtifacts', () => {
    it('should generate specified number of artifacts', () => {
      const artifacts = service.generateMockArtifacts('test-milestone-id', 3);

      expect(artifacts).toHaveLength(3);
    });

    it('should generate artifacts with required fields', () => {
      const artifacts = service.generateMockArtifacts('test-milestone-id', 2);

      artifacts.forEach((artifact) => {
        expect(artifact.id).toBeDefined();
        expect(artifact.milestoneId).toBe('test-milestone-id');
        expect(artifact.type).toBeDefined();
        expect(artifact.name).toBeDefined();
        expect(artifact.filePath).toBeDefined();
        expect(artifact.metadata).toBeDefined();
      });
    });
  });

  describe('generateMockMetrics', () => {
    it('should generate specified number of metrics', () => {
      const metrics = service.generateMockMetrics('test-project-id', 3);

      expect(metrics).toHaveLength(3);
    });

    it('should generate metrics with required fields', () => {
      const metrics = service.generateMockMetrics('test-project-id', 2);

      metrics.forEach((metric) => {
        expect(metric.id).toBeDefined();
        expect(metric.projectId).toBe('test-project-id');
        expect(metric.name).toBeDefined();
        expect(metric.value).toBeDefined();
        expect(metric.unit).toBeDefined();
      });
    });
  });
});
