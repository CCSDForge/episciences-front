declare module '@citation-js/core';

interface MathJaxHub {
  Queue: (commands: [string, MathJaxHub]) => void;
}

interface MathJax {
  Hub: MathJaxHub;
}

interface Window {
  MathJax?: MathJax;
}
