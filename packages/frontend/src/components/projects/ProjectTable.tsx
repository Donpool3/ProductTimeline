/**
 * Project Table View Component
 *
 * Displays projects in a sortable table format.
 */

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Chip,
  Box,
  Typography,
} from '@mui/material';
import { Project } from '../../types';

interface ProjectTableProps {
  projects: Project[];
  onProjectSelect: (project: Project) => void;
}

type SortField = 'name' | 'status' | 'updatedAt' | 'createdAt';
type SortOrder = 'asc' | 'desc';

export default function ProjectTable({ projects, onProjectSelect }: ProjectTableProps) {
  const [sortField, setSortField] = useState<SortField>('updatedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

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
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  /**
   * Handle sort
   */
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  /**
   * Sort projects
   */
  const sortedProjects = [...projects].sort((a, b) => {
    let comparison = 0;

    switch (sortField) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      case 'updatedAt':
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={sortField === 'name'}
                direction={sortField === 'name' ? sortOrder : 'asc'}
                onClick={() => handleSort('name')}
              >
                Project Name
              </TableSortLabel>
            </TableCell>
            <TableCell>Description</TableCell>
            <TableCell>
              <TableSortLabel
                active={sortField === 'status'}
                direction={sortField === 'status' ? sortOrder : 'asc'}
                onClick={() => handleSort('status')}
              >
                Status
              </TableSortLabel>
            </TableCell>
            <TableCell align="center">Phases</TableCell>
            <TableCell align="center">Milestones</TableCell>
            <TableCell>Stakeholders</TableCell>
            <TableCell>
              <TableSortLabel
                active={sortField === 'updatedAt'}
                direction={sortField === 'updatedAt' ? sortOrder : 'asc'}
                onClick={() => handleSort('updatedAt')}
              >
                Last Updated
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedProjects.map((project) => {
            const stats = getProjectStats(project);
            
            return (
              <TableRow
                key={project.id}
                hover
                onClick={() => onProjectSelect(project)}
                sx={{ cursor: 'pointer' }}
              >
                {/* Project Name */}
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {project.name}
                  </Typography>
                  {project.metadata.tags.length > 0 && (
                    <Box display="flex" gap={0.5} mt={0.5} flexWrap="wrap">
                      {project.metadata.tags.slice(0, 2).map((tag) => (
                        <Chip key={tag} label={tag} size="small" variant="outlined" />
                      ))}
                      {project.metadata.tags.length > 2 && (
                        <Chip
                          label={`+${project.metadata.tags.length - 2}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  )}
                </TableCell>

                {/* Description */}
                <TableCell>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      maxWidth: 300,
                    }}
                  >
                    {project.description}
                  </Typography>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Chip
                    label={project.status}
                    size="small"
                    color={getStatusColor(project.status)}
                  />
                </TableCell>

                {/* Phase Count */}
                <TableCell align="center">
                  <Typography variant="body2">{stats.phaseCount}</Typography>
                </TableCell>

                {/* Milestone Count */}
                <TableCell align="center">
                  <Typography variant="body2">{stats.milestoneCount}</Typography>
                </TableCell>

                {/* Stakeholders */}
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {project.metadata.stakeholders.length} stakeholder
                    {project.metadata.stakeholders.length !== 1 ? 's' : ''}
                  </Typography>
                </TableCell>

                {/* Last Updated */}
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(project.updatedAt)}
                  </Typography>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
