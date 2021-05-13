module.exports = function () {
  return {
    env: {
      type: 'node',
      report404AsError: true,
    },
    files: [
      'tsconfig.json',
      'src/**/*.ts',
      { pattern: 'src/**/*.spec.ts', ignore: true },
    ],
    filesWithNoCoverageCalculated: [
      'src/main.ts',
      'src/utils/tests/**',
      '**/*.factory.ts',
    ],
    tests: ['src/**/*.spec.ts'],
    testFramework: 'jest',
  };
};
