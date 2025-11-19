/**
 * Project List View Component
 *
 * Displays projects in a vertical list layout with detailed information.
 */

import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Chip,
  Typography,
  Avatar,
  Divider,
} from '@mui/material';
import {
  FolderOpen as ProjectIcon,
  Timeline as TimelineIcon,
  CheckCircle as CheckIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { Project } from '../../types';

interface ProjectListViewProps {
  projects: Project[];
  onProjectSelect: (project: Project) => void;
}

export default function ProjectListView({ projects, onProjectSelect }: ProjectListViewProps) {
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
    };
  };

  return (
    <List sx={{ bgcolor: 'background.paper' }}>
      {projects.map((project, index) => {
        const stats = getProjectStats(project);
        
        return (
          <Box key={project.id}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => onProjectSelect(project)}
                sx={{
                  py: 2,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                {/* Icon */}
                <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                  <ProjectIcon />
                </Avatar>

                {/* Content */}
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                      <Typography variant="h6" component="span">
                        {project.name}
                      </Typography>
                      <Chip
                        label={project.status}
                        size="small"
                        color={getStatusColor(project.status)}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      {/* Description */}
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        {project.description}
                      </Typography>

                      {/* Stats and Info */}
                      <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
                        {/* Stats */}
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <TimelineIcon fontSize="small" />
                          <Typography variant="caption">
                            {stats.phaseCount} phases
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <CheckIcon fontSize="small" />
                          <Typography variant="caption">
                            {stats.milestoneCount} milestones
                          </Typography>
                        </Box>

                        {/* Stakeholders */}
                        {project.metadata.stakeholders.length > 0 && (
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <PersonIcon fontSize="small" />
                            <Typography variant="caption">
                              {project.metadata.stakeholders.length} stakeholder
                              {project.metadata.stakeholders.length !== 1 ? 's' : ''}
                            </Typography>
                          </Box>
                        )}

                        {/* Updated date */}
                        <Typography variant="caption" color="text.secondary">
                          Updated {formatDate(project.updatedAt)}
                        </Typography>
                      </Box>

                      {/* Tags */}
                      {project.metadata.tags.length > 0 && (
                        <Box display="flex" gap={0.5} flexWrap="wrap" mt={1}>
                          {project.metadata.tags.map((tag) => (
                            <Chip key={tag} label={tag} size="small" variant="outlined" />
                          ))}
                        </Box>
                      )}
                    </Box>
                  }
                />
              </ListItemButton>
            </ListItem>
            {index < projects.length - 1 && <Divider />}
          </Box>
        );
      })}
    </List>
  );
}
