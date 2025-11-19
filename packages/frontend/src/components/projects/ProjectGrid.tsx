/**
 * Project Grid View Component
 *
 * Displays projects in a responsive grid layout with cards.
 */

import { Grid, Card, CardContent, CardActionArea, Typography, Box, Chip, CardActions, Button } from '@mui/material';
import {
  FolderOpen as ProjectIcon,
  CalendarToday as CalendarIcon,
  Timeline as TimelineIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Project } from '../../types';

interface ProjectGridProps {
  projects: Project[];
  onProjectSelect: (project: Project) => void;
}

export default function ProjectGrid({ projects, onProjectSelect }: ProjectGridProps) {
  const navigate = useNavigate();

  /**
   * Get status color
   */
  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'completed':
        return 'info';
      case 'archived':
        return 'default';
      default:
        return 'default';
    }
  };

  /**
   * Format date
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  /**
   * Calculate project summary stats
   */
  const getProjectStats = (_project: Project) => {
    // In a real implementation, these would come from the API
    // For now, we'll use placeholder values
    return {
      phaseCount: 4,
      milestoneCount: 12,
      completionRate: 75,
    };
  };

  return (
    <Grid container spacing={3}>
      {projects.map((project) => {
        const stats = getProjectStats(project);
        
        return (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardActionArea
                onClick={() => onProjectSelect(project)}
                sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
              >
                <CardContent sx={{ flexGrow: 1, width: '100%' }}>
                  {/* Header */}
                  <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <ProjectIcon color="primary" />
                      <Chip
                        label={project.status}
                        size="small"
                        color={getStatusColor(project.status)}
                      />
                    </Box>
                  </Box>

                  {/* Project Name */}
                  <Typography variant="h6" component="h3" gutterBottom noWrap>
                    {project.name}
                  </Typography>

                  {/* Description */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      minHeight: '2.5em',
                    }}
                  >
                    {project.description}
                  </Typography>

                  {/* Stats */}
                  <Box display="flex" gap={2} mb={2}>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <TimelineIcon fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        {stats.phaseCount} phases
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <CheckIcon fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        {stats.milestoneCount} milestones
                      </Typography>
                    </Box>
                  </Box>

                  {/* Tags */}
                  {project.metadata.tags.length > 0 && (
                    <Box display="flex" gap={0.5} flexWrap="wrap" mb={2}>
                      {project.metadata.tags.slice(0, 3).map((tag) => (
                        <Chip key={tag} label={tag} size="small" variant="outlined" />
                      ))}
                      {project.metadata.tags.length > 3 && (
                        <Chip
                          label={`+${project.metadata.tags.length - 3}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  )}

                  {/* Footer */}
                  <Box display="flex" alignItems="center" gap={0.5} mt="auto">
                    <CalendarIcon fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary">
                      Updated {formatDate(project.updatedAt)}
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
              
              {/* Card Actions */}
              <CardActions sx={{ px: 2, pb: 2 }}>
                <Button
                  size="small"
                  startIcon={<TimelineIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/timeline/${project.id}`);
                  }}
                  fullWidth
                  variant="outlined"
                >
                  View Timeline
                </Button>
              </CardActions>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
