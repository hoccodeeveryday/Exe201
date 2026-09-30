module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    "react-app"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: {
      version: "detect"
    }
  },
  rules: {
    "@typescript-eslint/no-explicit-any": "error",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }]
  },
  ignorePatterns: [
    "dist",
    "node_modules",
    "coverage",
    "*.config.cjs",
    "*.config.ts",
    "vitest.config.ts"
  ]
}