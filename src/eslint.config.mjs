import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ********************************************************************************
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
 allConfig: js.configs.all,
 baseDirectory: __dirname,
 recommendedConfig: js.configs.recommended,
});

// eslint-disable-next-line import/no-anonymous-default-export
export default [...compat.extends(
 'next/core-web-vitals',
 'plugin:@typescript-eslint/eslint-recommended',
 'plugin:@typescript-eslint/recommended'
), {
 rules: {
  '@typescript-eslint/array-type': 'off',
  '@typescript-eslint/ban-ts-comment': 'off',
  '@typescript-eslint/ban-types': 'off',
  '@typescript-eslint/camelcase': 'off',
  '@typescript-eslint/explicit-function-return-type': 'off',
  '@typescript-eslint/explicit-member-accessibility': 'off',
  '@typescript-eslint/indent': 'off',
  '@typescript-eslint/interface-name-prefix': 'off',
  '@typescript-eslint/no-empty-function': 'off',
  '@typescript-eslint/no-empty-interface': 'off',
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-inferrable-types': 'off',
  '@typescript-eslint/no-non-null-assertion': 'off',
  '@typescript-eslint/no-object-literal-type-assertion': 'off',
  '@typescript-eslint/no-unused-vars': ['warn', {
   args: 'none',
  }],
  '@typescript-eslint/no-use-before-define': 'off',
  '@typescript-eslint/require-array-sort-compare': 'off',
  'comma-dangle': ['warn', {
   arrays: 'always-multiline',
   exports: 'always-multiline',
   functions: 'never',
   imports: 'always-multiline',
   objects: 'always-multiline',
  }],
  'comma-spacing': 'warn',
  'eol-last': 'warn',
  'linebreak-style': ['warn', 'unix'],
  'no-constant-condition': 'warn',
  'no-duplicate-imports': 'error',
  'no-extra-semi': 'error',
  'no-multi-spaces': 'off',
  'no-nested-ternary': 'off',
  'no-trailing-spaces': 'warn',
  'no-unreachable': 'warn',
  'no-unused-labels': 'error',
  'no-unused-vars': 'off',
  'no-var': 'off',
  'no-unsafe-negation': 'error',
  'no-multiple-empty-lines': 'warn',
  'object-curly-spacing': ['warn', 'always'],
  'prefer-const': 'off',
  'react/jsx-closing-bracket-location': 'error',
  'react/jsx-closing-tag-location': 'error',
  'react/no-unescaped-entities': 'off',
  'react/prop-types': 'off',
  'react/self-closing-comp': ['error', {
   component: true,
   html: false,
  }],
  'react-hooks/exhaustive-deps': 'warn',
  'react-hooks/rules-of-hooks': 'error',
  'standard/no-callback-literal': 'off',
 },
}];
