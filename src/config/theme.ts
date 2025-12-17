import { generateAccessibleColorVariables } from '../utils/colorContrast';

const applyThemeVariables = (): void => {
  const root = document.documentElement;
  // Get colors from environment variables
  const primaryColor = import.meta.env.VITE_JOURNAL_PRIMARY_COLOR;
  const primaryTextColor = import.meta.env.VITE_JOURNAL_PRIMARY_TEXT_COLOR;

  // Set original primary colors
  root.style.setProperty('--primary', primaryColor);
  root.style.setProperty('--primary-text', primaryTextColor);

  // Generate accessible color variables
  const result = generateAccessibleColorVariables(primaryColor, '#FFFFFF', 4.5);
  // Set accessible color variable
  root.style.setProperty('--primary-accessible', result.accessibleColor);

  // Optional: Log accessibility info in development mode
  if (import.meta.env.DEV) {
    console.log('🎨 Theme Accessibility Report:', {
      original: primaryColor,
      accessible: result.accessibleColor,
      contrast: result.contrastRatio.toFixed(2) + ':1',
      WCAG_AA: result.contrastRatio >= 4.5 ? '✅' : '❌',
      WCAG_AAA: result.contrastRatio >= 7.0 ? '✅' : '❌',
    });
  }
};

applyThemeVariables();
