import { Routes, Route } from 'react-router-dom';
import { Box, Typography, Paper } from '@mui/material';
import { MainLayout } from './components/layout';
import { ProjectList } from './components/projects';
import { TimelineContainer } from './components/timeline/TimelineContainer';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="timeline/:projectId" element={<TimelinePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="metrics" element={<MetricsPage />} />
        <Route path="export" element={<ExportPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

function HomePage() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to Product Timeline
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Transform project documentation into interactive case studies
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Getting Started
        </Typography>
        <Typography variant="body2" paragraph>
          The application is ready for development. Use the sidebar to navigate between different
          sections.
        </Typography>
        <Typography variant="body2">
          <strong>Status:</strong> Application initialized and ready for feature development
        </Typography>
      </Paper>
    </Box>
  );
}

function ProjectsPage() {
  return <ProjectList />;
}

function TimelinePage() {
  return <TimelineContainer />;
}

function SearchPage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Search
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Search functionality will be implemented in Phase 7
      </Typography>
    </Box>
  );
}

function MetricsPage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Metrics
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Metrics dashboard will be implemented in Phase 6
      </Typography>
    </Box>
  );
}

function ExportPage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Export
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Export functionality will be implemented in Phase 8
      </Typography>
    </Box>
  );
}

function SettingsPage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Settings page coming soon
      </Typography>
    </Box>
  );
}

export default App;
