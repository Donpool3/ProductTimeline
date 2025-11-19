/**
 * Timeline Container Component
 *
 * Container component that fetches timeline data and manages state.
 * Connects the TimelineViewer to the API/mock data.
 */

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Alert } from '@mui/material';
import { TimelineViewer } from './TimelineViewer';
import { MilestoneDetail } from './MilestoneDetail';
import { Timeline, Milestone, Phase } from '../../types';
import { apiClient } from '../../services/apiClient';

export const TimelineContainer: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  // const navigate = useNavigate(); // TODO: Use for navigation to milestone/phase details

  const [timeline, setTimeline] = useState<Timeline | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | undefined>();

  useEffect(() => {
    const fetchTimeline = async () => {
      if (!projectId) {
        setError('No project ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(undefined);

        // Fetch timeline data
        const timelineData = await apiClient.getTimeline(projectId);
        setTimeline(timelineData);
      } catch (err) {
        console.error('Error fetching timeline:', err);
        setError(err instanceof Error ? err.message : 'Failed to load timeline');
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, [projectId]);

  const handleMilestoneClick = (milestone: Milestone) => {
    console.log('Milestone clicked:', milestone);
    setSelectedMilestone(milestone);
  };

  const handlePhaseClick = (phase: Phase) => {
    console.log('Phase clicked:', phase);
    // TODO: Navigate to phase detail view or open modal
    // navigate(`/projects/${projectId}/phases/${phase.id}`);
  };

  const handleBackToTimeline = () => {
    setSelectedMilestone(undefined);
  };

  const handleNarrativeUpdate = (milestoneId: string, narrative: string) => {
    console.log('Updating narrative for milestone:', milestoneId, narrative);
    // TODO: Call API to update narrative
    // For now, update local state
    if (timeline) {
      const updatedMilestones = timeline.milestones.map((m) =>
        m.id === milestoneId ? { ...m, narrative } : m,
      );
      setTimeline({ ...timeline, milestones: updatedMilestones });
      if (selectedMilestone && selectedMilestone.id === milestoneId) {
        setSelectedMilestone({ ...selectedMilestone, narrative });
      }
    }
  };

  if (!projectId) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        No project ID provided. Please select a project.
      </Alert>
    );
  }

  // If a milestone is selected, show the detail view
  if (selectedMilestone) {
    const phase = timeline?.phases.find((p) => p.id === selectedMilestone.phaseId);
    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <MilestoneDetail
          milestone={selectedMilestone}
          phaseName={phase?.name}
          onBack={handleBackToTimeline}
          onNarrativeUpdate={handleNarrativeUpdate}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TimelineViewer
        projectId={projectId}
        timeline={timeline}
        loading={loading}
        error={error}
        onMilestoneClick={handleMilestoneClick}
        onPhaseClick={handlePhaseClick}
      />
    </Box>
  );
};
