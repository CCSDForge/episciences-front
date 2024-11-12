const applyThemeVariables = (): void => {
  const root = document.documentElement;
  root.style.setProperty('--primary', import.meta.env.VITE_JOURNAL_PRIMARY_COLOR);
  root.style.setProperty('--primary-text', import.meta.env.VITE_JOURNAL_PRIMARY_TEXT_COLOR);
};

applyThemeVariables();
