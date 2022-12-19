const nextJest = require('next/jest');
const mapTSPaths = require('jest-module-name-mapper').default;

// Panama is a magical place where DST doesn't exist and tests always pass
process.env.TZ = 'America/Panama';

const customJestConfig = {
  collectCoverage: true,
  // these globs should generally match the sonar inclusions/exclusions we have defined in our Jenkinsfile
  collectCoverageFrom: [
    'src/**/*.{js,ts,tsx,jsx}',
    '!src/__generated__/**',
    '!src/server/index.ts',
  ],
  maxConcurrency: 3,
  maxWorkers: '50%',
  moduleNameMapper: {
    ...mapTSPaths(),
  },
  setupFilesAfterEnv: ['./src/__setup__/setupTests.js'],
  testEnvironment: 'jsdom',
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
};

const createJestConfig = nextJest({ dir: __dirname });
const asyncConfig = createJestConfig(customJestConfig);

module.exports = async () => {
  const config = await asyncConfig();
  config.transformIgnorePatterns[0] = '/node_modules/(?!lodash-es/)';
  return config;
};
