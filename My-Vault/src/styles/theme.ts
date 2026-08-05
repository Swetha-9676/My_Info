export const theme = {
  colors: {
    background: '#0B0C14',
    surface: '#1A1B2E',
    surfaceSecondary: '#25273C',
    primary: '#00F5FF',
    secondary: '#7000FF',
    text: '#FFFFFF',
    textSecondary: '#A0A0B8',
    accent: '#FF007A',
    success: '#00FF94',
    warning: '#FFB800',
    error: '#FF4B4B',
    glass: 'rgba(255, 255, 255, 0.05)',
    border: 'rgba(255, 255, 255, 0.1)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 20,
    xl: 30,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700' as const,
      color: '#FFFFFF',
    },
    h2: {
      fontSize: 24,
      fontWeight: '600' as const,
      color: '#FFFFFF',
    },
    body: {
      fontSize: 16,
      color: '#FFFFFF',
    },
    caption: {
      fontSize: 12,
      color: '#A0A0B8',
    },
  },
};
