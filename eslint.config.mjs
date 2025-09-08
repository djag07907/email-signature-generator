import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Enforce proper escaping of quotes and apostrophes in JSX
      "react/no-unescaped-entities": "error",
      
      // Prevent unused variables (already enabled, but being explicit)
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_"
        }
      ],
      
      // Additional React/JSX rules for better code quality
      "react/jsx-no-duplicate-props": "error",
      "react/jsx-uses-react": "off", // Not needed with React 17+ JSX transform
      "react/react-in-jsx-scope": "off", // Not needed with React 17+ JSX transform
      
      // TypeScript specific rules
      "@typescript-eslint/no-explicit-any": "warn", // Warn instead of error for flexibility
      
      // General code quality rules
      "no-console": ["warn", { "allow": ["warn", "error"] }],
      "prefer-const": "error",
      "no-var": "error",
      "eqeqeq": ["error", "always"],
      
      // Next.js specific optimizations
      "@next/next/no-img-element": "warn", // Warn instead of error for flexibility
    }
  }
];

export default eslintConfig;
