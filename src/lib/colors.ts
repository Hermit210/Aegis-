// Premium warm dark color palette
// Inspired by luxury developer tooling (Vercel, Linear, Stripe, Raycast)

export const colors = {
  // Base/Background
  background: '#0F0E0D',
  surface: '#171412',
  card: '#211D1A',
  
  // Accents - Bronze & Warm Browns
  primary: '#8B5E3C',        // Rich bronze
  secondary: '#A67C52',      // Warm brown
  highlight: '#D8B98A',      // Muted gold
  
  // Text
  text: {
    primary: '#F5F2ED',      // Off-white
    secondary: '#B8B4AD',    // Muted gray
    tertiary: '#8B8680',     // Darker gray
  },
  
  // Semantic
  success: '#7CB342',        // Muted green
  warning: '#F57C00',        // Warm orange
  error: '#C62828',          // Muted red
  info: '#5E6FA3',           // Muted blue
  
  // Borders & Dividers
  border: '#2A2522',
  divider: '#1F1A17',
  
  // Glassmorphism
  glass: 'rgba(23, 20, 18, 0.4)',
  
  // Gradients
  gradients: {
    bronze: 'linear-gradient(135deg, #8B5E3C 0%, #A67C52 100%)',
    warmDark: 'linear-gradient(135deg, #0F0E0D 0%, #1A1815 100%)',
  }
} as const;
