import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
{
    rules: {
      // O projeto usa `any` nos resultados de queries do MySQL - aceito
      "@typescript-eslint/no-explicit-any": "off",
      // Regra estrita de effect (fetch em useEffect) - aceito neste projeto
      "react-hooks/set-state-in-effect": "off",
      // Variáveis de catch não utilizadas (ex: catch (e) { console.error(...) })
      "@typescript-eslint/no-unused-vars": "off",
      // Imagens via <img> externas (fotos enviadas por URL) - aceito
      "@next/next/no-img-element": "off",
    },
  },
  {
    // Scripts utilitários standalone (executados com `node scripts/...`).
    // Usam require() de propósito, pois rodam fora do contexto Next.js/ESM.
    files: ["scripts/**/*.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
