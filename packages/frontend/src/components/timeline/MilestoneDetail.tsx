/**
 * Milestone Detail View Component
 *
 * Displays comprehensive information about a milestone including:
 * - Basic information (title, description, date, type)
 * - Narrative with edit capability
 * - Artifacts list with type indicators
 * - Metrics and decisions
 * - Stakeholder feedback
 * - Business context
 * - Lessons learned
 * - Quick notes
 * - Meetings
 *
 * Requirements:
 * - 2.4: Display detailed milestone information
 * - 2.5: Show links to associated artifacts with preview capabilities
 * - 3.1: Display editable narrative field
 * - 3.4: Show both auto-generated and user-added narrative
 * - 13.6: Display stakeholder feedback section
 * - 13.7: Display business context section
 * - 13.8: Display lessons learned section
 */

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  IconButton,
  Button,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Description as DocumentIcon,
  Code as CodeIcon,
  Image as ImageIcon,
  BugReport as TestIcon,
  Screenshot as ScreenshotIcon,
  InsertDriveFile as FileIcon,
  TrendingUp as MetricIcon,
  Gavel as DecisionIcon,
  Feedback as FeedbackIcon,
  Business as BusinessIcon,
  Lightbulb as LessonIcon,
  Note as NoteIcon,
  Event as MeetingIcon,
  AutoAwesome as AutoIcon,
  Edit as ManualIcon,
} from '@mui/icons-material';
import { Milestone } from '../../types';
import { NarrativeEditor } from './NarrativeEditor';

export interface MilestoneDetailProps {
  milestone: Milestone;
  phaseName?: string;
  onBack?: () => void;
  onNarrativeUpdate?: (milestoneId: string, narrative: string) => void;
}

/**
 * Milestone Detail View Component
 *
 * Comprehensive view of a single milestone with all related information.
 */
