# Design Document: Product Timeline Web Application

## Overview

The Product Timeline Web Application is a web-based tool that automatically transforms project documentation into interactive, visual case studies. The application addresses a critical business need: building living case studies that capture the complete product lifecycle in real-time, rather than reconstructing narratives after project completion.

The core design philosophy is **automation with curation**: the system automatically discovers, parses, and visualizes project documentation while allowing manual enrichment with narrative context, decision rationale, and stakeholder insights. This creates a self-building timeline that grows organically as teams work, requiring minimal manual effort while maintaining a complete historical record.

The application serves multiple audiences:
- **Product Managers**: Build case studies, document decisions, track progress
- **Executives**: Assess project health, understand business impact, review portfolio
- **Operations Teams**: Connect project stories with resource management and billing
- **Future Team Members**: Understand project history and decision context
- **Business Development**: Generate compelling case studies for prospects

The system is designed for:
- **Multi-project support**: Manage portfolio of timelines across organization
- **Real-time updates**: Timeline grows automatically as documentation changes
- **Rich integration**: API, embeddable widgets, webhooks for ops platform
- **Export flexibility**: Generate presentations, reports, websites from timeline data
- **Scalability**: Handle projects with hundreds of milestones and thousands of artifacts

## Architecture

### High-Level Architecture

The system follows a modern web application architecture with clear separation between frontend, backend, and integration layers:

```
┌─────────────────────────────────────────────────────────────────┐
│                        Web Frontend                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Timeline   │  │   Project    │  │   Export     │          │
│  │   Viewer     │  │   Manager    │  │   Generator  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Narrative  │  │   Search     │  │   Metrics    │          │
│  │   Editor     │  │   Interface  │  │   Dashboard  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ REST API / WebSocket
                            │
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway                                 │
│              (Auth, Rate Limiting, CORS)                         │
└─────────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌───────▼────────┐  ┌──────▼──────┐
│   Timeline     │  │  Documentation │  │   Export    │
│   Service      │  │  Parser Service│  │   Service   │
└────────────────┘  └────────────────┘  └─────────────┘
        │                   │                   │
        │                   │                   │
┌───────▼────────┐  ┌───────▼────────┐  ┌──────▼──────┐
│   PostgreSQL   │  │  File System   │  │  S3/Blob    │
│   (Timeline    │  │  Watcher       │  │  Storage    │
│    Data)       │  │                │  │  (Exports)  │
└────────────────┘  └────────────────┘  └─────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌───────▼────────┐  ┌──────▼──────┐
│  Ops Platform  │  │   Webhook      │  │  Embeddable │
│  Integration   │  │   Dispatcher   │  │   Widget    │
└────────────────┘  └────────────────┘  └─────────────┘
```

### Technology Stack

**Frontend:**
- **Framework**: React 18+ with TypeScript
- **State Management**: Redux Toolkit with RTK Query for API caching
- **UI Library**: Material-UI (MUI) or Ant Design for rich components
- **Timeline Visualization**: D3.js or vis-timeline for interactive timeline rendering
- **Rich Text Editor**: Slate.js or TipTap for narrative editing
- **Charts**: Recharts or Chart.js for metrics visualization
- **Build Tool**: Vite for fast development and optimized builds

**Backend:**
- **Runtime**: Node.js 20+ LTS
- **Framework**: NestJS (TypeScript) for structured, scalable architecture
- **API**: RESTful with OpenAPI/Swagger documentation
- **Real-time**: WebSocket (Socket.io) for live updates
- **Database**: PostgreSQL 15+ for relational data
- **ORM**: TypeORM or Prisma for type-safe database access
- **File Watching**: Chokidar for monitoring documentation changes
- **Parsing**: Unified.js (remark/rehype) for markdown parsing
- **Search**: PostgreSQL full-text search or Elasticsearch for advanced search

**Infrastructure:**
- **Containerization**: Docker for consistent deployment
- **Orchestration**: Docker Compose (dev) or Kubernetes (production)
- **Reverse Proxy**: Nginx for static file serving and load balancing
- **Object Storage**: AWS S3, Azure Blob, or MinIO for exports
- **CI/CD**: GitHub Actions or GitLab CI
- **Monitoring**: Prometheus + Grafana or Datadog
- **Logging**: Winston + ELK Stack or CloudWatch

**Integration:**
- **API Documentation**: Swagger UI for interactive API docs
- **Webhooks**: Event-driven architecture with message queue (Bull/BullMQ)
- **Authentication**: JWT tokens, API keys, OAuth 2.0 client credentials
- **CORS**: Configurable for ops platform embedding

### Deployment Architecture

**Development:**
- Local Docker Compose stack
- Hot reload for frontend and backend
- PostgreSQL container with seed data
- Mock file system with sample projects
- Mock mode for testing without real documentation

**Staging:**
- Cloud-hosted (AWS/Azure/GCP)
- Separate database instance
- SSL/TLS certificates
- Integration with test ops platform

**Production:**
- Multi-region deployment for high availability
- Database replication and backups
- CDN for static assets
- Auto-scaling for API servers
- Monitoring and alerting

### Mock Data and Development Mode

**Mock Data Strategy:**

The application supports a comprehensive mock mode that allows development and testing without requiring real project documentation. This enables rapid iteration on UI/UX and verification of functionality before implementing complex parsing logic.

**Mock Service Layer:**
```typescript
interface MockDataService {
  generateMockProject(config?: MockProjectConfig): Project;
  generateMockTimeline(projectId: string, config?: MockTimelineConfig): Timeline;
  generateMockMilestones(count: number): Milestone[];
  generateMockMetrics(projectId: string): Metric[];
  generateMockArtifacts(milestoneId: string): Artifact[];
}

interface MockProjectConfig {
  phaseCount?: number;
  milestonesPerPhase?: number;
  includeNarratives?: boolean;
  includeDecisions?: boolean;
  includeMetrics?: boolean;
  dateRange?: { start: Date; end: Date };
}
```

**Mock Data Includes:**
- **Sample Projects**: Pre-configured projects mimicking real scenarios (mobile app, web app, infrastructure)
- **Realistic Timelines**: Phases and milestones with realistic dates and descriptions
- **Rich Content**: Sample narratives, decisions, metrics, and artifacts
- **Warehouse App Example**: Mock data based on the actual warehouse reception app for demo purposes

**Environment Configuration:**
```typescript
// .env.development
MOCK_MODE=true
MOCK_DATA_SEED=warehouse-app
USE_REAL_FILE_SYSTEM=false
API_MOCK_DELAY=500 // Simulate network latency
```

**Mock API Responses:**
- All API endpoints have mock implementations
- Configurable response delays to simulate network conditions
- Error simulation for testing error handling
- Deterministic data generation for reproducible tests

