import { Injectable } from '@nestjs/common';
import {
  Project,
  Phase,
  Milestone,
  Artifact,
  Metric,
  Decision,
  StakeholderFeedback,
  LessonLearned,
  QuickNote,
  Meeting,
  BusinessContext,
} from '../database/entities';

export interface MockProjectConfig {
  phaseCount?: number;
  milestonesPerPhase?: number;
  includeNarratives?: boolean;
  includeDecisions?: boolean;
  includeMetrics?: boolean;
  dateRange?: { start: Date; end: Date };
}

export interface MockTimelineConfig {
  includeAllRelations?: boolean;
  maxMilestones?: number;
}

/**
 * Mock Data Service
 *
 * Generates realistic mock data for development and testing.
 * Provides configurable data generation for projects, timelines, and all related entities.
 */
@Injectable()
export class MockDataService {
  /**
   * Generate a complete mock project with all related data
   */
  generateMockProject(config?: MockProjectConfig): Project {
    const project = new Project();
    project.id = this.generateId();
    project.name = 'Warehouse Physical Reception App';
    project.description =
      'Mobile app for streamlining warehouse receiving process and eliminating the Frustrated List';
    project.documentationPath = '/mock/warehouse-reception';
    project.status = 'active';
    project.createdAt = config?.dateRange?.start || new Date('2025-11-15');
    project.updatedAt = new Date();
    project.createdBy = 'don.hiles@qts.com';
    project.metadata = {
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
    };

    return project;
  }

  /**
   * Generate mock timeline with phases and milestones
   */
  generateMockTimeline(
    projectId: string,
    config?: MockTimelineConfig,
  ): { phases: Phase[]; milestones: Milestone[] } {
    const phases = this.generateMockPhases(projectId);
    const milestones = this.generateMockMilestones(
      projectId,
      phases,
      config?.maxMilestones,
    );

    return { phases, milestones };
  }

  /**
   * Generate mock phases for a project
   */
  generateMockPhases(projectId: string, count: number = 4): Phase[] {
    const phasesData = [
      {
        name: 'Discovery',
        description: 'Warehouse tour and problem identification',
        startDate: new Date('2025-11-15'),
        endDate: new Date('2025-11-17'),
        color: '#FF6B6B',
      },
      {
        name: 'Requirements',
        description: 'Requirements gathering and specification',
        startDate: new Date('2025-11-18'),
        endDate: new Date('2025-11-18'),
        color: '#4ECDC4',
      },
      {
        name: 'Design',
        description: 'System design and architecture',
        startDate: new Date('2025-11-18'),
        endDate: new Date('2025-11-18'),
        color: '#45B7D1',
      },
      {
        name: 'Implementation',
        description: 'Core feature development',
        startDate: new Date('2025-11-19'),
        endDate: undefined,
        color: '#96CEB4',
      },
    ];

    return phasesData.slice(0, count).map((data, index) => {
      const phase = new Phase();
      phase.id = this.generateId();
      phase.projectId = projectId;
      phase.name = data.name;
      phase.description = data.description;
      phase.startDate = data.startDate;
      if (data.endDate) {
        phase.endDate = data.endDate;
      }
      phase.orderIndex = index + 1;
      phase.color = data.color;
      return phase;
    });
  }