export const MilestoneDetail: React.FC<MilestoneDetailProps> = ({
  milestone,
  phaseName,
  onBack,
  onNarrativeUpdate,
}) => {
  const [isEditingNarrative, setIsEditingNarrative] = useState(false);

  const handleSaveNarrative = (content: string) => {
    if (onNarrativeUpdate) {
      onNarrativeUpdate(milestone.id, content);
    }
    setIsEditingNarrative(false);
  };

  const handleCancelEdit = () => {
    setIsEditingNarrative(false);
  };

  const getArtifactIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <DocumentIcon />;
      case 'code':
        return <CodeIcon />;
      case 'diagram':
        return <ImageIcon />;
      case 'test':
        return <TestIcon />;
      case 'screenshot':
        return <ScreenshotIcon />;
      default:
        return <FileIcon />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'success';
      case 'neutral':
        return 'default';
      case 'concern':
        return 'warning';
      case 'blocker':
        return 'error';
      default:
        return 'default';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low':
        return 'default';
      case 'medium':
        return 'info';
      case 'high':
        return 'warning';
      case 'critical':
        return 'error';
      default:
        return 'default';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'low':
        return 'default';
      case 'medium':
        return 'info';
      case 'high':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {onBack && (
            <IconButton onClick={onBack} sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
          )}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {milestone.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
              <Typography variant="body2" color="text.secondary">
                {new Date(milestone.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Typography>
              {phaseName && (
                <>
                  <Typography variant="body2" color="text.secondary">
                    •
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {phaseName} Phase
                  </Typography>
                </>
              )}
              <Chip
                icon={milestone.type === 'auto' ? <AutoIcon /> : <ManualIcon />}
                label={milestone.type === 'auto' ? 'Auto-generated' : 'Manual'}
                size="small"
                color={milestone.type === 'auto' ? 'primary' : 'secondary'}
              />
            </Box>
          </Box>
        </Box>

        {milestone.source && (
          <Alert severity="info" icon={<FileIcon />} sx={{ mt: 2 }}>
            Generated from: {milestone.source}
          </Alert>
        )}

        {milestone.description && (
          <Typography variant="body1" sx={{ mt: 2 }}>
            {milestone.description}
          </Typography>
        )}
      </Paper>

      {/* Scrollable Content */}
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {/* Narrative Section */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EditIcon /> Narrative
            </Typography>
            {!isEditingNarrative && (
              <Button
                startIcon={<EditIcon />}
                onClick={() => setIsEditingNarrative(true)}
                size="small"
              >
                Edit
              </Button>
            )}
          </Box>

          {isEditingNarrative ? (
            <NarrativeEditor
              milestoneId={milestone.id}
              initialContent={milestone.narrative || ''}
              stakeholders={milestone.stakeholders}
              onSave={handleSaveNarrative}
              onCancel={handleCancelEdit}
              readOnly={false}
            />
          ) : (
            <Box>
              {milestone.narrative ? (
                <Box
                  sx={{
                    '& h1': { fontSize: '2em', fontWeight: 'bold', mt: 1, mb: 1 },
                    '& h2': { fontSize: '1.5em', fontWeight: 'bold', mt: 1, mb: 1 },
                    '& h3': { fontSize: '1.25em', fontWeight: 'bold', mt: 1, mb: 1 },
                    '& ul, & ol': { pl: 3, mt: 1, mb: 1 },
                    '& li': { mb: 0.5 },
                    '& a': { color: 'primary.main', textDecoration: 'underline' },
                    '& .mention': {
                      color: 'primary.main',
                      bgcolor: 'primary.light',
                      borderRadius: 1,
                      px: 1,
                      py: 0.25,
                      fontWeight: 500,
                    },
                  }}
                  dangerouslySetInnerHTML={{ __html: milestone.narrative }}
                />
              ) : (
                <Typography variant="body1" color="text.secondary" fontStyle="italic">
                  No narrative added yet. Click Edit to add context about this milestone.
                </Typography>
              )}
            </Box>
          )}
        </Paper>

        {/* Business Context Section */}
        {milestone.businessContext && (
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <BusinessIcon /> Business Context
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Problem Statement
                </Typography>
                <Typography variant="body1">
                  {milestone.businessContext.problemStatement}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Business Impact
                </Typography>
                <Typography variant="body1">
                  {milestone.businessContext.businessImpact}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Urgency
                  </Typography>
                  <Chip
                    label={milestone.businessContext.urgency.toUpperCase()}
                    color={getUrgencyColor(milestone.businessContext.urgency) as any}
                    size="small"
                  />
                </Box>
                {milestone.businessContext.roi && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Expected ROI
                    </Typography>
                    <Typography variant="body2">
                      {milestone.businessContext.roi}
                    </Typography>
                  </Box>
                )}
              </Box>
              {milestone.businessContext.successMetrics.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Success Metrics
                  </Typography>
                  <List dense>
                    {milestone.businessContext.successMetrics.map((metric, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={`• ${metric}`} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          </Paper>
        )}

        {/* Artifacts Section */}
        {milestone.artifacts.length > 0 && (
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <FileIcon /> Artifacts ({milestone.artifacts.length})
            </Typography>
            <List>
              {milestone.artifacts.map((artifact) => (
                <ListItem
                  key={artifact.id}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1,
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <ListItemIcon>{getArtifactIcon(artifact.type)}</ListItemIcon>
                  <ListItemText
                    primary={artifact.name}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.secondary">
                          {artifact.type} • {artifact.filePath}
                        </Typography>
                        {artifact.preview && (
                          <Typography
                            component="div"
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                          >
                            {artifact.preview}
                          </Typography>
                        )}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

        {/* Metrics Section */}
        {milestone.metrics.length > 0 && (
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <MetricIcon /> Metrics
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {milestone.metrics.map((metric) => (
                <Card key={metric.id} variant="outlined" sx={{ minWidth: 200 }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      {metric.name}
                    </Typography>
                    <Typography variant="h4" component="div">
                      {metric.value}
                      {metric.unit && (
                        <Typography component="span" variant="h6" color="text.secondary">
                          {' '}
                          {metric.unit}
                        </Typography>
                      )}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Paper>
        )}

        {/* Decisions Section */}
        {milestone.decisions.length > 0 && (
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <DecisionIcon /> Decisions ({milestone.decisions.length})
            </Typography>
            {milestone.decisions.map((decision) => (
              <Card key={decision.id} variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {decision.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {new Date(decision.date).toLocaleDateString()}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    Context
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {decision.context}
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    Options Considered
                  </Typography>
                  <List dense>
                    {decision.optionsConsidered.map((option, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={`• ${option}`} />
                      </ListItem>
                    ))}
                  </List>
                  <Typography variant="subtitle2" gutterBottom>
                    Chosen Approach
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {decision.chosenApproach}
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    Rationale
                  </Typography>
                  <Typography variant="body2">
                    {decision.rationale}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Paper>
        )}

        {/* Stakeholder Feedback Section */}
        {milestone.stakeholderFeedback.length > 0 && (
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <FeedbackIcon /> Stakeholder Feedback ({milestone.stakeholderFeedback.length})
            </Typography>
            {milestone.stakeholderFeedback.map((feedback) => (
              <Card key={feedback.id} variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {feedback.stakeholder}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feedback.role}
                      </Typography>
                    </Box>
                    <Chip
                      label={feedback.sentiment}
                      color={getSentimentColor(feedback.sentiment) as any}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body1" sx={{ fontStyle: 'italic', my: 1 }}>
                    "{feedback.feedback}"
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(feedback.date).toLocaleDateString()}
                    {feedback.context && ` • ${feedback.context}`}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Paper>
        )}

        {/* Lessons Learned Section */}
        {milestone.lessonsLearned.length > 0 && (
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <LessonIcon /> Lessons Learned ({milestone.lessonsLearned.length})
            </Typography>
            {milestone.lessonsLearned.map((lesson) => (
              <Card key={lesson.id} variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                    <Chip label={lesson.category} size="small" />
                    <Chip
                      label={`${lesson.impact} impact`}
                      color={getImpactColor(lesson.impact) as any}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body1" paragraph>
                    {lesson.lesson}
                  </Typography>
                  {lesson.actionable && (
                    <>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Actionable Insight
                      </Typography>
                      <Typography variant="body2">
                        {lesson.actionable}
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </Paper>
        )}

        {/* Quick Notes Section */}
        {milestone.quickNotes.length > 0 && (
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <NoteIcon /> Quick Notes ({milestone.quickNotes.length})
            </Typography>
            <List>
              {milestone.quickNotes.map((note) => (
                <ListItem
                  key={note.id}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1,
                    bgcolor: note.processed ? 'background.paper' : 'action.hover',
                  }}
                >
                  <ListItemText
                    primary={note.content}
                    secondary={
                      <>
                        <Typography component="span" variant="caption" color="text.secondary">
                          {new Date(note.capturedAt).toLocaleString()} • {note.capturedBy}
                        </Typography>
                        {note.tags && note.tags.length > 0 && (
                          <Box sx={{ mt: 0.5, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {note.tags.map((tag, index) => (
                              <Chip key={index} label={tag} size="small" variant="outlined" />
                            ))}
                          </Box>
                        )}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

        {/* Meetings Section */}
        {milestone.meetings.length > 0 && (
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <MeetingIcon /> Meetings ({milestone.meetings.length})
            </Typography>
            {milestone.meetings.map((meeting) => (
              <Card key={meeting.id} variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {meeting.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {new Date(meeting.date).toLocaleString()}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    Participants
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                    {meeting.participants.map((participant, index) => (
                      <Chip key={index} label={participant} size="small" />
                    ))}
                  </Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Purpose
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {meeting.purpose}
                  </Typography>
                  {meeting.outcomes.length > 0 && (
                    <>
                      <Typography variant="subtitle2" gutterBottom>
                        Outcomes
                      </Typography>
                      <List dense>
                        {meeting.outcomes.map((outcome, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={`• ${outcome}`} />
                          </ListItem>
                        ))}
                      </List>
                    </>
                  )}
                  {meeting.notes && (
                    <>
                      <Typography variant="subtitle2" gutterBottom>
                        Notes
                      </Typography>
                      <Typography variant="body2">
                        {meeting.notes}
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </Paper>
        )}

        {/* Stakeholders Section */}
        {milestone.stakeholders.length > 0 && (
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Stakeholders
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {milestone.stakeholders.map((stakeholder, index) => (
                <Chip key={index} label={stakeholder} />
              ))}
            </Box>
          </Paper>
        )}
      </Box>
    </Box>
  );
};