**Sample Mock Data:**
```typescript
// Mock warehouse reception project
const mockWarehouseProject: Project = {
  id: 'warehouse-reception-001',
  name: 'Warehouse Physical Reception App',
  description: 'Mobile app for streamlining warehouse receiving process',
  documentationPath: '/mock/warehouse-reception',
  status: 'active',
  createdAt: new Date('2025-11-15'),
  updatedAt: new Date('2025-11-19'),
  createdBy: 'don.hiles@qts.com',
  metadata: {
    tags: ['mobile', 'warehouse', 'phase-1'],
    stakeholders: [
      { name: 'Don Hiles', role: 'Product Manager' },
      { name: 'Will', role: 'Warehouse Ops Lead' },
      { name: 'Steven Jackson', role: 'Air Traffic Controller' }
    ],
    customFields: {
      businessImpact: 'Eliminate 6,000 item Frustrated List',
      expectedROI: '2 FTE contractors saved'
    }
  }
};

// Mock phases
const mockPhases: Phase[] = [
  {
    id: 'phase-discovery',
    projectId: 'warehouse-reception-001',
    name: 'Discovery',
    description: 'Warehouse tour and problem identification',
    startDate: new Date('2025-11-15'),
    endDate: new Date('2025-11-17'),
    order: 1,
    color: '#FF6B6B',
    milestoneCount: 3
  },
  {
    id: 'phase-requirements',
    projectId: 'warehouse-reception-001',
    name: 'Requirements',
    description: 'Requirements gathering and specification',
    startDate: new Date('2025-11-18'),
    endDate: new Date('2025-11-18'),
    order: 2,
    color: '#4ECDC4',
    milestoneCount: 2
  },
  // ... more phases
];

// Mock milestones with realistic data
const mockMilestones: Milestone[] = [
  {
    id: 'milestone-warehouse-tour',
    projectId: 'warehouse-reception-001',
    phaseId: 'phase-discovery',
    title: 'Warehouse Tour and Stakeholder Interviews',
    description: 'Conducted tour of Richmond warehouse, interviewed key stakeholders',
    date: new Date('2025-11-15'),
    type: 'auto',
    source: 'WarehouseResearch/QTS Warehouse Tour_Bernie\'s Notes.md',
    narrative: 'The warehouse tour revealed critical pain points: the "Frustrated List" with 6,000+ items requiring 2 FTE contractors to resolve. Ship To errors account for 80% of issues, BOM errors 15%. Inbound volume expected to triple by Summer 2026.',
    artifacts: [
      {
        id: 'artifact-tour-notes',
        milestoneId: 'milestone-warehouse-tour',
        type: 'document',
        name: 'Warehouse Tour Notes',
        filePath: 'WarehouseResearch/QTS Warehouse Tour_Bernie\'s Notes.md',
        preview: 'The core issue revolves around data inaccuracies...',
        metadata: { fileSize: 5420, mimeType: 'text/markdown' }
      }
    ],
    metrics: [],
    decisions: [],
    stakeholders: ['Will', 'Steven Jackson', 'Brent']
  },
  // ... more milestones
];
```

**Mock File System:**
```typescript
// Mock file system for testing file watching
class MockFileSystem {
  private files: Map<string, MockFile> = new Map();
  
  createFile(path: string, content: string): void {
    this.files.set(path, { path, content, modifiedAt: new Date() });
    this.emitEvent({ type: 'created', path });
  }
  
  updateFile(path: string, content: string): void {
    const file = this.files.get(path);
    if (file) {
      file.content = content;
      file.modifiedAt = new Date();
      this.emitEvent({ type: 'modified', path });
    }
  }
  
  deleteFile(path: string): void {
    this.files.delete(path);
    this.emitEvent({ type: 'deleted', path });
  }
  
  private emitEvent(event: FileChangeEvent): void {
    // Trigger file watcher callbacks
  }
}
```

**Development Workflow with Mocks:**

1. **Initial Development**: Use mock data to build UI components without backend
2. **UI Verification**: Test all screens and interactions with realistic mock data
3. **API Integration**: Swap mock API client with real API client
4. **Parser Development**: Implement real documentation parsing, test against mock file system
5. **End-to-End Testing**: Use real documentation with real file system
6. **Production**: Disable mock mode

**Mock Mode Toggle:**
```typescript
// Frontend API client with mock support
class TimelineApiClient {
  constructor(private useMock: boolean = false) {}
  
  async getProject(projectId: string): Promise<Project> {
    if (this.useMock) {
      return mockDataService.generateMockProject();
    }
    return this.httpClient.get(`/api/v1/projects/${projectId}`);
  }
  
  // ... other methods with mock support
}

// Backend service with mock support
class DocumentationParserService {
  constructor(private useMock: boolean = false) {}
  
  async scanProject(projectPath: string): Promise<DocumentScanResult> {
    if (this.useMock) {
      return mockDataService.generateMockScanResult();
    }
    // Real file system scanning and parsing
    return this.realParser.scan(projectPath);
  }
}
```

**Benefits of Mock Mode:**
- ✅ Rapid UI development without backend dependencies
- ✅ Consistent test data for reproducible testing
- ✅ Demo mode for stakeholder presentations
- ✅ Offline development capability
- ✅ Performance testing with large datasets
- ✅ Error scenario testing without breaking real data

## Components and Interfaces

### Frontend Components

#### 0. Context Capture Assistant Component
**Responsibility**: Proactively prompt users to capture context in the moment

**Interface:**
```typescript
interface ContextCaptureAssistantProps {
  trigger: 'milestone_created' | 'phase_completed' | 'decision_made' | 'manual';
  context: CaptureContext;
  onCapture?: (capture: ContextCapture) => void;
  onDismiss?: () => void;
}

interface CaptureContext {
  projectId: string;
  milestoneId?: string;
  phaseId?: string;
  suggestedPrompts: string[];
}

interface ContextCapture {
  type: 'narrative' | 'decision' | 'stakeholder_feedback' | 'lesson_learned' | 'business_context' | 'quick_note';
  content: string;
  audioUrl?: string; // For voice notes
  timestamp: Date;
  tags?: string[];
}
```

**Features:**
- **Smart Prompts**: Appears when milestones are auto-created
  - "Task 8 was just completed. What was the key challenge?"
  - "You just finished the Implementation phase. What did you learn?"
  - "A decision was made. What were the alternatives considered?"
- **Quick Capture Methods**:
  - Text input (quick note)
  - Voice recording (for busy moments)
  - Structured forms (for decisions, feedback)
- **Contextual Suggestions**: Based on what just happened
- **Snooze/Remind Later**: Don't lose the prompt if user is busy
- **Batch Capture**: Collect multiple quick notes, organize later

