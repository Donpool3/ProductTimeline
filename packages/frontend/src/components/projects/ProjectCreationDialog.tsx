/**
 * Project Creation Dialog Component
 *
 * Wizard-style dialog for creating new projects.
 */

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Chip,
  IconButton,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import { Project } from '../../types';

interface ProjectCreationDialogProps {
  open: boolean;
  onClose: () => void;
  onProjectCreated: (project: Project) => void;
}

const steps = ['Basic Information', 'Documentation Path', 'Metadata'];

export default function ProjectCreationDialog({
  open,
  onClose,
  onProjectCreated,
}: ProjectCreationDialogProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [documentationPath, setDocumentationPath] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  /**
   * Reset form
   */
  const resetForm = () => {
    setActiveStep(0);
    setName('');
    setDescription('');
    setDocumentationPath('');
    setTags([]);
    setTagInput('');
    setError(null);
  };

  /**
   * Handle close
   */
  const handleClose = () => {
    resetForm();
    onClose();
  };

  /**
   * Handle next step
   */
  const handleNext = () => {
    setError(null);

    // Validate current step
    if (activeStep === 0) {
      if (!name.trim()) {
        setError('Project name is required');
        return;
      }
      if (!description.trim()) {
        setError('Project description is required');
        return;
      }
    } else if (activeStep === 1) {
      if (!documentationPath.trim()) {
        setError('Documentation path is required');
        return;
      }
    }

    setActiveStep((prev) => prev + 1);
  };

  /**
   * Handle back step
   */
  const handleBack = () => {
    setError(null);
    setActiveStep((prev) => prev - 1);
  };

  /**
   * Add tag
   */
  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  /**
   * Remove tag
   */
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  /**
   * Handle tag input key press
   */
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  /**
   * Create project
   */
  const handleCreate = () => {
    setError(null);

    // Create mock project
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      documentationPath: documentationPath.trim(),
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current.user@example.com',
      metadata: {
        tags,
        stakeholders: [],
        customFields: {},
      },
    };

    onProjectCreated(newProject);
    handleClose();
  };

  /**
   * Render step content
   */
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <TextField
              fullWidth
              label="Project Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Warehouse Physical Reception App"
              margin="normal"
              required
              autoFocus
            />
            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the project"
              margin="normal"
              required
              multiline
              rows={3}
            />
          </Box>
        );

      case 1:
        return (
          <Box>
            <TextField
              fullWidth
              label="Documentation Path"
              value={documentationPath}
              onChange={(e) => setDocumentationPath(e.target.value)}
              placeholder="/path/to/project/documentation"
              margin="normal"
              required
              helperText="Path to the project's documentation directory"
            />
            <Alert severity="info" sx={{ mt: 2 }}>
              The application will scan this directory for requirements, design documents,
              implementation logs, and other project artifacts.
            </Alert>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Add tags to help organize and search for this project
            </Typography>
            <Box display="flex" gap={1} mt={2}>
              <TextField
                fullWidth
                label="Add Tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagKeyPress}
                placeholder="e.g., mobile, warehouse, phase-1"
                size="small"
              />
              <IconButton onClick={handleAddTag} color="primary">
                <AddIcon />
              </IconButton>
            </Box>
            {tags.length > 0 && (
              <Box display="flex" gap={0.5} flexWrap="wrap" mt={2}>
                {tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Create New Project</Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Step Content */}
        {renderStepContent()}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        {activeStep > 0 && <Button onClick={handleBack}>Back</Button>}
        {activeStep < steps.length - 1 ? (
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        ) : (
          <Button variant="contained" onClick={handleCreate}>
            Create Project
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
