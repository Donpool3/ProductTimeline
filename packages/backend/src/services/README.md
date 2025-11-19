# Services

This directory contains service layer implementations for the Product Timeline backend.

## MockDataService

The `MockDataService` provides comprehensive mock data generation for development and testing.

### Features

- **Complete Entity Coverage**: Generates all entity types (projects, phases, milestones, artifacts, metrics, decisions, feedback, lessons, notes, meetings)
- **Realistic Data**: Based on actual Warehouse Physical Reception App project
- **Configurable Generation**: Customize phase count, milestone count, date ranges, and included data
- **Type-Safe**: Full TypeScript type safety with entity classes
- **Relationship Management**: Properly links all related entities

### Usage

#### Basic Usage

```typescript
import { MockDataService } from './services/mock-data.service';

const mockService = new MockDataService();

// Generate a project
const project = mockService.generateMockProject();

// Generate phases
const phases = mockService.generateMockPhases(project.id);

// Generate complete timeline
const timeline = mockService.generateMockTimeline(project.id);
```

#### Configurable Generation

```typescript
// Generate project with custom date range
const project = mockService.generateMockProject({
  dateRange: {
    start: new Date('2025-01-01'),
    end: new Date('2025-12-31'),
  },
});

// Generate timeline with limited milestones
const timeline = mockService.generateMockTimeline(project.id, {
  maxMilestones: 10,
});

// Generate custom number of phases
const phases = mockService.generateMockPhases(project.id, 6);
```

#### Generate Specific Entities

```typescript
// Generate artifacts
const artifacts = mockService.generateMockArtifacts(milestoneId, 5);

// Generate metrics
const metrics = mockService.generateMockMetrics(projectId, 10);
```

### Configuration Options

#### MockProjectConfig

```typescript
interface MockProjectConfig {
  phaseCount?: number;              // Number of phases (default: 4)
  milestonesPerPhase?: number;      // Milestones per phase (default: varies)
  includeNarratives?: boolean;      // Include narrative text (default: true)
  includeDecisions?: boolean;       // Include decision records (default: true)
  includeMetrics?: boolean;         // Include metrics (default: true)
  dateRange?: {                     // Custom date range
    start: Date;
    end: Date;
  };
}
```

#### MockTimelineConfig

```typescript
interface MockTimelineConfig {
  includeAllRelations?: boolean;    // Include all related entities (default: true)
  maxMilestones?: number;           // Maximum milestones to generate
}
```

### Generated Data Structure

The mock data includes:

#### Project
- Basic project information
- Metadata with tags and stakeholders
- Custom fields for business context

#### Phases (4 default)
1. **Discovery**: Problem identification and research
2. **Requirements**: Requirements gathering and specification
3. **Design**: System architecture and design
4. **Implementation**: Development and testing

#### Milestones (14 total)
- **Discovery Phase** (3): Warehouse tour, stakeholder interviews, problem analysis
- **Requirements Phase** (2): Requirements doc, review meeting
- **Design Phase** (1): Design document
- **Implementation Phase** (8): Tasks 1-8 with realistic completion

#### Related Entities
- **Artifacts**: Documents, images, code files
- **Metrics**: Quantitative measurements with units
- **Decisions**: Decision records with alternatives and rationale
- **Stakeholder Feedback**: Actual quotes with sentiment
- **Lessons Learned**: Categorized insights with actionable items
- **Quick Notes**: In-the-moment captures
- **Meetings**: Meeting records with participants and outcomes
- **Business Context**: Problem statements, impact, ROI

### Demo Script

Run the demo script to see the mock data service in action:

```bash
cd packages/backend
npx ts-node src/scripts/demo-mock-data.ts
```

### Testing

The mock data service includes comprehensive unit tests:

```bash
npm run test -- mock-data.service.spec.ts
```

### Integration with Database Seeding

The mock data service can be used with the database seed service:

```typescript
import { MockDataService } from '../services/mock-data.service';
import { SeedService } from '../database/seeds/seed.service';

// In seed service
const mockService = new MockDataService();
const project = mockService.generateMockProject();
await this.projectRepository.save(project);
```

### Best Practices

1. **Use for Development**: Enable mock mode during frontend development
2. **Consistent Data**: Use the same mock data for demos and presentations
3. **Test Scenarios**: Generate specific configurations for different test cases
4. **Performance Testing**: Generate large datasets to test performance
5. **Type Safety**: Leverage TypeScript types for compile-time validation

### Future Enhancements

- [ ] Additional project templates (web apps, infrastructure, APIs)
- [ ] Mock file system for file watching tests
- [ ] Configurable data variation (random vs deterministic)
- [ ] Export/import mock data configurations
- [ ] Mock data versioning for reproducible tests