  /**
   * Generate mock milestones with full relations
   */
  generateMockMilestones(
    projectId: string,
    phases: Phase[],
    maxCount?: number,
  ): Milestone[] {
    const milestones: Milestone[] = [];

    // Discovery phase milestones
    const discoveryPhase = phases.find((p) => p.name === 'Discovery');
    if (discoveryPhase) {
      milestones.push(
        this.createWarehouseTourMilestone(projectId, discoveryPhase.id),
        this.createStakeholderInterviewsMilestone(projectId, discoveryPhase.id),
        this.createProblemAnalysisMilestone(projectId, discoveryPhase.id),
      );
    }

    // Requirements phase milestones
    const requirementsPhase = phases.find((p) => p.name === 'Requirements');
    if (requirementsPhase) {
      milestones.push(
        this.createRequirementsDocMilestone(projectId, requirementsPhase.id),
        this.createRequirementsReviewMilestone(projectId, requirementsPhase.id),
      );
    }

    // Design phase milestones
    const designPhase = phases.find((p) => p.name === 'Design');
    if (designPhase) {
      milestones.push(
        this.createDesignDocMilestone(projectId, designPhase.id),
      );
    }

    // Implementation phase milestones
    const implementationPhase = phases.find((p) => p.name === 'Implementation');
    if (implementationPhase) {
      milestones.push(
        this.createTask1Milestone(projectId, implementationPhase.id),
        this.createTask2Milestone(projectId, implementationPhase.id),
        this.createTask3Milestone(projectId, implementationPhase.id),
        this.createTask4Milestone(projectId, implementationPhase.id),
        this.createTask5Milestone(projectId, implementationPhase.id),
        this.createTask6Milestone(projectId, implementationPhase.id),
        this.createTask7Milestone(projectId, implementationPhase.id),
        this.createTask8Milestone(projectId, implementationPhase.id),
      );
    }

    return maxCount ? milestones.slice(0, maxCount) : milestones;
  }

  /**
   * Generate mock artifacts for a milestone
   */
  generateMockArtifacts(milestoneId: string, count: number = 2): Artifact[] {
    const artifacts: Artifact[] = [];

    for (let i = 0; i < count; i++) {
      const artifact = new Artifact();
      artifact.id = this.generateId();
      artifact.milestoneId = milestoneId;
      artifact.type = i === 0 ? 'document' : 'image';
      artifact.name = i === 0 ? 'Documentation' : 'Screenshot';
      artifact.filePath = `/mock/artifact-${i}.md`;
      artifact.preview = 'Mock artifact preview...';
      artifact.metadata = { fileSize: 1024, mimeType: 'text/markdown' };
      artifacts.push(artifact);
    }

    return artifacts;
  }

  /**
   * Generate mock metrics for a project
   */
  generateMockMetrics(projectId: string, count: number = 5): Metric[] {
    const metrics: Metric[] = [];
    const metricTypes = [
      { name: 'Requirements Count', value: 15, unit: 'user stories' },
      { name: 'Tasks Completed', value: 8, unit: 'tasks' },
      { name: 'Test Coverage', value: 94, unit: '%' },
      { name: 'Lines of Code', value: 2500, unit: 'lines' },
      { name: 'Velocity', value: 12, unit: 'points/week' },
    ];

    for (let i = 0; i < Math.min(count, metricTypes.length); i++) {
      const metric = new Metric();
      metric.id = this.generateId();
      metric.projectId = projectId;
      metric.name = metricTypes[i].name;
      metric.type = 'count';
      metric.value = metricTypes[i].value;
      metric.unit = metricTypes[i].unit;
      metric.timestamp = new Date();
      metrics.push(metric);
    }

    return metrics;
  }

  // Private helper methods for creating specific milestones

