const path = require('path');
const arg = require('arg');
const fastGlob = require('fast-glob');
const getConsoleObj = require('../../src/utils/console');

const debugMode = false; // IMPORTANT: To skip mocking console.log, console.error ...etc.

jest.mock('arg');
jest.mock('fast-glob');
jest.mock('../../src/utils/console');

describe('Parallel Testing Script', () => {
    const ARG_UNKNOWN_OPTION = 'ARG_UNKNOWN_OPTION';
    const cmdDir = path.join(__dirname,'../__fixtures__/cmd');
    const mocked16FilesList = [
        'cypress/e2e/testfile-01.cy.js',
        'cypress/e2e/testfile-02.cy.js',
        'cypress/e2e/feature1/feature1-03.cy.js',
        'cypress/e2e/feature2/feature2-04.cy.js',
        'cypress/e2e/feature1/sub-feature1/feature1-05.cy.js',
        'cypress/e2e/feature1/sub-feature1/feature1-06.cy.js',
        'cypress/e2e/feature1/sub-feature1/feature1-07.cy.js',
        'cypress/e2e/feature1/sub-feature1/feature1-08.cy.js',
        'cypress/e2e/feature1/sub-feature1/feature1-09.cy.js',
        'cypress/e2e/feature1/sub-feature1/feature1-10.cy.js',
        'cypress/e2e/feature1/sub-feature1/feature1-11.cy.js',
        'cypress/e2e/feature1/sub-feature1/feature1-12.cy.js',
        'cypress/e2e/feature1/sub-feature1/feature1-13.cy.js',
        'cypress/e2e/feature2/sub-feature2/feature2-14.cy.js',
        'cypress/e2e/feature2/sub-feature2/feature2-15.cy.js',
        'cypress/e2e/feature2/sub-feature2/feature2-16.cy.js',
        'cypress/e2e/feature2/sub-feature2/feature2-17.cy.js'
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        getConsoleObj.mockImplementation(() => {
            return {
                log: debugMode ? console.log : jest.fn(),
                error: debugMode ? console.error : jest.fn(),
                warn: debugMode ? console.warn : jest.fn(),
                info: debugMode ? console.info : jest.fn()
            };
        });
    });

    describe('start', () => {

        it('should start the job with 5 threads and 2 files', async () => {
            expect.assertions(1);

            const threads = 5;

            arg.mockReturnValue({
                '--test-cmd': `${cmdDir}/mocked-cypress run --e2e`,
                '--task-prefix': 'cy',
                '--specs': './cypress/e2e/**/*.cy.js',
                '--specs-separator': ',',
                '--threads': threads,
                '--max-threads': 6,
                '--after-all-cmd': `${cmdDir}/mocked-mochawesome-merge ./cypress/reports/**/*.json`
            });

            fastGlob.sync.mockReturnValue([
                'cypress/e2e/testfile-01.cy.js',
                'cypress/e2e/testfile-02.cy.js'
            ]);

            const { start } = require('../../src/lib/index');

            const { actualThreads } = await start();

            expect(actualThreads).toBe(2);
        });

        it('should start the job with 2 threads and 17 files', async () => {
            expect.assertions(1);

            const threads = 2;

            arg.mockReturnValue({
                '--test-cmd': `${cmdDir}/mocked-cypress run --e2e`,
                '--task-prefix': 'cy',
                '--specs': './cypress/e2e/**/*.cy.js',
                '--specs-separator': ',',
                '--threads': threads,
                '--max-threads': 6,
                '--after-all-cmd': `${cmdDir}/mocked-mochawesome-merge ./cypress/reports/**/*.json`
            });

            fastGlob.sync.mockReturnValue(mocked16FilesList);

            const { start } = require('../../src/lib/index');

            const { actualThreads } = await start();

            expect(actualThreads).toBe(threads);
        });

        it('should start the job with 3 threads and 17 files', async () => {
            expect.assertions(1);

            const threads = 3;

            arg.mockReturnValue({
                '--test-cmd': `${cmdDir}/mocked-cypress run --e2e`,
                '--task-prefix': 'cy',
                '--specs': './cypress/e2e/**/*.cy.js',
                '--specs-separator': ',',
                '--threads': threads,
                '--max-threads': 6,
                '--after-all-cmd': `${cmdDir}/mocked-mochawesome-merge ./cypress/reports/**/*.json`
            });

            fastGlob.sync.mockReturnValue(mocked16FilesList);

            const { start } = require('../../src/lib/index');

            const { actualThreads } = await start();

            expect(actualThreads).toBe(threads);
        });

        it('should start the job with 4 threads and 17 files', async () => {
            expect.assertions(1);

            const threads = 4;

            arg.mockReturnValue({
                '--test-cmd': `${cmdDir}/mocked-cypress run --e2e`,
                '--task-prefix': 'cy',
                '--specs': './cypress/e2e/**/*.cy.js',
                '--specs-separator': ',',
                '--threads': threads,
                '--max-threads': 6,
                '--after-all-cmd': `${cmdDir}/mocked-mochawesome-merge ./cypress/reports/**/*.json`
            });

            fastGlob.sync.mockReturnValue(mocked16FilesList);

            const { start } = require('../../src/lib/index');

            const { actualThreads } = await start();

            expect(actualThreads).toBe(threads);
        });

        it('should start the job 5 threads and 17 files', async () => {
            expect.assertions(1);

            const threads = 5;

            arg.mockReturnValue({
                '--test-cmd': `${cmdDir}/mocked-cypress run --e2e`,
                '--task-prefix': 'cy',
                '--specs': './cypress/e2e/**/*.cy.js',
                '--specs-separator': ',',
                '--threads': threads,
                '--max-threads': 6,
                '--after-all-cmd': `${cmdDir}/mocked-mochawesome-merge ./cypress/reports/**/*.json`
            });

            fastGlob.sync.mockReturnValue(mocked16FilesList);

            const { start } = require('../../src/lib/index');

            const { actualThreads } = await start();

            expect(actualThreads).toBe(threads);
        });

        it('should use maxThreads if threads exceed maxThreads', async () => {
            expect.assertions(1);

            const threads = 10;
            const maxThreads = 3;

            arg.mockReturnValue({
                '--test-cmd': `${cmdDir}/mocked-cypress run --e2e`,
                '--task-prefix': 'cy',
                '--specs': './cypress/e2e/**/*.cy.js',
                '--specs-separator': ',',
                '--threads': threads,
                '--max-threads': maxThreads,
                '--after-all-cmd': `${cmdDir}/mocked-mochawesome-merge ./cypress/reports/**/*.json`
            });

            fastGlob.sync.mockReturnValue(mocked16FilesList);

            const { start } = require('../../src/lib/index');

            const { actualThreads } = await start();

            expect(actualThreads).toBe(maxThreads);
        });

        it('should throw error when there is no spces found', async () => {
            expect.assertions(1);

            const threads = 10;
            const maxThreads = 3;

            arg.mockReturnValue({
                '--test-cmd': `${cmdDir}/mocked-cypress run --e2e`,
                '--task-prefix': 'cy',
                '--specs': 'not-valid-specs',
                '--specs-separator': ',',
                '--threads': threads,
                '--max-threads': maxThreads,
                '--after-all-cmd': `${cmdDir}/mocked-mochawesome-merge ./cypress/reports/**/*.json`
            });

            fastGlob.sync.mockReturnValue([]);

            const { start } = require('../../src/lib/index');

            await expect(start()).rejects.toThrow(/No specs found!, cwd: (.*) specs: not-valid-specs/);
        });

        it('should throw error when test commad exit with error code', async () => {
            expect.assertions(1);

            const threads = 10;
            const maxThreads = 3;

            arg.mockReturnValue({
                '--test-cmd': `${cmdDir}/mocked-cypress-err run --e2e`,
                '--task-prefix': 'cy',
                '--specs': './cypress/e2e/**/*.cy.js',
                '--specs-separator': ',',
                '--threads': threads,
                '--max-threads': maxThreads,
                '--after-all-cmd': `${cmdDir}/mocked-mochawesome-merge ./cypress/reports/**/*.json`
            });

            fastGlob.sync.mockReturnValue(mocked16FilesList);

            const { start } = require('../../src/lib/index');

            await expect(start()).rejects.toThrow(/\[cy instance #(\d{2})\] exited with code 1/);
        });

        it('should throw error when after all commad exit with error code', async () => {
            expect.assertions(1);

            const threads = 10;
            const maxThreads = 3;

            arg.mockReturnValue({
                '--test-cmd': `${cmdDir}/mocked-cypress run --e2e`,
                '--task-prefix': 'cy',
                '--specs': './cypress/e2e/**/*.cy.js',
                '--specs-separator': ',',
                '--threads': threads,
                '--max-threads': maxThreads,
                '--after-all-cmd': `${cmdDir}/mocked-mochawesome-merge-err ./cypress/reports/**/*.json`
            });

            fastGlob.sync.mockReturnValue(mocked16FilesList);

            const { start } = require('../../src/lib/index');

            await expect(start()).rejects.toThrow(/\[AFTER ALL CMD\] exited with code 1/);
        });

        it('should throw error when thread is less that 2', async () => {
            expect.assertions(1);

            const threads = 1;
            const maxThreads = 3;

            arg.mockReturnValue({
                '--test-cmd': `${cmdDir}/mocked-cypress run --e2e`,
                '--task-prefix': 'cy',
                '--specs': './cypress/e2e/**/*.cy.js',
                '--specs-separator': ',',
                '--threads': threads,
                '--max-threads': maxThreads,
                '--after-all-cmd': `${cmdDir}/mocked-mochawesome-merge ./cypress/reports/**/*.json`
            });

            fastGlob.sync.mockReturnValue(mocked16FilesList);

            const { start } = require('../../src/lib/index');

            await expect(start()).rejects.toThrow('The minimum number of supported threads is 2');
        });

        it('should throw error when unkown arg is been used', async () => {
            expect.assertions(1);

            arg.mockImplementation(() => {
                const err = new Error('Unkown arg option!');
                err.code = ARG_UNKNOWN_OPTION;
                throw err;
            });

            fastGlob.sync.mockReturnValue(mocked16FilesList);

            const { start } = require('../../src/lib/index');

            await expect(start()).rejects.toThrow('Unkown arg option!');
        });

        it('should throw error when no args', async () => {
            expect.assertions(1);

            arg.mockReturnValue({});

            fastGlob.sync.mockReturnValue([]);

            const { start } = require('../../src/lib/index');

            await expect(start()).rejects.toThrow(/Missing args!/);
        });

        it('should throw error when missing --test-cmd arg', async () => {
            expect.assertions(1);

            const threads = 10;
            const maxThreads = 3;

            arg.mockReturnValue({
                '--task-prefix': 'cy',
                '--specs': './cypress/e2e/**/*.cy.js',
                '--specs-separator': ',',
                '--threads': threads,
                '--max-threads': maxThreads,
                '--after-all-cmd': `${cmdDir}/mocked-mochawesome-merge ./cypress/reports/**/*.json`
            });

            fastGlob.sync.mockReturnValue(mocked16FilesList);

            const { start } = require('../../src/lib/index');

            await expect(start()).rejects.toThrow('Missing --test-cmd arg!');
        });

        it('should throw error when missing --task-prefix arg', async () => {
            expect.assertions(1);

            const threads = 10;
            const maxThreads = 3;

            arg.mockReturnValue({
                '--test-cmd': `${cmdDir}/mocked-cypress run --e2e`,
                '--specs': './cypress/e2e/**/*.cy.js',
                '--specs-separator': ',',
                '--threads': threads,
                '--max-threads': maxThreads,
                '--after-all-cmd': `${cmdDir}/mocked-mochawesome-merge ./cypress/reports/**/*.json`
            });

            fastGlob.sync.mockReturnValue(mocked16FilesList);

            const { start } = require('../../src/lib/index');

            await expect(start()).rejects.toThrow('Missing --task-prefix arg!');
        });

        it('should throw error when missing --specs arg', async () => {
            expect.assertions(1);

            const threads = 10;
            const maxThreads = 3;

            arg.mockReturnValue({
                '--test-cmd': `${cmdDir}/mocked-cypress run --e2e`,
                '--task-prefix': 'cy',
                '--specs-separator': ',',
                '--threads': threads,
                '--max-threads': maxThreads,
                '--after-all-cmd': `${cmdDir}/mocked-mochawesome-merge ./cypress/reports/**/*.json`
            });

            fastGlob.sync.mockReturnValue(mocked16FilesList);

            const { start } = require('../../src/lib/index');

            await expect(start()).rejects.toThrow('Missing --specs arg!');
        });

        it('should throw error when missing --specs-separator arg', async () => {
            expect.assertions(1);

            const threads = 10;
            const maxThreads = 3;

            arg.mockReturnValue({
                '--test-cmd': `${cmdDir}/mocked-cypress run --e2e`,
                '--task-prefix': 'cy',
                '--specs': './cypress/e2e/**/*.cy.js',
                '--threads': threads,
                '--max-threads': maxThreads,
                '--after-all-cmd': `${cmdDir}/mocked-mochawesome-merge ./cypress/reports/**/*.json`
            });

            fastGlob.sync.mockReturnValue(mocked16FilesList);

            const { start } = require('../../src/lib/index');

            await expect(start()).rejects.toThrow('Missing --specs-separator arg!');
        });

        it('should throw error when missing --threads arg', async () => {
            expect.assertions(1);

            const maxThreads = 3;

            arg.mockReturnValue({
                '--test-cmd': `${cmdDir}/mocked-cypress run --e2e`,
                '--task-prefix': 'cy',
                '--specs': './cypress/e2e/**/*.cy.js',
                '--specs-separator': ',',
                '--max-threads': maxThreads,
                '--after-all-cmd': `${cmdDir}/mocked-mochawesome-merge ./cypress/reports/**/*.json`
            });

            fastGlob.sync.mockReturnValue(mocked16FilesList);

            const { start } = require('../../src/lib/index');

            await expect(start()).rejects.toThrow('Missing --threads arg!');
        });

        it('should use threads value as max threads when missing --max-threads arg', async () => {
            expect.assertions(1);

            const threads = 2;

            arg.mockReturnValue({
                '--test-cmd': `${cmdDir}/mocked-cypress run --e2e`,
                '--task-prefix': 'cy',
                '--specs': './cypress/e2e/**/*.cy.js',
                '--specs-separator': ',',
                '--threads': threads,
                '--after-all-cmd': `${cmdDir}/mocked-mochawesome-merge ./cypress/reports/**/*.json`
            });

            fastGlob.sync.mockReturnValue(mocked16FilesList);

            const { start } = require('../../src/lib/index');

            const { actualThreads } = await start();

            expect(actualThreads).toBe(threads);
        });

        it('should throw error when missing --after-all-cmd arg', async () => {
            expect.assertions(1);

            const threads = 10;
            const maxThreads = 3;

            arg.mockReturnValue({
                '--test-cmd': `${cmdDir}/mocked-cypress run --e2e`,
                '--task-prefix': 'cy',
                '--specs': './cypress/e2e/**/*.cy.js',
                '--specs-separator': ',',
                '--threads': threads,
                '--max-threads': maxThreads
            });

            fastGlob.sync.mockReturnValue(mocked16FilesList);

            const { start } = require('../../src/lib/index');

            await expect(start()).rejects.toThrow('Missing --after-all-cmd arg!');
        });
    });
});
