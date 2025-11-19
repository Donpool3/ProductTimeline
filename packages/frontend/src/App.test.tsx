import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import App from './App';
import { store } from './store';
import { theme } from './theme';

describe('App', () => {
  it('renders welcome message', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText(/Welcome to Product Timeline/i)).toBeInTheDocument();
    expect(screen.getByText(/Transform project documentation/i)).toBeInTheDocument();
  });

  it('renders header with app title', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    );

    // Check for header element specifically
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });
});