  private createWarehouseTourMilestone(
    projectId: string,
    phaseId: string,
  ): Milestone {
    const milestone = new Milestone();
    milestone.id = this.generateId();
    milestone.projectId = projectId;
    milestone.phaseId = phaseId;
    milestone.title = 'Warehouse Tour and Stakeholder Interviews';
    milestone.description =
      'Conducted tour of Richmond warehouse, interviewed key stakeholders';
    milestone.date = new Date('2025-11-15');
    milestone.type = 'auto';
    milestone.source = "WarehouseResearch/QTS Warehouse Tour_Bernie's Notes.md";
    milestone.narrative =
      'The warehouse tour revealed critical pain points: the "Frustrated List" with 6,000+ items requiring 2 FTE contractors to resolve. Ship To errors account for 80% of issues, BOM errors 15%. Inbound volume expected to triple by Summer 2026.';
    milestone.stakeholders = ['Will', 'Steven Jackson', 'Brent'];
    milestone.metrics = [];
    milestone.decisions = [];
    milestone.quickNotes = [];
    milestone.meetings = [];

    // Add business context
    const businessContext = new BusinessContext();
    businessContext.id = this.generateId();
    businessContext.problemStatement =
      'Warehouse has 6,000+ items on Frustrated List requiring 2 FTE contractors to resolve';
    businessContext.businessImpact =
      'Eliminate manual reconciliation, save 2 FTE contractors, prepare for 3x volume increase';
    businessContext.urgency = 'high';
    businessContext.roi =
      '2 FTE contractors saved, improved accuracy, faster receiving';
    businessContext.successMetrics = [
      'Reduce Frustrated List to <100 items',
      'Eliminate manual contractor work',
      'Handle 3x volume increase',
    ];
    milestone.businessContext = businessContext;

    // Add artifacts
    milestone.artifacts = [
      this.createArtifact(
        milestone.id,
        'document',
        'Warehouse Tour Notes',
        "WarehouseResearch/QTS Warehouse Tour_Bernie's Notes.md",
      ),
      this.createArtifact(
        milestone.id,
        'image',
        'Equipment Label Photo',
        'WarehouseResearch/EQLabelPics/1000007089.jpeg',
      ),
    ];

    // Add stakeholder feedback
    milestone.stakeholderFeedback = [
      this.createFeedback(
        milestone.id,
        'Will',
        'Warehouse Operations Lead',
        'We need this badly. The Frustrated List is killing us and volume is about to triple.',
        'concern',
        new Date('2025-11-15'),
      ),
      this.createFeedback(
        milestone.id,
        'Steven Jackson',
        'Air Traffic Controller',
        'Ship To errors are 80% of the problem. If we can fix that, we solve most issues.',
        'positive',
        new Date('2025-11-15'),
      ),
    ];

    // Add lesson learned
    milestone.lessonsLearned = [
      this.createLesson(
        milestone.id,
        'On-site observation is critical. The real problems were different from what was initially described.',
        'process',
        'high',
        'Always start with stakeholder interviews and site visits',
      ),
    ];

    return milestone;
  }

  private createStakeholderInterviewsMilestone(
    projectId: string,
    phaseId: string,
  ): Milestone {
    const milestone = new Milestone();
    milestone.id = this.generateId();
    milestone.projectId = projectId;
    milestone.phaseId = phaseId;
    milestone.title = 'Detailed Stakeholder Interviews';
    milestone.description = 'In-depth interviews with warehouse staff and management';
    milestone.date = new Date('2025-11-16');
    milestone.type = 'manual';
    milestone.narrative =
      'Conducted detailed interviews with warehouse staff to understand daily workflows and pain points. Key insight: current process requires manual data entry and reconciliation, leading to errors and delays.';
    milestone.stakeholders = ['Will', 'Warehouse Staff'];
    milestone.artifacts = [];
    milestone.metrics = [];
    milestone.decisions = [];
    milestone.stakeholderFeedback = [];
    milestone.lessonsLearned = [];
    milestone.meetings = [];

    milestone.quickNotes = [
      this.createQuickNote(
        milestone.id,
        'Staff mentioned WiFi is unreliable in warehouse - need offline mode',
        new Date('2025-11-16T10:30:00'),
      ),
      this.createQuickNote(
        milestone.id,
        'Current barcode scanners are old and unreliable',
        new Date('2025-11-16T14:15:00'),
      ),
    ];

    return milestone;
  }

  private createProblemAnalysisMilestone(
    projectId: string,
    phaseId: string,
  ): Milestone {
    const milestone = new Milestone();
    milestone.id = this.generateId();
    milestone.projectId = projectId;
    milestone.phaseId = phaseId;
    milestone.title = 'Problem Analysis and Root Cause Identification';
    milestone.description = 'Analyzed data to identify root causes of Frustrated List';
    milestone.date = new Date('2025-11-17');
    milestone.type = 'manual';
    milestone.narrative =
      'Analysis revealed that 80% of Frustrated List items stem from Ship To errors, 15% from BOM errors, and 5% from other causes. Root cause: data entry happens too late in the process.';
    milestone.stakeholders = ['Don Hiles', 'Will'];
    milestone.artifacts = [];
    milestone.decisions = [];
    milestone.stakeholderFeedback = [];
    milestone.lessonsLearned = [];
    milestone.quickNotes = [];
    milestone.meetings = [];

    milestone.metrics = [
      this.createMetric(
        milestone.id,
        'Ship To Errors',
        80,
        '%',
        new Date('2025-11-17'),
      ),
      this.createMetric(
        milestone.id,
        'BOM Errors',
        15,
        '%',
        new Date('2025-11-17'),
      ),
    ];

    return milestone;
  }

