import { Container, CssBaseline, ThemeProvider, createTheme, Typography, Paper, Grid, Box, Link } from '@mui/material';
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
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {/* Left Column - Welcome & How It Works */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
              <Typography variant="h5" gutterBottom>
                Welcome to Social Media Content Assistant!
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Transform your creative ideas into polished social media content with the help of AI.
              </Typography>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                How It Works
              </Typography>
              
              {['Draft Your Ideas', 'AI-Powered Generation', 'Refine Through Conversation', 'Platform-Ready Posts'].map((step, index) => (
                <Box key={step} sx={{ mb: 2, p: 1, borderLeft: '3px solid #1976d2' }}>
                  <Typography variant="subtitle2" color="primary">
                    {`${index + 1}. ${step}`}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                    {getStepDescription(index)}
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Grid>

          {/* Right Column - Main Content */}
          <Grid item xs={12} md={8}>
            <PostEditor />
          </Grid>

          {/* Platform Variations - Full Width */}
          <Grid item xs={12}>
            <PlatformVariations />
          </Grid>

          {/* Bottom Support Section */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
              <Typography variant="subtitle1">
                Support This Project
              </Typography>
              <Typography variant="body2">
                If you find this tool valuable, consider supporting its development through{' '}
                <Link href="https://paypal.me/mondweep" target="_blank" rel="noopener noreferrer">
                  PayPal
                </Link>
                .
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

// Helper function for step descriptions
function getStepDescription(index: number): string {
  const descriptions = [
    'Start with any topic that inspires you - write a poem about deer, ask to paint a picture with words of an African sunset, or share your thoughts on any subject.',
    'Our AI assistant will help transform your draft into engaging content, maintaining your voice while enhancing the presentation.',
    'Chat with our AI to fine-tune the content until it perfectly matches your vision. Ask for adjustments, try different tones, or explore new angles.',
    'Select your target social media platforms, and we\'ll automatically adapt your content to fit each platform\'s requirements.'
  ];
  return descriptions[index];
}

export default App;
