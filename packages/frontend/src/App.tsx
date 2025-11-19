import { Routes, Route } from 'react-router-dom';
import { Box, Container, Typography } from '@mui/material';

function App() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Product Timeline Web Application
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Transform project documentation into interactive case studies
        </Typography>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Box>
    </Container>
  );
}

function HomePage() {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Welcome to Product Timeline
      </Typography>
      <Typography variant="body1">
        The application is ready for development. Start building features!
      </Typography>
    </Box>
  );
}

export default App;