  private createRequirementsDocMilestone(
    projectId: string,
    phaseId: string,
  ): Milestone {
    const milestone = new Milestone();
    milestone.id = this.generateId();
    milestone.projectId = projectId;
    milestone.phaseId = phaseId;
    milestone.title = 'Requirements Document Completed';
    milestone.description = 'Comprehensive requirements with 15 user stories';
    milestone.date = new Date('2025-11-18T10:00:00');
    milestone.type = 'auto';
    milestone.source = '.kiro/specs/warehouse-physical-reception/requirements.md';
    milestone.narrative =
      'Requirements focused on core receiving workflow: TIN scanning, container entry, photo capture, and batch management. Prioritized offline-first architecture for warehouse environment.';
    milestone.stakeholders = ['Don Hiles', 'Will'];
    milestone.artifacts = [];
    milestone.stakeholderFeedback = [];
    milestone.lessonsLearned = [];
    milestone.meetings = [];

    milestone.decisions = [
      this.createDecision(
        projectId,
        milestone.id,
        'Chose React Native over Native Development',
        'Need to deliver quickly with limited mobile development resources',
        [
          'Native iOS/Android (separate codebases)',
          'React Native (shared codebase)',
          'Flutter',
        ],
        'React Native with TypeScript',
        'Team has React experience, single codebase reduces development time, mature ecosystem for offline storage and camera integration',
        new Date('2025-11-18'),
      ),
    ];

    milestone.metrics = [
      this.createMetric(
        milestone.id,
        'Requirements Count',
        15,
        'user stories',
        new Date('2025-11-18'),
      ),
      this.createMetric(
        milestone.id,
        'Acceptance Criteria',
        67,
        'criteria',
        new Date('2025-11-18'),
      ),
    ];

    milestone.quickNotes = [
      this.createQuickNote(
        milestone.id,
        'Remember to prioritize offline mode - warehouse WiFi is unreliable',
        new Date('2025-11-18T14:30:00'),
      ),
    ];

    return milestone;
  }

  private createRequirementsReviewMilestone(
    projectId: string,
    phaseId: string,
  ): Milestone {
    const milestone = new Milestone();
    milestone.id = this.generateId();
    milestone.projectId = projectId;
    milestone.phaseId = phaseId;
    milestone.title = 'Requirements Review Meeting';
    milestone.description = 'Stakeholder review and approval of requirements';
    milestone.date = new Date('2025-11-18T15:00:00');
    milestone.type = 'manual';
    milestone.narrative =
      'Requirements approved by all stakeholders. Team aligned on offline-first approach and React Native technology choice.';
    milestone.stakeholders = ['Don Hiles', 'Will', 'Development Team'];
    milestone.artifacts = [];
    milestone.metrics = [];
    milestone.decisions = [];
    milestone.stakeholderFeedback = [];
    milestone.lessonsLearned = [];
    milestone.quickNotes = [];

    milestone.meetings = [
      this.createMeeting(
        milestone.id,
        'Requirements Review Meeting',
        new Date('2025-11-18T15:00:00'),
        ['Don Hiles', 'Will', 'Development Team'],
        'Review and approve requirements document',
        [
          'Requirements approved',
          'Prioritized offline-first architecture',
          'Agreed on React Native technology',
        ],
      ),
    ];

    return milestone;
  }

  private createDesignDocMilestone(
    projectId: string,
    phaseId: string,
  ): Milestone {
    const milestone = new Milestone();
    milestone.id = this.generateId();
    milestone.projectId = projectId;
    milestone.phaseId = phaseId;
    milestone.title = 'Design Document Completed';
    milestone.description = 'System architecture and component design';
    milestone.date = new Date('2025-11-18T18:00:00');
    milestone.type = 'auto';
    milestone.source = '.kiro/specs/warehouse-physical-reception/design.md';
    milestone.narrative =
      'Design focused on offline-first architecture with SQLite local storage, Redux state management, and modular service layer. Defined clear separation between UI, business logic, and data access.';
    milestone.stakeholders = ['Don Hiles', 'Development Team'];
    milestone.artifacts = [];
    milestone.metrics = [];
    milestone.stakeholderFeedback = [];
    milestone.lessonsLearned = [];
    milestone.quickNotes = [];
    milestone.meetings = [];

    milestone.decisions = [
      this.createDecision(
        projectId,
        milestone.id,
        'Chose SQLite for Offline Storage',
        'Need reliable offline data storage with sync capabilities',
        ['AsyncStorage (key-value)', 'SQLite (relational)', 'Realm (object DB)'],
        'SQLite with TypeORM',
        'Relational model fits our data structure, TypeORM provides type safety, proven solution for React Native offline apps',
        new Date('2025-11-18'),
      ),
    ];

    return milestone;
  }

