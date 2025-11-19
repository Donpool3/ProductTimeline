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

    expect(screen.getByText(/Product Timeline Web Application/i)).toBeInTheDocument();
    expect(screen.getByText(/Transform project documentation/i)).toBeInTheDocument();
  });
});
