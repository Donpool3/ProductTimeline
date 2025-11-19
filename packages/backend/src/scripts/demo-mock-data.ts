#!/usr/bin/env ts-node
/**
 * Demo Script: Mock Data Service
 *
 * Demonstrates the MockDataService capabilities by generating
 * and displaying sample data.
 *
 * Usage: ts-node src/scripts/demo-mock-data.ts
 */

import { MockDataService } from '../services/mock-data.service';

const service = new MockDataService();

console.log('='.repeat(80));
console.log('Mock Data Service Demo');
console.log('='.repeat(80));
console.log();

// Generate a project
console.log('1. Generating Mock Project...');
const project = service.generateMockProject();
console.log(`   ✓ Project: ${project.name}`);
console.log(`   ✓ ID: ${project.id}`);
console.log(`   ✓ Status: ${project.status}`);
console.log(`   ✓ Stakeholders: ${project.metadata.stakeholders.length}`);
console.log();

// Generate phases
console.log('2. Generating Mock Phases...');
const phases = service.generateMockPhases(project.id);
console.log(`   ✓ Generated ${phases.length} phases:`);
phases.forEach((phase, index) => {
  console.log(`      ${index + 1}. ${phase.name} (${phase.color})`);
});
console.log();

// Generate timeline
console.log('3. Generating Complete Timeline...');
const timeline = service.generateMockTimeline(project.id);
console.log(`   ✓ Phases: ${timeline.phases.length}`);
console.log(`   ✓ Milestones: ${timeline.milestones.length}`);
console.log();

// Show milestone details
console.log('4. Sample Milestone Details:');
const sampleMilestone = timeline.milestones[0];
console.log(`   Title: ${sampleMilestone.title}`);
console.log(`   Date: ${sampleMilestone.date.toISOString().split('T')[0]}`);
console.log(`   Type: ${sampleMilestone.type}`);
console.log(`   Stakeholders: ${sampleMilestone.stakeholders.join(', ')}`);
console.log(`   Artifacts: ${sampleMilestone.artifacts.length}`);
console.log(`   Metrics: ${sampleMilestone.metrics?.length || 0}`);
console.log(`   Decisions: ${sampleMilestone.decisions?.length || 0}`);
console.log(`   Feedback: ${sampleMilestone.stakeholderFeedback?.length || 0}`);
console.log(`   Lessons: ${sampleMilestone.lessonsLearned?.length || 0}`);
console.log();

// Show business context
if (sampleMilestone.businessContext) {
  console.log('5. Business Context:');
  console.log(`   Problem: ${sampleMilestone.businessContext.problemStatement}`);
  console.log(`   Impact: ${sampleMilestone.businessContext.businessImpact}`);
  console.log(`   Urgency: ${sampleMilestone.businessContext.urgency}`);
  console.log(`   ROI: ${sampleMilestone.businessContext.roi}`);
  console.log();
}

// Show stakeholder feedback
if (sampleMilestone.stakeholderFeedback && sampleMilestone.stakeholderFeedback.length > 0) {
  console.log('6. Sample Stakeholder Feedback:');
  const feedback = sampleMilestone.stakeholderFeedback[0];
  console.log(`   From: ${feedback.stakeholder} (${feedback.role})`);
  console.log(`   Sentiment: ${feedback.sentiment}`);
  console.log(`   Feedback: "${feedback.feedback}"`);
  console.log();
}

// Generate metrics
console.log('7. Generating Mock Metrics...');
const metrics = service.generateMockMetrics(project.id, 5);
console.log(`   ✓ Generated ${metrics.length} metrics:`);
metrics.forEach((metric) => {
  console.log(`      • ${metric.name}: ${metric.value} ${metric.unit}`);
});
console.log();

// Summary
console.log('='.repeat(80));
console.log('Summary:');
console.log(`  • Project generated with complete metadata`);
console.log(`  • ${timeline.phases.length} phases with realistic date ranges`);
console.log(`  • ${timeline.milestones.length} milestones with full details`);
console.log(`  • All entity types included (artifacts, metrics, decisions, feedback, etc.)`);
console.log(`  • Ready for use in development and testing`);
console.log('='.repeat(80));