  private createTask1Milestone(projectId: string, phaseId: string): Milestone {
    const milestone = new Milestone();
    milestone.id = this.generateId();
    milestone.projectId = projectId;
    milestone.phaseId = phaseId;
    milestone.title = 'Task 1: Project Setup Complete';
    milestone.description = 'React Native project initialized with dependencies';
    milestone.date = new Date('2025-11-19T10:00:00');
    milestone.type = 'auto';
    milestone.source = 'WarehouseReception/docs/TASK_1_IMPLEMENTATION.md';
    milestone.narrative =
      'Project scaffolding complete with React Native, TypeScript, Redux Toolkit, and SQLite configured. Development environment ready.';
    milestone.stakeholders = ['Development Team'];
    milestone.artifacts = [];
    milestone.decisions = [];
    milestone.stakeholderFeedback = [];
    milestone.lessonsLearned = [];
    milestone.quickNotes = [];
    milestone.meetings = [];

    milestone.metrics = [
      this.createMetric(
        milestone.id,
        'Dependencies Installed',
        25,
        'packages',
        new Date('2025-11-19T10:00:00'),
      ),
    ];

    return milestone;
  }

  private createTask2Milestone(projectId: string, phaseId: string): Milestone {
    const milestone = new Milestone();
    milestone.id = this.generateId();
    milestone.projectId = projectId;
    milestone.phaseId = phaseId;
    milestone.title = 'Task 2: Authentication System';
    milestone.description = 'Login screen and authentication flow implemented';
    milestone.date = new Date('2025-11-19T12:00:00');
    milestone.type = 'auto';
    milestone.source = 'WarehouseReception/docs/TASK_2_IMPLEMENTATION.md';
    milestone.narrative =
      'Authentication system complete with login screen, JWT token management, and secure storage. Users can now log in and access the app.';
    milestone.stakeholders = ['Development Team'];
    milestone.artifacts = [];
    milestone.metrics = [];
    milestone.decisions = [];
    milestone.stakeholderFeedback = [];
    milestone.lessonsLearned = [];
    milestone.quickNotes = [];
    milestone.meetings = [];

    return milestone;
  }

  private createTask3Milestone(projectId: string, phaseId: string): Milestone {
    const milestone = new Milestone();
    milestone.id = this.generateId();
    milestone.projectId = projectId;
    milestone.phaseId = phaseId;
    milestone.title = 'Task 3: Database Schema';
    milestone.description = 'SQLite database schema and entities created';
    milestone.date = new Date('2025-11-19T14:00:00');
    milestone.type = 'auto';
    milestone.source = 'WarehouseReception/docs/TASK_3_IMPLEMENTATION.md';
    milestone.narrative =
      'Database schema implemented with TypeORM entities for TINs, containers, batches, and equipment. Offline storage foundation ready.';
    milestone.stakeholders = ['Development Team'];
    milestone.artifacts = [];
    milestone.metrics = [];
    milestone.decisions = [];
    milestone.stakeholderFeedback = [];
    milestone.lessonsLearned = [];
    milestone.quickNotes = [];
    milestone.meetings = [];

    return milestone;
  }

