import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

export default [
  // Global file ignores
  {
    ignores: ['dist/**', '.astro/**', 'node_modules/**', 'public/**', 'package-lock.json'],
  },
  // TypeScript recommended configs
  ...tseslint.configs.recommended,
  // Astro recommended configs
  ...eslintPluginAstro.configs.recommended,
  // TypeScript, TSX, JS, and MJS files
  {
    files: ['**/*.{ts,tsx,js,mjs}'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  // Astro templates and frontmatter
  {
    files: ['**/*.astro'],
    rules: {
      // Security: Prevent unsafe unescaped HTML injection
      'astro/no-set-html-directive': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
];
