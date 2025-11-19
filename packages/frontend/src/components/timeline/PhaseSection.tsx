/**
 * Phase Section Component
 *
 * Displays a single phase in the timeline with collapsible milestones.
 * Shows phase information, milestone count, and expandable milestone list.
 *
 * Requirements:
 * - 2.2: Show phase names, date ranges, and milestone counts
 * - 2.3: Expand to show milestones with dates and descriptions
 */

import React from 'react';
import { Box, Typography, Chip, IconButton, Collapse, Tooltip } from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { Phase, Milestone } from '../../types';
import { MilestoneMarker } from './MilestoneMarker';
import { formatDateRange } from '../../utils/dateUtils';

export interface PhaseSectionProps {
  phase: Phase;
  milestones: Milestone[];
  expanded: boolean;
  onToggle: () => void;
  onPhaseClick?: (phase: Phase) => void;
  onMilestoneClick?: (milestone: Milestone) => void;
  dateRange: { start: Date; end: Date };
}

/**
 * Phase Section Component
 *
 * Renders a phase with its milestones in a collapsible section.
 */
export const PhaseSection: React.FC<PhaseSectionProps> = ({
  phase,
  milestones,
  expanded,
  onToggle,
  onPhaseClick,
  onMilestoneClick,
  dateRange,
}) => {
  const handlePhaseClick = () => {
    if (onPhaseClick) {
      onPhaseClick(phase);
    }
  };

  // Calculate phase position and width based on date range
  const totalDuration = dateRange.end.getTime() - dateRange.start.getTime();
  const phaseStart = new Date(phase.startDate).getTime();
  const phaseEnd = phase.endDate ? new Date(phase.endDate).getTime() : Date.now();

  const leftPercent = ((phaseStart - dateRange.start.getTime()) / totalDuration) * 100;
  const widthPercent = ((phaseEnd - phaseStart) / totalDuration) * 100;

  return (
    <Box sx={{ mb: 2 }}>
      {/* Phase Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 2,
          bgcolor: phase.color || '#e0e0e0',
          borderRadius: 1,
          cursor: 'pointer',
          '&:hover': {
            opacity: 0.9,
          },
          position: 'relative',
        }}
        onClick={handlePhaseClick}
      >
        {/* Phase Color Bar */}
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
            bgcolor: phase.color || '#757575',
          }}
        />

        {/* Expand/Collapse Button */}
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          sx={{ mr: 1 }}
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>

        {/* Phase Info */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography variant="h6" component="h3">
              {phase.name}
            </Typography>
            <Chip
              label={`${milestones.length} milestone${milestones.length !== 1 ? 's' : ''}`}
              size="small"
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.3)' }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title="Phase duration">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <EventIcon fontSize="small" />
                <Typography variant="body2">
                  {formatDateRange(new Date(phase.startDate), phase.endDate ? new Date(phase.endDate) : undefined)}
                </Typography>
              </Box>
            </Tooltip>

            {phase.description && (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                {phase.description}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Phase Timeline Bar */}
        <Box
          sx={{
            position: 'absolute',
            bottom: -8,
            left: `${leftPercent}%`,
            width: `${widthPercent}%`,
            height: 4,
            bgcolor: phase.color || '#757575',
            borderRadius: 2,
            opacity: 0.6,
          }}
        />
      </Box>

      {/* Milestones List (Collapsible) */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ pl: 6, pr: 2, pt: 2, pb: 1 }}>
          {milestones.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              No milestones in this phase
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {milestones
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((milestone) => (
                  <MilestoneMarker
                    key={milestone.id}
                    milestone={milestone}
                    onClick={onMilestoneClick}
                    phaseColor={phase.color}
                  />
                ))}
            </Box>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};