  private createTask4Milestone(projectId: string, phaseId: string): Milestone {
    const milestone = new Milestone();
    milestone.id = this.generateId();
    milestone.projectId = projectId;
    milestone.phaseId = phaseId;
    milestone.title = 'Task 4: Main Menu Screen';
    milestone.description = 'Main navigation menu implemented';
    milestone.date = new Date('2025-11-19T15:00:00');
    milestone.type = 'auto';
    milestone.source = 'WarehouseReception/docs/TASK_4_IMPLEMENTATION.md';
    milestone.narrative =
      'Main menu provides navigation to all core features: TIN scanning, active TINs list, batch summary, and settings.';
    milestone.stakeholders = ['Development Team'];
    milestone.artifacts = [];
    milestone.metrics = [];
    milestone.decisions = [];
    milestone.stakeholderFeedback = [];
    milestone.lessonsLearned = [];
    milestone.quickNotes = [];
    milestone.meetings = [];

    return milestone;
  }

  private createTask5Milestone(projectId: string, phaseId: string): Milestone {
    const milestone = new Milestone();
    milestone.id = this.generateId();
    milestone.projectId = projectId;
    milestone.phaseId = phaseId;
    milestone.title = 'Task 5: TIN Scanning';
    milestone.description = 'TIN barcode scanning and validation';
    milestone.date = new Date('2025-11-19T16:30:00');
    milestone.type = 'auto';
    milestone.source = 'WarehouseReception/docs/TASK_5_IMPLEMENTATION.md';
    milestone.narrative =
      'TIN scanning implemented with barcode reader integration, validation, and error handling. Users can now scan TINs to start receiving process.';
    milestone.stakeholders = ['Development Team'];
    milestone.artifacts = [];
    milestone.metrics = [];
    milestone.decisions = [];
    milestone.stakeholderFeedback = [];
    milestone.lessonsLearned = [];
    milestone.quickNotes = [];
    milestone.meetings = [];

    return milestone;
  }

  private createTask6Milestone(projectId: string, phaseId: string): Milestone {
    const milestone = new Milestone();
    milestone.id = this.generateId();
    milestone.projectId = projectId;
    milestone.phaseId = phaseId;
    milestone.title = 'Task 6: Container Entry';
    milestone.description = 'Container data entry screen';
    milestone.date = new Date('2025-11-19T18:00:00');
    milestone.type = 'auto';
    milestone.source = 'WarehouseReception/docs/TASK_6_IMPLEMENTATION.md';
    milestone.narrative =
      'Container entry screen allows users to input container details, scan barcodes, and capture photos. Offline data storage working.';
    milestone.stakeholders = ['Development Team'];
    milestone.artifacts = [];
    milestone.metrics = [];
    milestone.decisions = [];
    milestone.stakeholderFeedback = [];
    milestone.lessonsLearned = [];
    milestone.quickNotes = [];
    milestone.meetings = [];

    return milestone;
  }

  private createTask7Milestone(projectId: string, phaseId: string): Milestone {
    const milestone = new Milestone();
    milestone.id = this.generateId();
    milestone.projectId = projectId;
    milestone.phaseId = phaseId;
    milestone.title = 'Task 7: Active TINs List';
    milestone.description = 'List view of active TINs with status';
    milestone.date = new Date('2025-11-19T19:30:00');
    milestone.type = 'auto';
    milestone.source = 'WarehouseReception/docs/TASK_7_IMPLEMENTATION.md';
    milestone.narrative =
      'Active TINs list displays all in-progress receiving work with status indicators. Users can resume work on any TIN.';
    milestone.stakeholders = ['Development Team'];
    milestone.artifacts = [];
    milestone.metrics = [];
    milestone.decisions = [];
    milestone.stakeholderFeedback = [];
    milestone.lessonsLearned = [];
    milestone.quickNotes = [];
    milestone.meetings = [];

    return milestone;
  }

  private createTask8Milestone(projectId: string, phaseId: string): Milestone {
    const milestone = new Milestone();
    milestone.id = this.generateId();
    milestone.projectId = projectId;
    milestone.phaseId = phaseId;
    milestone.title = 'Task 8: Photo Capture';
    milestone.description = 'Camera integration for equipment photos';
    milestone.date = new Date('2025-11-19T21:00:00');
    milestone.type = 'auto';
    milestone.source = 'WarehouseReception/docs/TASK_8_IMPLEMENTATION.md';
    milestone.narrative =
      'Photo capture integrated with camera permissions, image storage, and thumbnail generation. Users can document equipment condition.';
    milestone.stakeholders = ['Development Team'];
    milestone.artifacts = [];
    milestone.metrics = [];
    milestone.decisions = [];
    milestone.stakeholderFeedback = [];
    milestone.quickNotes = [];
    milestone.meetings = [];

    milestone.lessonsLearned = [
      this.createLesson(
        milestone.id,
        'Camera permissions on iOS require careful handling and clear user messaging',
        'technical',
        'medium',
        'Always test camera features on physical devices, not just simulators',
      ),
    ];

    return milestone;
  }

