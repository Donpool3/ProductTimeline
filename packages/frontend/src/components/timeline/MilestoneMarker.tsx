/**
 * Milestone Marker Component
 *
 * Displays a single milestone with status indicators, tooltips, and click handling.
 *
 * Requirements:
 * - 2.3: Show milestones with dates and descriptions
 * - 2.6: Display tooltips with summary information on hover
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  Tooltip,
  Paper,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  AutoAwesome as AutoIcon,
  Edit as ManualIcon,
  Description as ArtifactIcon,
  Assessment as MetricIcon,
  Gavel as DecisionIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { Milestone } from '../../types';
import { formatDate, formatDateTime } from '../../utils/dateUtils';

export interface MilestoneMarkerProps {
  milestone: Milestone;
  onClick?: (milestone: Milestone) => void;
  phaseColor?: string;
}

/**
 * Milestone Marker Component
 *
 * Renders a milestone with status indicators and hover tooltips.
 */
export const MilestoneMarker: React.FC<MilestoneMarkerProps> = ({
  milestone,
  onClick,
  phaseColor,
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick(milestone);
    }
  };

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  // Determine milestone icon based on type
  const MilestoneIcon = milestone.type === 'auto' ? AutoIcon : ManualIcon;
  const milestoneTypeLabel = milestone.type === 'auto' ? 'Auto-generated' : 'Manual';

  // Build tooltip content
  const tooltipContent = (
    <Box sx={{ p: 1 }}>
      <Typography variant="subtitle2" gutterBottom>
        {milestone.title}
      </Typography>
      <Typography variant="caption" display="block" gutterBottom>
        {formatDateTime(new Date(milestone.date))}
      </Typography>
      {milestone.description && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          {milestone.description}
        </Typography>
      )}
      <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
        {milestone.artifacts.length > 0 && (
          <Chip
            icon={<ArtifactIcon />}
            label={`${milestone.artifacts.length} artifact${milestone.artifacts.length !== 1 ? 's' : ''}`}
            size="small"
          />
        )}
        {milestone.metrics.length > 0 && (
          <Chip
            icon={<MetricIcon />}
            label={`${milestone.metrics.length} metric${milestone.metrics.length !== 1 ? 's' : ''}`}
            size="small"
          />
        )}
        {milestone.decisions.length > 0 && (
          <Chip
            icon={<DecisionIcon />}
            label={`${milestone.decisions.length} decision${milestone.decisions.length !== 1 ? 's' : ''}`}
            size="small"
          />
        )}
      </Box>
    </Box>
  );

  return (
    <Paper
      elevation={1}
      sx={{
        p: 1.5,
        cursor: 'pointer',
        transition: 'all 0.2s',
        borderLeft: 3,
        borderColor: phaseColor || 'primary.main',
        '&:hover': {
          elevation: 3,
          transform: 'translateX(4px)',
          bgcolor: 'action.hover',
        },
      }}
      onClick={handleClick}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        {/* Milestone Icon */}
        <Tooltip title={milestoneTypeLabel}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: '50%',
              bgcolor: milestone.type === 'auto' ? 'info.light' : 'secondary.light',
              color: 'white',
            }}
          >
            <MilestoneIcon fontSize="small" />
          </Box>
        </Tooltip>

        {/* Milestone Content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Title and Date */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Tooltip title={tooltipContent} arrow placement="top">
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {milestone.title}
              </Typography>
            </Tooltip>
            <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
              {formatDate(new Date(milestone.date))}
            </Typography>
          </Box>

          {/* Description (if not expanded) */}
          {!expanded && milestone.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontSize: '0.875rem',
              }}
            >
              {milestone.description}
            </Typography>
          )}

          {/* Status Indicators */}
          <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
            {milestone.artifacts.length > 0 && (
              <Chip
                icon={<ArtifactIcon />}
                label={milestone.artifacts.length}
                size="small"
                variant="outlined"
              />
            )}
            {milestone.metrics.length > 0 && (
              <Chip
                icon={<MetricIcon />}
                label={milestone.metrics.length}
                size="small"
                variant="outlined"
              />
            )}
            {milestone.decisions.length > 0 && (
              <Chip
                icon={<DecisionIcon />}
                label={milestone.decisions.length}
                size="small"
                variant="outlined"
                color="warning"
              />
            )}
            {milestone.source && (
              <Chip
                label={milestone.source.split('/').pop()}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem' }}
              />
            )}
          </Box>
        </Box>

        {/* Expand Button */}
        {(milestone.description || milestone.narrative) && (
          <IconButton size="small" onClick={handleExpandClick}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        )}
      </Box>

      {/* Expanded Content */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ mt: 2, pl: 5 }}>
          {milestone.description && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {milestone.description}
              </Typography>
            </Box>
          )}

          {milestone.narrative && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Narrative:
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {milestone.narrative}
              </Typography>
            </Box>
          )}

          {milestone.stakeholders.length > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Stakeholders:
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                {milestone.stakeholders.map((stakeholder, index) => (
                  <Chip key={index} label={stakeholder} size="small" />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};
