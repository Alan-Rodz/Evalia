import type { Config } from 'jest'
import nextJest from 'next/jest.js'

// ********************************************************************************
// == Constant ====================================================================
const config: Config = {
 coverageProvider: 'v8',
 testEnvironment: 'jsdom',
}

// == Util ========================================================================
const createJestConfig = nextJest({ dir: './' });

// == Export ======================================================================
export default createJestConfig(config)
