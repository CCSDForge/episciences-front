import { MathJax2Config } from "better-react-mathjax";

export const mathJaxConfig: MathJax2Config = {
  tex2jax: {
    inlineMath: [['$','$'], ['$$','$$']]
  }
}

export const mathJaxSrc = `${import.meta.env.VITE_MATHJAX_HOMEPAGE}/2.7.7/MathJax.js?config=TeX-AMS-MML_HTMLorMML`