**IMPORTANT: Separation of Concerns**
- All context capture happens **within the Timeline Application only**
- The underlying project documentation remains unchanged
- Timeline Application stores enrichment data in its own database
- Project teams continue working normally without additional documentation burden
- Timeline reads from project docs (one-way), enrichment stays in Timeline
- This ensures developers focus on building, product managers focus on storytelling

**Example Prompts:**
```typescript
const smartPrompts = {
  milestone_created: [
    "What was the biggest challenge in completing this task?",
    "What would you do differently next time?",
    "Who helped make this happen?",
    "What surprised you during implementation?"
  ],
  phase_completed: [
    "What did the team learn during this phase?",
    "What went better than expected?",
    "What took longer than expected and why?",
    "What would you change about this phase?"
  ],
  decision_made: [
    "What alternatives did you consider?",
    "Why did you choose this approach?",
    "What risks are you accepting?",
    "Who influenced this decision?"
  ]
};
```

#### 1. Timeline Viewer Component
**Responsibility**: Render interactive timeline visualization

**Interface:**
```typescript
interface TimelineViewerProps {
  projectId: string;
  initialView?: 'horizontal' | 'vertical' | 'gantt';
  onMilestoneClick?: (milestone: Milestone) => void;
  onPhaseClick?: (phase: Phase) => void;
  filters?: TimelineFilters;
}

interface TimelineFilters {
  dateRange?: { start: Date; end: Date };
  phases?: string[];
  stakeholders?: string[];
  showDecisionsOnly?: boolean;
}
```

**Features:**
- Horizontal scrolling timeline with zoom controls
- Phase sections with collapsible milestones
- Milestone markers with status indicators
- Hover tooltips with summary information
- Click interactions for detailed views
- Lazy loading for performance
- Responsive layout adaptation

#### 2. Project Manager Component
**Responsibility**: Manage project list and configuration

**Interface:**
```typescript
interface ProjectManagerProps {
  onProjectSelect?: (project: Project) => void;
  onProjectCreate?: () => void;
  viewMode?: 'list' | 'grid' | 'table';
}

interface Project {
  id: string;
  name: string;
  description: string;
  documentationPath: string;
  createdAt: Date;
  updatedAt: Date;
  phaseCount: number;
  milestoneCount: number;
  status: 'active' | 'archived' | 'completed';
  metrics: ProjectMetrics;
}
```

**Features:**
- Project list with search and filtering
- Project creation wizard
- Documentation path configuration
- Project metadata editing
- Archive/restore functionality
- Bulk operations

#### 3. Narrative Editor Component
**Responsibility**: Rich text editing for narrative content

**Interface:**
```typescript
interface NarrativeEditorProps {
  milestoneId: string;
  initialContent?: string;
  onSave?: (content: string) => void;
  onCancel?: () => void;
  readOnly?: boolean;
}
```

**Features:**
- Rich text formatting (bold, italic, lists, links)
- Markdown support
- Image embedding
- Stakeholder mentions (@username)
- Auto-save drafts
- Version history
- Collaborative editing indicators

#### 4. Metrics Dashboard Component
**Responsibility**: Visualize project metrics and trends

**Interface:**
```typescript
interface MetricsDashboardProps {
  projectId: string;
  metrics: MetricDefinition[];
  dateRange?: { start: Date; end: Date };
}

interface MetricDefinition {
  id: string;
  name: string;
  type: 'count' | 'duration' | 'percentage' | 'custom';
  visualization: 'line' | 'bar' | 'pie' | 'gauge';
  dataPoints: MetricDataPoint[];
}
```

**Features:**
- Multiple chart types
- Trend analysis
- Comparison views (planned vs actual)
- Custom metric definitions
- Export to CSV/Excel
- Real-time updates

#### 5. Export Generator Component
**Responsibility**: Generate exportable artifacts

**Interface:**
```typescript
interface ExportGeneratorProps {
  projectId: string;
  exportType: 'pptx' | 'pdf' | 'html' | 'json';
  options: ExportOptions;
  onComplete?: (downloadUrl: string) => void;
}

interface ExportOptions {
  includePhases?: string[];
  includeMilestones?: string[];
  includeNarratives?: boolean;
  includeMetrics?: boolean;
  includeArtifacts?: boolean;
  template?: string;
}
```

**Features:**
- Format selection
- Content filtering
- Template customization
- Progress indication
- Download management
- Batch export

### Backend Services

#### 1. Timeline Service
**Responsibility**: Manage timeline data and operations

**API Endpoints:**
```
GET    /api/v1/projects
POST   /api/v1/projects
GET    /api/v1/projects/:id
PUT    /api/v1/projects/:id
DELETE /api/v1/projects/:id

GET    /api/v1/projects/:id/timeline
GET    /api/v1/projects/:id/phases
GET    /api/v1/projects/:id/milestones
POST   /api/v1/projects/:id/milestones
PUT    /api/v1/milestones/:id
DELETE /api/v1/milestones/:id

GET    /api/v1/milestones/:id/artifacts
POST   /api/v1/milestones/:id/artifacts
GET    /api/v1/milestones/:id/narrative
PUT    /api/v1/milestones/:id/narrative
```

**Service Interface:**
```typescript
interface TimelineService {
  getProject(projectId: string): Promise<Project>;
  createProject(data: CreateProjectDto): Promise<Project>;
  updateProject(projectId: string, data: UpdateProjectDto): Promise<Project>;
  deleteProject(projectId: string): Promise<void>;
  
  getTimeline(projectId: string, filters?: TimelineFilters): Promise<Timeline>;
  getPhases(projectId: string): Promise<Phase[]>;
  getMilestones(projectId: string, phaseId?: string): Promise<Milestone[]>;
  createMilestone(projectId: string, data: CreateMilestoneDto): Promise<Milestone>;
  updateMilestone(milestoneId: string, data: UpdateMilestoneDto): Promise<Milestone>;
  deleteMilestone(milestoneId: string): Promise<void>;
}
```

#### 2. Documentation Parser Service
**Responsibility**: Parse project documentation and extract timeline data

**Service Interface:**
```typescript
interface DocumentationParserService {
  scanProject(projectPath: string): Promise<DocumentScanResult>;
  parseRequirements(filePath: string): Promise<RequirementsData>;
  parseDesign(filePath: string): Promise<DesignData>;
  parseImplementationLog(filePath: string): Promise<ImplementationData>;
  parseConversationLog(filePath: string): Promise<ConversationData>;
  parseResearchNotes(filePath: string): Promise<ResearchData>;
  extractMetrics(documents: ParsedDocument[]): Promise<MetricData[]>;
}

interface DocumentScanResult {
  projectName: string;
  documentationPath: string;
  files: DiscoveredFile[];
  suggestedPhases: Phase[];
  suggestedMilestones: Milestone[];
}

interface ParsedDocument {
  filePath: string;
  type: 'requirements' | 'design' | 'implementation' | 'conversation' | 'research';
  content: any;
  metadata: DocumentMetadata;
}
```

