import { defineConfig } from 'cypress';

// ********************************************************************************
const defined = defineConfig({
 e2e: {
  baseUrl: 'http://localhost:3000',
  testIsolation: true/*clean browser context between tests*/,
 },
 projectId: '',
});

export default defined;