  // Helper methods for creating related entities

  private createArtifact(
    milestoneId: string,
    type: string,
    name: string,
    filePath: string,
  ): Artifact {
    const artifact = new Artifact();
    artifact.id = this.generateId();
    artifact.milestoneId = milestoneId;
    artifact.type = type as any;
    artifact.name = name;
    artifact.filePath = filePath;
    artifact.preview = type === 'document' ? 'Document preview...' : null;
    artifact.metadata = {
      fileSize: type === 'image' ? 245000 : 5420,
      mimeType: type === 'image' ? 'image/jpeg' : 'text/markdown',
    };
    return artifact;
  }

  private createFeedback(
    milestoneId: string,
    stakeholder: string,
    role: string,
    feedback: string,
    sentiment: string,
    date: Date,
  ): StakeholderFeedback {
    const fb = new StakeholderFeedback();
    fb.id = this.generateId();
    fb.milestoneId = milestoneId;
    fb.stakeholder = stakeholder;
    fb.role = role;
    fb.feedback = feedback;
    fb.sentiment = sentiment as any;
    fb.date = date;
    fb.context = 'During warehouse tour';
    return fb;
  }

  private createLesson(
    milestoneId: string,
    lesson: string,
    category: string,
    impact: string,
    actionable: string,
  ): LessonLearned {
    const ll = new LessonLearned();
    ll.id = this.generateId();
    ll.milestoneId = milestoneId;
    ll.lesson = lesson;
    ll.category = category as any;
    ll.impact = impact as any;
    ll.actionable = actionable;
    ll.date = new Date();
    return ll;
  }

  private createQuickNote(
    milestoneId: string,
    content: string,
    capturedAt: Date,
  ): QuickNote {
    const note = new QuickNote();
    note.id = this.generateId();
    note.milestoneId = milestoneId;
    note.content = content;
    note.capturedAt = capturedAt;
    note.capturedBy = 'don.hiles@qts.com';
    note.tags = [];
    note.processed = true;
    return note;
  }

  private createMeeting(
    milestoneId: string,
    title: string,
    date: Date,
    participants: string[],
    purpose: string,
    outcomes: string[],
  ): Meeting {
    const meeting = new Meeting();
    meeting.id = this.generateId();
    meeting.milestoneId = milestoneId;
    meeting.title = title;
    meeting.date = date;
    meeting.participants = participants;
    meeting.purpose = purpose;
    meeting.outcomes = outcomes;
    meeting.notes =
      'Team aligned on approach. Will emphasized importance of offline mode.';
    return meeting;
  }

  private createMetric(
    milestoneId: string,
    name: string,
    value: number,
    unit: string,
    timestamp: Date,
  ): Metric {
    const metric = new Metric();
    metric.id = this.generateId();
    metric.milestoneId = milestoneId;
    metric.name = name;
    metric.type = 'count';
    metric.value = value;
    metric.unit = unit;
    metric.timestamp = timestamp;
    return metric;
  }

  private createDecision(
    projectId: string,
    milestoneId: string,
    title: string,
    context: string,
    optionsConsidered: string[],
    chosenApproach: string,
    rationale: string,
    date: Date,
  ): Decision {
    const decision = new Decision();
    decision.id = this.generateId();
    decision.projectId = projectId;
    decision.milestoneId = milestoneId;
    decision.title = title;
    decision.date = date;
    decision.context = context;
    decision.optionsConsidered = optionsConsidered;
    decision.chosenApproach = chosenApproach;
    decision.rationale = rationale;
    decision.stakeholders = ['Don Hiles', 'Development Team'];
    return decision;
  }

  private generateId(): string {
    return `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