**Parsing Strategy:**
- Use unified.js (remark) for markdown parsing
- Extract structured sections (headings, lists, code blocks)
- Identify patterns (user stories, acceptance criteria, task lists)
- Extract dates from filenames, git commits, or content
- Build relationships between documents (requirements → design → implementation)

#### 3. File Watcher Service
**Responsibility**: Monitor documentation changes and trigger updates

**Service Interface:**
```typescript
interface FileWatcherService {
  watchProject(projectId: string, path: string): void;
  unwatchProject(projectId: string): void;
  onFileChange(callback: (event: FileChangeEvent) => void): void;
  onFileCreate(callback: (event: FileCreateEvent) => void): void;
  onFileDelete(callback: (event: FileDeleteEvent) => void): void;
}

interface FileChangeEvent {
  projectId: string;
  filePath: string;
  changeType: 'modified' | 'created' | 'deleted';
  timestamp: Date;
}
```

**Implementation:**
- Use chokidar for cross-platform file watching
- Debounce rapid changes (e.g., during git operations)
- Queue parse jobs for changed files
- Emit events for real-time UI updates
- Handle git operations (commits, merges, rebases)

#### 4. Export Service
**Responsibility**: Generate exportable artifacts from timeline data

**Service Interface:**
```typescript
interface ExportService {
  exportToPowerPoint(projectId: string, options: ExportOptions): Promise<string>;
  exportToPDF(projectId: string, options: ExportOptions): Promise<string>;
  exportToHTML(projectId: string, options: ExportOptions): Promise<string>;
  exportToJSON(projectId: string, options: ExportOptions): Promise<string>;
  getExportStatus(exportId: string): Promise<ExportStatus>;
}

interface ExportStatus {
  exportId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  downloadUrl?: string;
  error?: string;
}
```

**Export Implementations:**
- **PowerPoint**: Use PptxGenJS to generate slides
- **PDF**: Use Puppeteer to render HTML and convert to PDF
- **HTML**: Generate static site with embedded timeline
- **JSON**: Serialize timeline data with full fidelity

#### 5. Webhook Service
**Responsibility**: Dispatch events to external systems

**Service Interface:**
```typescript
interface WebhookService {
  registerWebhook(config: WebhookConfig): Promise<Webhook>;
  unregisterWebhook(webhookId: string): Promise<void>;
  dispatchEvent(event: WebhookEvent): Promise<void>;
  retryFailedDelivery(deliveryId: string): Promise<void>;
}

interface WebhookConfig {
  url: string;
  events: WebhookEventType[];
  secret: string;
  active: boolean;
}

type WebhookEventType = 
  | 'project.created'
  | 'project.updated'
  | 'milestone.created'
  | 'milestone.updated'
  | 'narrative.updated'
  | 'metrics.updated';

interface WebhookEvent {
  id: string;
  type: WebhookEventType;
  timestamp: Date;
  projectId: string;
  data: any;
}
```

**Webhook Delivery:**
- Queue-based delivery with Bull/BullMQ
- Retry logic with exponential backoff
- Signature verification (HMAC)
- Delivery status tracking
- Failed delivery alerts

## Data Models

### Core Entities

#### Project
```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  documentationPath: string;
  status: 'active' | 'archived' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  metadata: ProjectMetadata;
}

interface ProjectMetadata {
  tags: string[];
  stakeholders: Stakeholder[];
  customFields: Record<string, any>;
}
```

**Database Schema:**
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  documentation_path VARCHAR(500) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by VARCHAR(100),
  metadata JSONB
);

CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at);
```

#### Phase
```typescript
interface Phase {
  id: string;
  projectId: string;
  name: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  order: number;
  color: string;
  milestoneCount: number;
}
```

**Database Schema:**
```sql
CREATE TABLE phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP,
  order_index INTEGER NOT NULL,
  color VARCHAR(7),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_phases_project_id ON phases(project_id);
CREATE INDEX idx_phases_order ON phases(project_id, order_index);
```

#### Milestone
```typescript
interface Milestone {
  id: string;
  projectId: string;
  phaseId: string;
  title: string;
  description: string;
  date: Date;
  type: 'auto' | 'manual';
  source?: string; // file path for auto-generated milestones
  narrative?: string;
  artifacts: Artifact[];
  metrics: Metric[];
  decisions: Decision[];
  stakeholders: string[];
  stakeholderFeedback: StakeholderFeedback[]; // NEW: Capture actual quotes/feedback
  businessContext?: BusinessContext; // NEW: Why this matters
  lessonsLearned: LessonLearned[]; // NEW: Retrospective insights
  quickNotes: QuickNote[]; // NEW: In-the-moment captures
  meetings: Meeting[]; // NEW: Track discussions
}

// NEW: Stakeholder feedback with actual quotes
interface StakeholderFeedback {
  id: string;
  stakeholder: string;
  role: string;
  feedback: string; // Actual quote or paraphrased feedback
  sentiment: 'positive' | 'neutral' | 'concern' | 'blocker';
  date: Date;
  context?: string; // Where/when this was said
}

// NEW: Business context
interface BusinessContext {
  problemStatement: string; // Why are we doing this?
  businessImpact: string; // What's the expected outcome?
  urgency: 'low' | 'medium' | 'high' | 'critical';
  roi?: string; // Expected return on investment
  successMetrics: string[]; // How will we measure success?
}

// NEW: Lessons learned
interface LessonLearned {
  id: string;
  lesson: string;
  category: 'technical' | 'process' | 'communication' | 'planning' | 'other';
  impact: 'low' | 'medium' | 'high';
  actionable?: string; // What should we do differently next time?
  date: Date;
}

// NEW: Quick notes for in-the-moment capture
interface QuickNote {
  id: string;
  content: string;
  audioUrl?: string; // Voice note
  capturedAt: Date;
  capturedBy: string;
  tags?: string[];
  processed: boolean; // Has this been incorporated into narrative?
}

