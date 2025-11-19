import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  name = 'InitialSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create projects table
    await queryRunner.query(`
      CREATE TABLE "projects" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" VARCHAR(255) NOT NULL,
        "description" TEXT,
        "documentation_path" VARCHAR(500) NOT NULL,
        "status" VARCHAR(20) NOT NULL DEFAULT 'active',
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "created_by" VARCHAR(100),
        "metadata" JSONB
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_projects_status" ON "projects" ("status")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_projects_created_at" ON "projects" ("created_at")
    `);

    // Create phases table
    await queryRunner.query(`
      CREATE TABLE "phases" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "project_id" uuid NOT NULL,
        "name" VARCHAR(255) NOT NULL,
        "description" TEXT,
        "start_date" TIMESTAMP NOT NULL,
        "end_date" TIMESTAMP,
        "order_index" INTEGER NOT NULL,
        "color" VARCHAR(7),
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT "fk_phases_project" FOREIGN KEY ("project_id") 
          REFERENCES "projects"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_phases_project_id" ON "phases" ("project_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_phases_order" ON "phases" ("project_id", "order_index")
    `);

    // Create business_contexts table
    await queryRunner.query(`
      CREATE TABLE "business_contexts" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "problem_statement" TEXT NOT NULL,
        "business_impact" TEXT NOT NULL,
        "urgency" VARCHAR(20) NOT NULL,
        "roi" TEXT,
        "success_metrics" TEXT[] NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    // Create milestones table
    await queryRunner.query(`
      CREATE TABLE "milestones" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "project_id" uuid NOT NULL,
        "phase_id" uuid NOT NULL,
        "title" VARCHAR(500) NOT NULL,
        "description" TEXT,
        "date" TIMESTAMP NOT NULL,
        "type" VARCHAR(20) NOT NULL DEFAULT 'auto',
        "source" VARCHAR(500),
        "narrative" TEXT,
        "stakeholders" TEXT[] DEFAULT '{}',
        "business_context_id" uuid,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT "fk_milestones_project" FOREIGN KEY ("project_id") 
          REFERENCES "projects"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_milestones_phase" FOREIGN KEY ("phase_id") 
          REFERENCES "phases"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_milestones_business_context" FOREIGN KEY ("business_context_id") 
          REFERENCES "business_contexts"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_milestones_project_id" ON "milestones" ("project_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_milestones_phase_id" ON "milestones" ("phase_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_milestones_date" ON "milestones" ("date")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_milestones_type" ON "milestones" ("type")
    `);

    // Create artifacts table
    await queryRunner.query(`
      CREATE TABLE "artifacts" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "milestone_id" uuid NOT NULL,
        "type" VARCHAR(100) NOT NULL,
        "name" VARCHAR(500) NOT NULL,
        "file_path" VARCHAR(1000) NOT NULL,
        "preview" TEXT,
        "metadata" JSONB,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT "fk_artifacts_milestone" FOREIGN KEY ("milestone_id") 
          REFERENCES "milestones"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_artifacts_milestone_id" ON "artifacts" ("milestone_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_artifacts_type" ON "artifacts" ("type")
    `);

    // Create metrics table
    await queryRunner.query(`
      CREATE TABLE "metrics" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "project_id" uuid NOT NULL,
        "milestone_id" uuid,
        "name" VARCHAR(255) NOT NULL,
        "type" VARCHAR(50) NOT NULL,
        "value" DECIMAL(10, 2) NOT NULL,
        "unit" VARCHAR(50),
        "timestamp" TIMESTAMP NOT NULL,
        "metadata" JSONB,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT "fk_metrics_milestone" FOREIGN KEY ("milestone_id") 
          REFERENCES "milestones"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_metrics_milestone_id" ON "metrics" ("milestone_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_metrics_project_id" ON "metrics" ("project_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_metrics_name" ON "metrics" ("name")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_metrics_timestamp" ON "metrics" ("timestamp")
    `);

    // Create decisions table
    await queryRunner.query(`
      CREATE TABLE "decisions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "project_id" uuid NOT NULL,
        "milestone_id" uuid NOT NULL,
        "title" VARCHAR(500) NOT NULL,
        "date" TIMESTAMP NOT NULL,
        "context" TEXT NOT NULL,
        "options_considered" TEXT[] DEFAULT '{}',
        "chosen_approach" TEXT NOT NULL,
        "rationale" TEXT NOT NULL,
        "stakeholders" TEXT[] DEFAULT '{}',
        "metadata" JSONB,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT "fk_decisions_milestone" FOREIGN KEY ("milestone_id") 
          REFERENCES "milestones"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_decisions_milestone_id" ON "decisions" ("milestone_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_decisions_project_id" ON "decisions" ("project_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_decisions_date" ON "decisions" ("date")
    `);

    // Create stakeholder_feedback table
    await queryRunner.query(`
      CREATE TABLE "stakeholder_feedback" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "milestone_id" uuid NOT NULL,
        "stakeholder" VARCHAR(255) NOT NULL,
        "role" VARCHAR(255),
        "feedback" TEXT NOT NULL,
        "sentiment" VARCHAR(20) NOT NULL,
        "date" TIMESTAMP NOT NULL,
        "context" TEXT,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT "fk_stakeholder_feedback_milestone" FOREIGN KEY ("milestone_id") 
          REFERENCES "milestones"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_stakeholder_feedback_milestone_id" ON "stakeholder_feedback" ("milestone_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_stakeholder_feedback_stakeholder" ON "stakeholder_feedback" ("stakeholder")
    `);

    // Create lessons_learned table
    await queryRunner.query(`
      CREATE TABLE "lessons_learned" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "milestone_id" uuid NOT NULL,
        "lesson" TEXT NOT NULL,
        "category" VARCHAR(50) NOT NULL,
        "impact" VARCHAR(20) NOT NULL,
        "actionable" TEXT,
        "date" TIMESTAMP NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT "fk_lessons_learned_milestone" FOREIGN KEY ("milestone_id") 
          REFERENCES "milestones"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_lessons_learned_milestone_id" ON "lessons_learned" ("milestone_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_lessons_learned_category" ON "lessons_learned" ("category")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_lessons_learned_impact" ON "lessons_learned" ("impact")
    `);

    // Create quick_notes table
    await queryRunner.query(`
      CREATE TABLE "quick_notes" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "milestone_id" uuid NOT NULL,
        "content" TEXT NOT NULL,
        "audio_url" VARCHAR(1000),
        "captured_at" TIMESTAMP NOT NULL,
        "captured_by" VARCHAR(255) NOT NULL,
        "tags" TEXT[] DEFAULT '{}',
        "processed" BOOLEAN DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT "fk_quick_notes_milestone" FOREIGN KEY ("milestone_id") 
          REFERENCES "milestones"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_quick_notes_milestone_id" ON "quick_notes" ("milestone_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_quick_notes_captured_by" ON "quick_notes" ("captured_by")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_quick_notes_processed" ON "quick_notes" ("processed")
    `);

    // Create meetings table
    await queryRunner.query(`
      CREATE TABLE "meetings" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "milestone_id" uuid NOT NULL,
        "title" VARCHAR(500) NOT NULL,
        "date" TIMESTAMP NOT NULL,
        "participants" TEXT[] DEFAULT '{}',
        "purpose" TEXT NOT NULL,
        "outcomes" TEXT[] DEFAULT '{}',
        "decision_ids" uuid[] DEFAULT '{}',
        "notes" TEXT,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT "fk_meetings_milestone" FOREIGN KEY ("milestone_id") 
          REFERENCES "milestones"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_meetings_milestone_id" ON "meetings" ("milestone_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_meetings_date" ON "meetings" ("date")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "meetings" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "quick_notes" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "lessons_learned" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "stakeholder_feedback" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "decisions" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "metrics" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "artifacts" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "milestones" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "business_contexts" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "phases" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "projects" CASCADE`);
  }
}
