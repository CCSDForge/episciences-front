const applyThemeVariables = (): void => {
  const root = document.documentElement;

  root.style.setProperty('--primary', import.meta.env.VITE_JOURNAL_PRIMARY_COLOR);
};

applyThemeVariables();