// NEW: Meeting/discussion tracking
interface Meeting {
  id: string;
  title: string;
  date: Date;
  participants: string[];
  purpose: string;
  outcomes: string[];
  decisions: string[]; // Links to Decision records
  notes?: string;
}
```

**Database Schema:**
```sql
CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  phase_id UUID NOT NULL REFERENCES phases(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  date TIMESTAMP NOT NULL,
  type VARCHAR(20) NOT NULL DEFAULT 'auto',
  source VARCHAR(500),
  narrative TEXT,
  stakeholders TEXT[],
  business_context JSONB, -- NEW: Business reasoning
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_milestones_project_id ON milestones(project_id);
CREATE INDEX idx_milestones_phase_id ON milestones(phase_id);
CREATE INDEX idx_milestones_date ON milestones(date);
CREATE INDEX idx_milestones_type ON milestones(type);

-- NEW: Stakeholder feedback table
CREATE TABLE stakeholder_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_id UUID NOT NULL REFERENCES milestones(id) ON DELETE CASCADE,
  stakeholder VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  feedback TEXT NOT NULL,
  sentiment VARCHAR(20) NOT NULL,
  date TIMESTAMP NOT NULL,
  context TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_stakeholder_feedback_milestone_id ON stakeholder_feedback(milestone_id);
CREATE INDEX idx_stakeholder_feedback_stakeholder ON stakeholder_feedback(stakeholder);

-- NEW: Lessons learned table
CREATE TABLE lessons_learned (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_id UUID REFERENCES milestones(id) ON DELETE CASCADE,
  phase_id UUID REFERENCES phases(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  lesson TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  impact VARCHAR(20) NOT NULL,
  actionable TEXT,
  date TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lessons_learned_project_id ON lessons_learned(project_id);
CREATE INDEX idx_lessons_learned_milestone_id ON lessons_learned(milestone_id);
CREATE INDEX idx_lessons_learned_phase_id ON lessons_learned(phase_id);

-- NEW: Quick notes table
CREATE TABLE quick_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_id UUID REFERENCES milestones(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  audio_url VARCHAR(500),
  captured_at TIMESTAMP NOT NULL,
  captured_by VARCHAR(255) NOT NULL,
  tags TEXT[],
  processed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_quick_notes_project_id ON quick_notes(project_id);
CREATE INDEX idx_quick_notes_milestone_id ON quick_notes(milestone_id);
CREATE INDEX idx_quick_notes_processed ON quick_notes(processed);

-- NEW: Meetings table
CREATE TABLE meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  milestone_id UUID REFERENCES milestones(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  date TIMESTAMP NOT NULL,
  participants TEXT[] NOT NULL,
  purpose TEXT NOT NULL,
  outcomes TEXT[],
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_meetings_project_id ON meetings(project_id);
CREATE INDEX idx_meetings_milestone_id ON meetings(milestone_id);
CREATE INDEX idx_meetings_date ON meetings(date);
```

#### Artifact
```typescript
interface Artifact {
  id: string;
  milestoneId: string;
  type: 'document' | 'code' | 'diagram' | 'screenshot' | 'video' | 'other';
  name: string;
  filePath: string;
  url?: string;
  preview?: string;
  metadata: ArtifactMetadata;
}

interface ArtifactMetadata {
  fileSize?: number;
  mimeType?: string;
  lineCount?: number;
  language?: string;
}
```

**Database Schema:**
```sql
CREATE TABLE artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_id UUID NOT NULL REFERENCES milestones(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  name VARCHAR(500) NOT NULL,
  file_path VARCHAR(1000) NOT NULL,
  url VARCHAR(1000),
  preview TEXT,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_artifacts_milestone_id ON artifacts(milestone_id);
CREATE INDEX idx_artifacts_type ON artifacts(type);
```

#### Metric
```typescript
interface Metric {
  id: string;
  projectId: string;
  milestoneId?: string;
  name: string;
  value: number;
  unit?: string;
  type: 'count' | 'duration' | 'percentage' | 'custom';
  timestamp: Date;
  metadata: MetricMetadata;
}

interface MetricMetadata {
  source: 'auto' | 'manual';
  confidence?: number;
  notes?: string;
}
```

**Database Schema:**
```sql
CREATE TABLE metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  milestone_id UUID REFERENCES milestones(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  value NUMERIC NOT NULL,
  unit VARCHAR(50),
  type VARCHAR(50) NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_metrics_project_id ON metrics(project_id);
CREATE INDEX idx_metrics_milestone_id ON metrics(milestone_id);
CREATE INDEX idx_metrics_name ON metrics(name);
CREATE INDEX idx_metrics_timestamp ON metrics(timestamp);
```

#### Decision
```typescript
interface Decision {
  id: string;
  projectId: string;
  milestoneId?: string;
  title: string;
  context: string;
  optionsConsidered: DecisionOption[];
  chosenOption: string;
  rationale: string;
  date: Date;
  participants: string[];
  impact: 'low' | 'medium' | 'high';
}

interface DecisionOption {
  name: string;
  pros: string[];
  cons: string[];
}
```

**Database Schema:**
```sql
CREATE TABLE decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  milestone_id UUID REFERENCES milestones(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  context TEXT NOT NULL,
  options_considered JSONB NOT NULL,
  chosen_option VARCHAR(500) NOT NULL,
  rationale TEXT NOT NULL,
  date TIMESTAMP NOT NULL,
  participants TEXT[],
  impact VARCHAR(20) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_decisions_project_id ON decisions(project_id);
CREATE INDEX idx_decisions_milestone_id ON decisions(milestone_id);
CREATE INDEX idx_decisions_date ON decisions(date);
```


## User Interface Design

### Design Principles

**1. Progressive Disclosure**
- Show high-level timeline first, details on demand
- Collapsible phases and milestones
- Hover for quick info, click for full details

**2. Automatic with Manual Override**
- Auto-generate timeline from documentation
- Allow manual curation and enrichment
- Clearly distinguish auto vs manual content

**3. Real-Time Feedback**
- Live updates as documentation changes
- Presence indicators for concurrent users
- Immediate save confirmation

**4. Context-Rich Visualization**
- Timeline shows "what" happened
- Narrative shows "why" it happened
- Artifacts show "how" it was done

### Screen Layouts

#### 1. Project List View
```
┌─────────────────────────────────────────────────────────────┐
│  Product Timeline                    [+ New Project] [User] │
├─────────────────────────────────────────────────────────────┤
│  Search projects...                  [Grid] [List] [Table]  │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Warehouse    │  │ Timeline     │  │ Customer     │      │
│  │ Reception    │  │ Web App      │  │ Portal       │      │
│  │              │  │              │  │              │      │
│  │ 5 phases     │  │ 3 phases     │  │ 7 phases     │      │
│  │ 42 milestones│  │ 12 milestones│  │ 68 milestones│      │
│  │ Active       │  │ Active       │  │ Completed    │      │
│  │ Updated 2h   │  │ Updated 5m   │  │ Updated 3d   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

#### 2. Timeline View (Horizontal)
```
┌─────────────────────────────────────────────────────────────┐
│  ← Warehouse Reception App          [Export] [Share] [⚙️]   │
├─────────────────────────────────────────────────────────────┤
│  [Discovery] [Requirements] [Design] [Implementation] [Demo]│
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Nov 2025                                                    │
│  ●────────●──────────●──────────────────────────────●───●   │
│  │        │          │                              │   │   │
│  Tour    Reqs      Design                         T8  Demo  │
│  Nov 15  Nov 18    Nov 18                       Nov 19 Nov 19│
│                                                              │
│  [Zoom: ─────●─────] [Filter: All Phases ▼]                │
└─────────────────────────────────────────────────────────────┘
```

#### 3. Milestone Detail View
```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Timeline                                          │
├─────────────────────────────────────────────────────────────┤
│  Task 2: Authentication and Session Management              │
│  November 18, 2025 • Implementation Phase                   │
│  ⚡ Auto-generated from TASK_2_IMPLEMENTATION.md            │
├─────────────────────────────────────────────────────────────┤
│  📝 Narrative (Click to edit)                               │
│  Implemented comprehensive authentication system with        │
│  OAuth 2.0, JWT tokens, and secure storage...               │
│                                                              │
│  🎯 Requirements Addressed                                   │
│  ✅ 11.1 User Authentication                                │
│  ✅ 11.2 Session Action Association                         │
│  ✅ 11.4 Session Expiration Handling                        │
│                                                              │
│  📊 Metrics                                                  │
│  Time Taken: 4 hours                                        │
│  Files Created: 7                                           │
│  Lines of Code: ~850                                        │
│                                                              │
│  📎 Artifacts (7)                                            │
│  📄 TASK_2_IMPLEMENTATION.md                                │
│  💻 src/services/AuthService.ts                             │
│  💻 src/services/SecureStorage.ts                           │
│  🎨 src/screens/LoginScreen.tsx                             │
│  ...                                                         │
└─────────────────────────────────────────────────────────────┘
```

#### 4. Metrics Dashboard
```
┌─────────────────────────────────────────────────────────────┐
│  Warehouse Reception App - Metrics                           │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐  ┌──────────────────────┐        │
│  │ Tasks Completed      │  │ Test Coverage        │        │
│  │                      │  │                      │        │
│  │      14 / 27         │  │       94%            │        │
│  │   ████████░░░░░░     │  │   ████████████████   │        │
│  └──────────────────────┘  └──────────────────────┘        │
│                                                              │
│  ┌──────────────────────────────────────────────────┐      │
│  │ Velocity (Tasks per Day)                         │      │
│  │  ┌─┐                                              │      │
│  │  │█│     ┌─┐                                      │      │
│  │  │█│ ┌─┐ │█│                                      │      │
│  │  │█│ │█│ │█│                                      │      │
│  │  └─┘ └─┘ └─┘                                      │      │
│  │ Nov15 Nov18 Nov19                                 │      │
│  └──────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

#### 5. Export Dialog
```
┌─────────────────────────────────────────────────────────────┐
│  Export Timeline                                    [✕]      │
├─────────────────────────────────────────────────────────────┤
│  Format:                                                     │
│  ○ PowerPoint Presentation                                  │
│  ● PDF Report                                               │
│  ○ HTML Website                                             │
│  ○ JSON Data                                                │
│                                                              │
│  Include:                                                    │
│  ☑ All Phases                                               │
│  ☑ Narratives                                               │
│  ☑ Metrics                                                  │
│  ☑ Artifacts (links only)                                   │
│  ☐ Full artifact content                                    │
│                                                              │
│  Date Range:                                                 │
│  [Nov 15, 2025] to [Nov 19, 2025]                          │
│                                                              │
│                          [Cancel] [Generate Export]         │
└─────────────────────────────────────────────────────────────┘
```

### Navigation Flow

```
Project List
    │
    ├─→ Create Project Wizard
    │       │
    │       └─→ Configure Documentation Path
    │               │
    │               └─→ Initial Scan & Parse
    │                       │
    │                       └─→ Timeline View
    │
    └─→ Select Project
            │
            └─→ Timeline View
                    │
                    ├─→ Click Phase → Expanded Phase View
                    │
                    ├─→ Click Milestone → Milestone Detail
                    │       │
                    │       ├─→ Edit Narrative
                    │       ├─→ View Artifacts
                    │       ├─→ Add Decision
                    │       └─→ View Metrics
                    │
                    ├─→ Metrics Dashboard
                    │
                    ├─→ Search → Search Results → Milestone Detail
                    │
                    └─→ Export → Export Dialog → Download
```

## Error Handling

### Error Categories

1. **Documentation Parsing Errors**
   - Malformed markdown
   - Missing required sections
   - Invalid date formats
   - Unrecognized file types

2. **File System Errors**
   - Path not found
   - Permission denied
   - File locked
   - Disk full

3. **Database Errors**
   - Connection failures
   - Constraint violations
   - Query timeouts
   - Data corruption

4. **API Errors**
   - Authentication failures
   - Rate limiting
   - Invalid requests
   - Server errors

5. **Export Errors**
   - Template rendering failures
   - File generation errors
   - Storage upload failures
   - Format conversion errors

### Error Handling Strategy

**Frontend:**
- User-friendly error messages
- Retry mechanisms for transient failures
- Graceful degradation (show cached data if API fails)
- Error boundaries to prevent full app crashes
- Toast notifications for non-blocking errors
- Modal dialogs for critical errors

**Backend:**
- Structured error responses with error codes
- Detailed logging with context
- Automatic retry for transient failures
- Circuit breakers for external dependencies
- Dead letter queues for failed async jobs
- Alerting for critical errors

**Example Error Response:**
```json
{
  "error": {
    "code": "PARSE_ERROR",
    "message": "Failed to parse requirements document",
    "details": {
      "filePath": "/path/to/requirements.md",
      "line": 42,
      "reason": "Invalid EARS pattern syntax"
    },
    "userMessage": "We couldn't parse the requirements document. Please check line 42 for formatting issues.",
    "retryable": false,
    "timestamp": "2025-11-19T10:30:00Z",
    "correlationId": "req-abc123"
  }
}
```

## Testing Strategy

The testing strategy employs both unit testing and property-based testing to ensure comprehensive coverage and correctness.

### Unit Testing

Unit tests verify specific examples, edge cases, and integration points:

**Frontend:**
- Component rendering and user interactions
- State management (Redux actions, reducers, selectors)
- API client methods with mocked responses
- Timeline visualization logic
- Export generation

**Backend:**
- Service method behavior
- API endpoint request/response handling
- Database operations
- Documentation parsing logic
- File watching and event handling

**Testing Framework**: Jest for both frontend and backend, React Testing Library for components

### Property-Based Testing

Property-based tests verify universal properties that should hold across all inputs. We will use **fast-check** (JavaScript/TypeScript property-based testing library) for implementing these tests.

**Configuration**: Each property-based test will run a minimum of 100 iterations to ensure thorough coverage of the input space.

**Test Tagging**: Each property-based test will include a comment explicitly referencing the correctness property from the design document using this format:
```typescript
// Feature: product-timeline-webapp, Property 1: Timeline chronological ordering
```

The correctness properties and their corresponding tests are defined in the next section.

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Timeline Chronological Ordering
*For any* project timeline, all milestones within a phase should be ordered chronologically by date, and phases should be ordered by their start dates.

**Validates: Requirements 1.6, 1.8, 2.2**

**Test Strategy**: Generate random projects with random milestones and dates, verify ordering is maintained.

### Property 2: Documentation Parse Idempotence
*For any* valid documentation file, parsing it multiple times should produce identical results.

**Validates: Requirements 1.2, 1.3, 1.4, 1.5**

**Test Strategy**: Generate random markdown documents, parse twice, verify results are equal.

### Property 3: Auto-Generated Content Preservation
*For any* timeline with auto-generated milestones, when a user adds manual narrative, the auto-generated content should remain unchanged.

**Validates: Requirements 3.3, 3.4, 10.2, 10.8**

**Test Strategy**: Generate random timelines, add manual narratives, verify auto-generated fields unchanged.

### Property 4: File Change Detection Completeness
*For any* file modification in a watched project directory, the file watcher should detect the change and trigger a re-parse within a bounded time period.

**Validates: Requirements 10.1, 10.2, 10.9**

**Test Strategy**: Create random files, modify them, verify change events are emitted.

### Property 5: Export Content Fidelity
*For any* timeline exported to any format, all included milestones, narratives, and metrics should be present in the exported artifact.

**Validates: Requirements 8.2, 8.3, 8.4, 8.6**

**Test Strategy**: Generate random timelines, export to each format, verify all content present.

### Property 6: API Response Consistency
*For any* project, querying the timeline via API should return the same data as displayed in the UI.

**Validates: Requirements 12.1, 12.2, 12.4**

**Test Strategy**: Generate random projects, fetch via API and UI, verify data matches.

### Property 7: Webhook Delivery Guarantee
*For any* registered webhook, when a timeline event occurs, the webhook should be called with the correct payload, with retries on failure.

**Validates: Requirements 12.7**

**Test Strategy**: Generate random events, verify webhook called, simulate failures, verify retries.

### Property 8: Search Result Relevance
*For any* search query, all returned results should contain the search terms in their content.

**Validates: Requirements 11.1, 11.2, 11.3**

**Test Strategy**: Generate random timelines and queries, verify all results match query.

### Property 9: Metric Aggregation Correctness
*For any* project, the sum of phase-level metrics should equal the project-level aggregate metric.

**Validates: Requirements 4.1, 4.3, 4.5**

**Test Strategy**: Generate random projects with metrics, verify aggregation math is correct.

### Property 10: Concurrent Edit Conflict Detection
*For any* two concurrent edits to the same milestone narrative, the system should detect the conflict and present both versions.

**Validates: Requirements 10.5, 10.8**

**Test Strategy**: Simulate concurrent edits, verify conflict detection and resolution UI.

## Security Considerations

### Authentication and Authorization

**User Authentication:**
- JWT tokens with short expiration (15 minutes)
- Refresh tokens with longer expiration (7 days)
- Secure token storage (httpOnly cookies)
- Password hashing with bcrypt (cost factor 12)

**Service-to-Service Authentication:**
- API keys for ops platform integration
- OAuth 2.0 client credentials flow
- Key rotation support
- Rate limiting per API key

**Authorization:**
- Role-based access control (RBAC)
- Project-level permissions (owner, editor, viewer)
- API endpoint authorization middleware
- Audit logging for sensitive operations

### Data Security

**In Transit:**
- TLS 1.3 for all connections
- HTTPS only (HSTS enabled)
- Certificate pinning for mobile clients

**At Rest:**
- Database encryption (PostgreSQL transparent data encryption)
- Encrypted backups
- Secure credential storage (environment variables, secrets manager)

**Input Validation:**
- Sanitize all user inputs
- Validate file paths to prevent directory traversal
- Limit file upload sizes
- Content Security Policy (CSP) headers

### API Security

**Rate Limiting:**
- Per-user limits (100 requests/minute)
- Per-API-key limits (1000 requests/minute)
- Exponential backoff for repeated failures

**CORS:**
- Whitelist allowed origins
- Configurable for ops platform embedding
- Credentials support for authenticated requests

**Webhook Security:**
- HMAC signature verification
- HTTPS-only webhook URLs
- Retry limits to prevent abuse

## Performance Optimization

### Frontend Performance

**Code Splitting:**
- Route-based code splitting
- Lazy loading for heavy components (timeline viewer, export generator)
- Dynamic imports for libraries

**Caching:**
- Redux Persist for offline state
- Service Worker for static assets
- API response caching with RTK Query

**Rendering Optimization:**
- Virtual scrolling for large timelines
- Memoization for expensive computations
- Debounced search and filtering

### Backend Performance

**Database Optimization:**
- Indexed columns for common queries
- Connection pooling
- Query optimization (EXPLAIN ANALYZE)
- Materialized views for complex aggregations

**Caching:**
- Redis for session data
- Cached parsed documentation
- CDN for static exports

**Async Processing:**
- Background jobs for parsing and exports
- Message queue for webhook delivery
- Worker processes for CPU-intensive tasks

### Scalability

**Horizontal Scaling:**
- Stateless API servers
- Load balancing with Nginx
- Database read replicas

**Vertical Scaling:**
- Optimize memory usage
- Efficient data structures
- Streaming for large exports

## Deployment and Operations

### Deployment Strategy

**Environments:**
- Development: Local Docker Compose
- Staging: Cloud-hosted with test data
- Production: Multi-region with HA

**CI/CD Pipeline:**
1. Code commit triggers build
2. Run tests (unit, integration, property-based)
3. Build Docker images
4. Push to container registry
5. Deploy to staging
6. Run smoke tests
7. Manual approval for production
8. Deploy to production
9. Run health checks

**Database Migrations:**
- Versioned migrations with TypeORM
- Automated migration on deployment
- Rollback support
- Zero-downtime migrations

### Monitoring and Observability

**Metrics:**
- API response times
- Database query performance
- Parse job duration
- Export generation time
- Webhook delivery success rate

**Logging:**
- Structured JSON logs
- Log levels (debug, info, warn, error)
- Correlation IDs for request tracing
- Centralized log aggregation

**Alerting:**
- High error rates
- Slow API responses
- Database connection failures
- Disk space warnings
- Failed webhook deliveries

**Health Checks:**
- Liveness probe (server is running)
- Readiness probe (server can handle requests)
- Database connectivity check
- File system access check

### Backup and Recovery

**Database Backups:**
- Automated daily backups
- Point-in-time recovery
- Backup retention (30 days)
- Backup verification

**Disaster Recovery:**
- Multi-region deployment
- Automated failover
- Recovery Time Objective (RTO): 1 hour
- Recovery Point Objective (RPO): 15 minutes

## AI Assistant Integration

### Design Philosophy

The Timeline Application provides a generic **AI Assistant Integration API** that allows any AI coding assistant or IDE to capture timeline context. Kiro IDE is the first and reference implementation, with full support for the Kiro workflow including natural language commands, automatic conversation parsing, and proactive suggestions.

### Integration Architecture

```typescript
// Generic AI Assistant Integration Interface
interface AIAssistantIntegration {
  // Core capture methods
  captureNote(note: QuickNoteCapture): Promise<void>;
  captureDecision(decision: DecisionCapture): Promise<void>;
  captureFeedback(feedback: FeedbackCapture): Promise<void>;
  captureBusinessContext(context: BusinessContextCapture): Promise<void>;
  captureLessonLearned(lesson: LessonCapture): Promise<void>;
  logMeeting(meeting: MeetingCapture): Promise<void>;
  
  // Conversation parsing
  parseConversationLog(logPath: string): Promise<ConversationData>;
  
  // Context awareness
  getCurrentProject(): Promise<string | null>;
  getCurrentMilestone(): Promise<string | null>;
  suggestCapture(content: string): Promise<CaptureSuggestion>;
}

// Capture types
interface QuickNoteCapture {
  projectId: string;
  milestoneId?: string;
  content: string;
  tags?: string[];
  conversationContext?: string; // Kiro-specific: surrounding conversation
}

interface DecisionCapture {
  projectId: string;
  milestoneId?: string;
  title: string;
  context: string;
  optionsConsidered: string[];
  chosenOption: string;
  rationale: string;
  conversationContext?: string;
}

interface FeedbackCapture {
  projectId: string;
  milestoneId?: string;
  stakeholder: string;
  role: string;
  feedback: string;
  sentiment: 'positive' | 'neutral' | 'concern' | 'blocker';
}
```

### Kiro-Specific Integration (Phase 1)

**Natural Language Commands:**
```
User: "Kiro, log this decision: We chose React Native over Flutter because of team expertise"
Kiro: ✓ Decision logged to Timeline (Warehouse Reception project, Task 1 milestone)

User: "Kiro, capture stakeholder feedback: Steven wants ASN support prioritized"
Kiro: ✓ Stakeholder feedback captured (Steven Jackson, concern level)

User: "Kiro, quick note: TIN format needs warehouse prefix for multi-site support"
Kiro: ✓ Note added to Timeline (tagged: architecture, multi-warehouse)
```

**Automatic Conversation Parsing:**
- Kiro monitors conversation for decision points
- Extracts clarifications and context automatically
- Parses CONVERSATION_LOG.md files for historical context
- Identifies stakeholder mentions and feedback

**Proactive Suggestions:**
```
Kiro: "I noticed you just made a decision about authentication. 
       Would you like me to log this to the Timeline? [Yes] [No] [Customize]"

User: "Yes"
Kiro: ✓ Decision captured with full context from our conversation
```

**Context Awareness:**
- Kiro knows which project you're working on (from file paths, conversation)
- Associates captures with relevant milestones automatically
- Suggests tags based on conversation topics

**Kiro-Specific Features (Preserved):**
1. **Conversation Context**: Every capture includes surrounding conversation for full context
2. **Natural Language**: No structured commands, just talk naturally
3. **Proactive Suggestions**: Kiro suggests captures at the right moments
4. **Automatic Parsing**: Existing CONVERSATION_LOG.md files are parsed automatically
5. **Smart Tagging**: Kiro suggests relevant tags based on conversation
6. **Project Detection**: Kiro knows which project you're working on
7. **Milestone Association**: Kiro links captures to the right milestone

### API Endpoints for AI Assistant Integration

```
POST   /api/v1/integrations/capture/note
POST   /api/v1/integrations/capture/decision
POST   /api/v1/integrations/capture/feedback
POST   /api/v1/integrations/capture/business-context
POST   /api/v1/integrations/capture/lesson
POST   /api/v1/integrations/capture/meeting

POST   /api/v1/integrations/parse/conversation
GET    /api/v1/integrations/context/project
GET    /api/v1/integrations/context/milestone
POST   /api/v1/integrations/suggest-capture
```

**Authentication:**
- API key per AI assistant instance
- User-scoped permissions
- Rate limiting per integration

**Request Example:**
```json
POST /api/v1/integrations/capture/decision
{
  "projectId": "warehouse-reception-001",
  "milestoneId": "milestone-task-1",
  "title": "Authentication Approach",
  "context": "Need to choose auth method for mobile app",
  "optionsConsidered": [
    "OAuth 2.0 with JWT",
    "Basic Auth",
    "API Keys"
  ],
  "chosenOption": "OAuth 2.0 with JWT",
  "rationale": "Industry standard, supports token refresh, secure",
  "conversationContext": "User asked about auth, discussed security requirements...",
  "source": "kiro-ide",
  "capturedBy": "don.hiles@qts.com",
  "timestamp": "2025-11-18T10:30:00Z"
}
```

### Future AI Assistant Integrations (Phase 2+)

**VS Code Copilot:**
- Chat commands: `/timeline log decision`
- Inline suggestions in code comments
- Sidebar panel for quick capture

**Cursor:**
- Similar to VS Code integration
- Composer integration for long-form context

**GitHub Copilot Chat:**
- Slash commands in GitHub interface
- PR comment integration

**Generic CLI Tool:**
- Works with any editor/IDE
- Command: `timeline capture note "content here"`
- Useful for terminal-based workflows

**All future integrations use the same API** - no Timeline Application changes needed.

## Future Enhancements

### Phase 2 Features

**Bidirectional Sync:**
- Ops platform can write data back to timeline
- Conflict resolution for concurrent edits
- Audit trail for external modifications

**Advanced Analytics:**
- Pattern detection across projects
- Predictive metrics (estimated completion)
- Anomaly detection (unusual delays)

**AI-Powered Features:**
- Automatic narrative generation from code commits
- Decision extraction from conversation logs
- Stakeholder sentiment analysis

### Phase 3 Features

**Collaboration:**
- Real-time collaborative editing
- Comments and discussions on milestones
- @mentions and notifications

**Templates:**
- Industry-specific templates
- Custom template creation
- Template marketplace

**Integrations:**
- Jira/GitHub issue tracking
- Slack/Teams notifications
- Google Drive/Dropbox for artifacts

## Conclusion

The Product Timeline Web Application design provides a comprehensive solution for building living case studies from project documentation. The architecture prioritizes automation, real-time updates, and rich integration capabilities while maintaining flexibility for manual curation and enrichment.

Key design decisions:
- **Separation of concerns**: Clear boundaries between parsing, storage, visualization, and export
- **API-first**: All functionality accessible via API for ops platform integration
- **Real-time by default**: File watching and WebSocket updates keep timeline current
- **Progressive enhancement**: Auto-generate timeline, allow manual enrichment
- **Scalable architecture**: Designed to handle multiple projects with thousands of milestones

The system is ready for implementation with a clear path from MVP (basic parsing and visualization) to full-featured platform (webhooks, advanced analytics, AI features).
