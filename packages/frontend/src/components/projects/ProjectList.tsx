/**
 * Project List Component
 *
 * Displays a list of projects with multiple view modes (grid, list, table).
 * Supports search, filtering, and project creation.
 *
 * Requirements:
 * - 7.1: Display project list with multiple view modes
 * - 7.2: Implement search and filtering
 * - 7.3: Add project creation wizard UI
 */

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  ViewModule as GridIcon,
  ViewList as ListIcon,
  TableChart as TableIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { Project } from '../../types';
import { apiClient } from '../../services/apiClient';
import ProjectGrid from './ProjectGrid';
import ProjectListView from './ProjectListView';
import ProjectTable from './ProjectTable';
import ProjectCreationDialog from './ProjectCreationDialog';

type ViewMode = 'grid' | 'list' | 'table';
type StatusFilter = 'all' | 'active' | 'archived' | 'completed';

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // View and filter state
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, []);

  // Apply filters when projects, search, or status filter changes
  useEffect(() => {
    applyFilters();
  }, [projects, searchQuery, statusFilter]);

  /**
   * Load projects from API
   */
  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getProjects();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Apply search and status filters
   */
  const applyFilters = () => {
    let filtered = [...projects];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.metadata.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          p.metadata.stakeholders.some(
            (s) =>
              s.name.toLowerCase().includes(query) || s.role.toLowerCase().includes(query),
          ),
      );
    }

    setFilteredProjects(filtered);
  };

  /**
   * Handle view mode change
   */
  const handleViewModeChange = (_event: React.MouseEvent<HTMLElement>, newMode: ViewMode | null) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  /**
   * Handle project creation
   */
  const handleProjectCreated = (project: Project) => {
    setProjects([project, ...projects]);
    setCreateDialogOpen(false);
  };

  /**
   * Handle project selection
   */
  const handleProjectSelect = (project: Project) => {
    console.log('Project selected:', project);
    // TODO: Navigate to project timeline view
  };

  // Loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={loadProjects}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Projects
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
            {statusFilter !== 'all' && ` (${statusFilter})`}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          New Project
        </Button>
      </Box>

      {/* Search and Filters */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        {/* Search */}
        <TextField
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1, minWidth: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {/* View Mode Toggle */}
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          aria-label="view mode"
        >
          <ToggleButton value="grid" aria-label="grid view">
            <GridIcon />
          </ToggleButton>
          <ToggleButton value="list" aria-label="list view">
            <ListIcon />
          </ToggleButton>
          <ToggleButton value="table" aria-label="table view">
            <TableIcon />
          </ToggleButton>
        </ToggleButtonGroup>

        {/* Filter Toggle */}
        <IconButton
          onClick={() => setShowFilters(!showFilters)}
          color={showFilters ? 'primary' : 'default'}
        >
          <FilterIcon />
        </IconButton>
      </Box>

      {/* Status Filters */}
      {showFilters && (
        <Box display="flex" gap={1} mb={3} flexWrap="wrap">
          <Chip
            label="All"
            onClick={() => setStatusFilter('all')}
            color={statusFilter === 'all' ? 'primary' : 'default'}
            variant={statusFilter === 'all' ? 'filled' : 'outlined'}
          />
          <Chip
            label="Active"
            onClick={() => setStatusFilter('active')}
            color={statusFilter === 'active' ? 'primary' : 'default'}
            variant={statusFilter === 'active' ? 'filled' : 'outlined'}
          />
          <Chip
            label="Completed"
            onClick={() => setStatusFilter('completed')}
            color={statusFilter === 'completed' ? 'primary' : 'default'}
            variant={statusFilter === 'completed' ? 'filled' : 'outlined'}
          />
          <Chip
            label="Archived"
            onClick={() => setStatusFilter('archived')}
            color={statusFilter === 'archived' ? 'primary' : 'default'}
            variant={statusFilter === 'archived' ? 'filled' : 'outlined'}
          />
        </Box>
      )}

      {/* Project Views */}
      {filteredProjects.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No projects found
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first project'}
          </Typography>
          {!searchQuery && statusFilter === 'all' && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateDialogOpen(true)}
              sx={{ mt: 2 }}
            >
              Create Project
            </Button>
          )}
        </Box>
      ) : (
        <>
          {viewMode === 'grid' && (
            <ProjectGrid projects={filteredProjects} onProjectSelect={handleProjectSelect} />
          )}
          {viewMode === 'list' && (
            <ProjectListView projects={filteredProjects} onProjectSelect={handleProjectSelect} />
          )}
          {viewMode === 'table' && (
            <ProjectTable projects={filteredProjects} onProjectSelect={handleProjectSelect} />
          )}
        </>
      )}

      {/* Project Creation Dialog */}
      <ProjectCreationDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
    </Box>
  );
}
