/** @type {import('jest').Config} */
const config = {
    verbose: true,
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100
        }
    },
    testPathIgnorePatterns: [
        'node_modules',
        '__fixtures__',
        'unit-test-reports',
        'coverage',
        'demo'

    ],
    coverageDirectory: 'unit-test-reports/coverage',
    reporters: [
        'default',
        ['jest-html-reporters', {
            publicPath: './unit-test-reports/report',
            filename: 'index.html',
            pageTitle: 'parallel-testing unit test report',
            inlineSource: true
        }]
    ]
};

module.exports = config;
