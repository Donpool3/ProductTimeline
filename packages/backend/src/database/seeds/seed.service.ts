import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
} from '../entities';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Phase)
    private phaseRepository: Repository<Phase>,
    @InjectRepository(Milestone)
    private milestoneRepository: Repository<Milestone>,
    @InjectRepository(Artifact)
    private artifactRepository: Repository<Artifact>,
    @InjectRepository(Metric)
    private metricRepository: Repository<Metric>,
    @InjectRepository(Decision)
    private decisionRepository: Repository<Decision>,
    @InjectRepository(StakeholderFeedback)
    private feedbackRepository: Repository<StakeholderFeedback>,
    @InjectRepository(LessonLearned)
    private lessonRepository: Repository<LessonLearned>,
    @InjectRepository(QuickNote)
    private noteRepository: Repository<QuickNote>,
    @InjectRepository(Meeting)
    private meetingRepository: Repository<Meeting>,
    @InjectRepository(BusinessContext)
    private businessContextRepository: Repository<BusinessContext>,
  ) {}

  async seedDatabase(): Promise<void> {
    // Check if data already exists
    const existingProjects = await this.projectRepository.count();
    if (existingProjects > 0) {
      console.log('Database already seeded, skipping...');
      return;
    }

    console.log('Seeding database with sample data...');

    // Create Warehouse Reception Project
    const warehouseProject = await this.createWarehouseProject();
    console.log(`Created project: ${warehouseProject.name}`);

    // Create phases
    const phases = await this.createWarehousePhases(warehouseProject.id);
    console.log(`Created ${phases.length} phases`);

    // Create milestones with related data
    await this.createWarehouseMilestones(warehouseProject.id, phases);
    console.log('Created milestones with artifacts, metrics, and decisions');

    console.log('Database seeding completed!');
  }

  private async createWarehouseProject(): Promise<Project> {
    const project = this.projectRepository.create({
      name: 'Warehouse Physical Reception App',
      description:
        'Mobile app for streamlining warehouse receiving process and eliminating the Frustrated List',
      documentationPath: '/mock/warehouse-reception',
      status: 'active',
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
    });

    return await this.projectRepository.save(project);
  }

  private async createWarehousePhases(projectId: string): Promise<Phase[]> {
    const phasesData = [
      {
        name: 'Discovery',
        description: 'Warehouse tour and problem identification',
        startDate: new Date('2025-11-15'),
        endDate: new Date('2025-11-17'),
        orderIndex: 1,
        color: '#FF6B6B',
      },
      {
        name: 'Requirements',
        description: 'Requirements gathering and specification',
        startDate: new Date('2025-11-18'),
        endDate: new Date('2025-11-18'),
        orderIndex: 2,
        color: '#4ECDC4',
      },
      {
        name: 'Design',
        description: 'System design and architecture',
        startDate: new Date('2025-11-18'),
        endDate: new Date('2025-11-18'),
        orderIndex: 3,
        color: '#45B7D1',
      },
      {
        name: 'Implementation',
        description: 'Core feature development',
        startDate: new Date('2025-11-19'),
        endDate: undefined,
        orderIndex: 4,
        color: '#96CEB4',
      },
    ];

    const phases = phasesData.map((data) =>
      this.phaseRepository.create({
        ...data,
        projectId,
      }),
    );

    return await this.phaseRepository.save(phases);
  }

  private async createWarehouseMilestones(
    projectId: string,
    phases: Phase[],
  ): Promise<void> {
    const discoveryPhase = phases.find((p) => p.name === 'Discovery');
    const requirementsPhase = phases.find((p) => p.name === 'Requirements');

    if (!discoveryPhase || !requirementsPhase) {
      throw new Error('Required phases not found');
    }

    // Discovery Milestone
    const businessContext = await this.businessContextRepository.save(
      this.businessContextRepository.create({
        problemStatement:
          'Warehouse has 6,000+ items on Frustrated List requiring 2 FTE contractors to resolve',
        businessImpact:
          'Eliminate manual reconciliation, save 2 FTE contractors, prepare for 3x volume increase',
        urgency: 'high',
        roi: '2 FTE contractors saved, improved accuracy, faster receiving',
        successMetrics: [
          'Reduce Frustrated List to <100 items',
          'Eliminate manual contractor work',
          'Handle 3x volume increase',
        ],
      }),
    );

    const tourMilestone = await this.milestoneRepository.save(
      this.milestoneRepository.create({
        projectId,
        phaseId: discoveryPhase.id,
        title: 'Warehouse Tour and Stakeholder Interviews',
        description:
          'Conducted tour of Richmond warehouse, interviewed key stakeholders',
        date: new Date('2025-11-15'),
        type: 'auto',
        source: "WarehouseResearch/QTS Warehouse Tour_Bernie's Notes.md",
        narrative:
          'The warehouse tour revealed critical pain points: the "Frustrated List" with 6,000+ items requiring 2 FTE contractors to resolve. Ship To errors account for 80% of issues, BOM errors 15%. Inbound volume expected to triple by Summer 2026.',
        stakeholders: ['Will', 'Steven Jackson', 'Brent'],
        businessContextId: businessContext.id,
      }),
    );

    // Add artifacts
    await this.artifactRepository.save([
      this.artifactRepository.create({
        milestoneId: tourMilestone.id,
        type: 'document',
        name: 'Warehouse Tour Notes',
        filePath: "WarehouseResearch/QTS Warehouse Tour_Bernie's Notes.md",
        preview: 'The core issue revolves around data inaccuracies...',
        metadata: { fileSize: 5420, mimeType: 'text/markdown' },
      }),
      this.artifactRepository.create({
        milestoneId: tourMilestone.id,
        type: 'image',
        name: 'Equipment Label Photo',
        filePath: 'WarehouseResearch/EQLabelPics/1000007089.jpeg',
        preview: undefined,
        metadata: { fileSize: 245000, mimeType: 'image/jpeg' },
      }),
    ]);

    // Add stakeholder feedback
    await this.feedbackRepository.save([
      this.feedbackRepository.create({
        milestoneId: tourMilestone.id,
        stakeholder: 'Will',
        role: 'Warehouse Operations Lead',
        feedback:
          'We need this badly. The Frustrated List is killing us and volume is about to triple.',
        sentiment: 'concern',
        date: new Date('2025-11-15'),
        context: 'During warehouse tour',
      }),
      this.feedbackRepository.create({
        milestoneId: tourMilestone.id,
        stakeholder: 'Steven Jackson',
        role: 'Air Traffic Controller',
        feedback:
          'Ship To errors are 80% of the problem. If we can fix that, we solve most issues.',
        sentiment: 'positive',
        date: new Date('2025-11-15'),
        context: 'Discussing root causes',
      }),
    ]);

    // Add lesson learned
    await this.lessonRepository.save(
      this.lessonRepository.create({
        milestoneId: tourMilestone.id,
        lesson:
          'On-site observation is critical. The real problems were different from what was initially described.',
        category: 'process',
        impact: 'high',
        actionable: 'Always start with stakeholder interviews and site visits',
        date: new Date('2025-11-15'),
      }),
    );

    // Requirements Milestone
    const reqMilestone = await this.milestoneRepository.save(
      this.milestoneRepository.create({
        projectId,
        phaseId: requirementsPhase.id,
        title: 'Requirements Document Completed',
        description: 'Comprehensive requirements with 15 user stories',
        date: new Date('2025-11-18'),
        type: 'auto',
        source: '.kiro/specs/warehouse-physical-reception/requirements.md',
        narrative:
          'Requirements focused on core receiving workflow: TIN scanning, container entry, photo capture, and batch management. Prioritized offline-first architecture for warehouse environment.',
        stakeholders: ['Don Hiles', 'Will'],
      }),
    );

    // Add decision
    await this.decisionRepository.save(
      this.decisionRepository.create({
        projectId,
        milestoneId: reqMilestone.id,
        title: 'Chose React Native over Native Development',
        date: new Date('2025-11-18'),
        context:
          'Need to deliver quickly with limited mobile development resources',
        optionsConsidered: [
          'Native iOS/Android (separate codebases)',
          'React Native (shared codebase)',
          'Flutter',
        ],
        chosenApproach: 'React Native with TypeScript',
        rationale:
          'Team has React experience, single codebase reduces development time, mature ecosystem for offline storage and camera integration',
        stakeholders: ['Don Hiles', 'Development Team'],
      }),
    );

    // Add metrics
    await this.metricRepository.save([
      this.metricRepository.create({
        projectId,
        milestoneId: reqMilestone.id,
        name: 'Requirements Count',
        type: 'count',
        value: 15,
        unit: 'user stories',
        timestamp: new Date('2025-11-18'),
      }),
      this.metricRepository.create({
        projectId,
        milestoneId: reqMilestone.id,
        name: 'Acceptance Criteria',
        type: 'count',
        value: 67,
        unit: 'criteria',
        timestamp: new Date('2025-11-18'),
      }),
    ]);

    // Add quick note
    await this.noteRepository.save(
      this.noteRepository.create({
        milestoneId: reqMilestone.id,
        content:
          'Remember to prioritize offline mode - warehouse WiFi is unreliable',
        capturedAt: new Date('2025-11-18T14:30:00'),
        capturedBy: 'don.hiles@qts.com',
        tags: ['offline', 'architecture'],
        processed: true,
      }),
    );

    // Add meeting
    await this.meetingRepository.save(
      this.meetingRepository.create({
        milestoneId: reqMilestone.id,
        title: 'Requirements Review Meeting',
        date: new Date('2025-11-18T10:00:00'),
        participants: ['Don Hiles', 'Will', 'Development Team'],
        purpose: 'Review and approve requirements document',
        outcomes: [
          'Requirements approved',
          'Prioritized offline-first architecture',
          'Agreed on React Native technology',
        ],
        notes:
          'Team aligned on approach. Will emphasized importance of offline mode.',
      }),
    );
  }

  async clearDatabase(): Promise<void> {
    console.log('Clearing database...');
    await this.meetingRepository.delete({});
    await this.noteRepository.delete({});
    await this.lessonRepository.delete({});
    await this.feedbackRepository.delete({});
    await this.decisionRepository.delete({});
    await this.metricRepository.delete({});
    await this.artifactRepository.delete({});
    await this.milestoneRepository.delete({});
    await this.businessContextRepository.delete({});
    await this.phaseRepository.delete({});
    await this.projectRepository.delete({});
    console.log('Database cleared!');
  }
}
