/**
 * Timeline Axis Component
 *
 * Displays a horizontal time axis with date markers.
 * Adapts to zoom level to show appropriate date granularity.
 */

import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { formatDate } from '../../utils/dateUtils';

export interface TimelineAxisProps {
  startDate: Date;
  endDate: Date;
  zoom?: number;
}

/**
 * Timeline Axis Component
 *
 * Renders a horizontal axis with date markers.
 */
export const TimelineAxis: React.FC<TimelineAxisProps> = ({
  startDate,
  endDate,
  zoom = 1,
}) => {
  // Calculate appropriate number of ticks based on zoom level
  const ticks = useMemo(() => {
    const duration = endDate.getTime() - startDate.getTime();

    // Determine tick interval based on duration and zoom
    let tickCount = 5;
    if (zoom > 2) {
      tickCount = 10;
    } else if (zoom > 1.5) {
      tickCount = 7;
    }

    const tickInterval = duration / tickCount;
    const tickDates: Date[] = [];

    for (let i = 0; i <= tickCount; i++) {
      const tickTime = startDate.getTime() + i * tickInterval;
      tickDates.push(new Date(tickTime));
    }

    return tickDates;
  }, [startDate, endDate, zoom]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2,
        pb: 1,
        borderBottom: 2,
        borderColor: 'divider',
        position: 'relative',
      }}
    >
      {ticks.map((tick, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          {/* Tick Mark */}
          <Box
            sx={{
              width: 2,
              height: 8,
              bgcolor: 'text.secondary',
              mb: 0.5,
            }}
          />

          {/* Date Label */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontSize: '0.7rem',
              whiteSpace: 'nowrap',
            }}
          >
            {formatDate(tick)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};
