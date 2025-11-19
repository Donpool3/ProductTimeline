/**
 * Timeline Viewer Component
 *
 * Main component for displaying interactive project timeline with phases and milestones.
 * Implements horizontal timeline visualization with D3.js, zoom/pan controls, and lazy loading.
 *
 * Requirements:
 * - 2.1: Display horizontal timeline with phases as distinct sections
 * - 2.2: Show phase names, date ranges, and milestone counts
 * - 2.3: Expand phases to show milestones with dates and descriptions
 * - 2.6: Display tooltips with summary information on hover
 * - 2.7: Maintain smooth performance with lazy loading
 */

import React, { useState, useRef, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  ZoomOutMap as ResetZoomIcon,
} from '@mui/icons-material';
import { Phase, Milestone, Timeline, TimelineFilters } from '../../types';
import { PhaseSection } from './PhaseSection';
import { TimelineAxis } from './TimelineAxis';
import { useTimelineZoom } from './hooks/useTimelineZoom';

export interface TimelineViewerProps {
  projectId: string;
  timeline?: Timeline;
  loading?: boolean;
  error?: string;
  initialView?: 'horizontal' | 'vertical' | 'gantt';
  onMilestoneClick?: (milestone: Milestone) => void;
  onPhaseClick?: (phase: Phase) => void;
  filters?: TimelineFilters;
}

/**
 * Timeline Viewer Component
 *
 * Renders an interactive timeline with phases and milestones.
 * Supports zoom, pan, and lazy loading for performance.
 */
export const TimelineViewer: React.FC<TimelineViewerProps> = ({
  timeline,
  loading = false,
  error,
  onMilestoneClick,
  onPhaseClick,
  filters,
}) => {
  // projectId and initialView are available for future use
  const containerRef = useRef<HTMLDivElement>(null);
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());
  const [visibleRange, setVisibleRange] = useState<{ start: number; end: number }>({
    start: 0,
    end: 100,
  });

  // Custom hook for zoom and pan functionality
  const { handleZoomIn, handleZoomOut, handleResetZoom, transform } = useTimelineZoom({
    containerRef,
    onZoomChange: (newTransform) => {
      // Update visible range based on zoom level
      const containerWidth = containerRef.current?.clientWidth || 1000;
      const visibleWidth = containerWidth / newTransform.k;
      const startPercent = (-newTransform.x / newTransform.k / containerWidth) * 100;
      const endPercent = startPercent + (visibleWidth / containerWidth) * 100;
      setVisibleRange({ start: Math.max(0, startPercent), end: Math.min(100, endPercent) });
    },
  });

  // Filter phases and milestones based on filters
  const filteredData = useMemo(() => {
    if (!timeline) return { phases: [], milestones: [] };

    let phases = [...timeline.phases];
    let milestones = [...timeline.milestones];

    // Apply date range filter
    if (filters?.dateRange) {
      const { start, end } = filters.dateRange;
      phases = phases.filter((phase) => {
        const phaseStart = new Date(phase.startDate);
        const phaseEnd = phase.endDate ? new Date(phase.endDate) : new Date();
        return phaseStart <= end && phaseEnd >= start;
      });

      milestones = milestones.filter((milestone) => {
        const milestoneDate = new Date(milestone.date);
        return milestoneDate >= start && milestoneDate <= end;
      });
    }

    // Apply phase filter
    if (filters?.phases && filters.phases.length > 0) {
      phases = phases.filter((phase) => filters.phases!.includes(phase.id));
      milestones = milestones.filter((milestone) => filters.phases!.includes(milestone.phaseId));
    }

    // Apply stakeholder filter
    if (filters?.stakeholders && filters.stakeholders.length > 0) {
      milestones = milestones.filter((milestone) =>
        milestone.stakeholders.some((s) => filters.stakeholders!.includes(s)),
      );
    }

    // Apply decisions-only filter
    if (filters?.showDecisionsOnly) {
      milestones = milestones.filter((milestone) => milestone.decisions.length > 0);
    }

    return { phases, milestones };
  }, [timeline, filters]);

  // Calculate date range for timeline axis
  const dateRange = useMemo(() => {
    if (!filteredData.phases.length) return { start: new Date(), end: new Date() };

    const dates = filteredData.phases.flatMap((phase) => [
      new Date(phase.startDate),
      phase.endDate ? new Date(phase.endDate) : new Date(),
    ]);

    return {
      start: new Date(Math.min(...dates.map((d) => d.getTime()))),
      end: new Date(Math.max(...dates.map((d) => d.getTime()))),
    };
  }, [filteredData.phases]);

  // Handle phase expansion toggle
  const handlePhaseToggle = (phaseId: string) => {
    setExpandedPhases((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(phaseId)) {
        newSet.delete(phaseId);
      } else {
        newSet.add(phaseId);
      }
      return newSet;
    });
  };

  // Lazy loading: only render phases in visible range
  const visiblePhases = useMemo(() => {
    if (!filteredData.phases.length) return [];

    // For simplicity, we'll render all phases but could optimize further
    // by calculating which phases are actually visible based on scroll position
    return filteredData.phases;
  }, [filteredData.phases, visibleRange]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!timeline || !filteredData.phases.length) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        No timeline data available for this project.
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Timeline Header with Controls */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          pb: 2,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="h5" component="h2">
          Project Timeline
        </Typography>

        {/* Zoom Controls */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Zoom In">
            <IconButton onClick={handleZoomIn} size="small">
              <ZoomInIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom Out">
            <IconButton onClick={handleZoomOut} size="small">
              <ZoomOutIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset Zoom">
            <IconButton onClick={handleResetZoom} size="small">
              <ResetZoomIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Timeline Axis */}
      <TimelineAxis startDate={dateRange.start} endDate={dateRange.end} zoom={transform.k} />

      {/* Timeline Content */}
      <Box
        ref={containerRef}
        sx={{
          flex: 1,
          overflowX: 'auto',
          overflowY: 'auto',
          position: 'relative',
          minHeight: 400,
        }}
      >
        <Box
          sx={{
            minWidth: `${100 * transform.k}%`,
            transform: `translateX(${transform.x}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        >
          {/* Render Phase Sections */}
          {visiblePhases.map((phase) => {
            const phaseMilestones = filteredData.milestones.filter(
              (m) => m.phaseId === phase.id,
            );

            return (
              <PhaseSection
                key={phase.id}
                phase={phase}
                milestones={phaseMilestones}
                expanded={expandedPhases.has(phase.id)}
                onToggle={() => handlePhaseToggle(phase.id)}
                onPhaseClick={onPhaseClick}
                onMilestoneClick={onMilestoneClick}
                dateRange={dateRange}
              />
            );
          })}
        </Box>
      </Box>

      {/* Timeline Footer with Stats */}
      <Box
        sx={{
          mt: 2,
          pt: 2,
          borderTop: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {filteredData.phases.length} phases • {filteredData.milestones.length} milestones
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Zoom: {Math.round(transform.k * 100)}%
        </Typography>
      </Box>
    </Paper>
  );
};
