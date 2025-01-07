import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { PostEditor } from './components/PostEditor/PostEditor';
import { PlatformVariations } from './components/PlatformVariations/PlatformVariations';

// Create a theme instance
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Provides consistent baseline styles */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <PostEditor />
        <PlatformVariations />
      </Container>
    </ThemeProvider>
  );
}

export default App;
