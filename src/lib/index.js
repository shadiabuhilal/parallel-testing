#!/usr/bin/env node

const arg = require('arg');
const concurrently = require('concurrently');
const { convertToNDigits, cleanFolderName, validateInput, calculateFiles, printErrorLog, printWarningLog, printSuccessLog, printInfoLog } = require('../utils');

const KEY_HELP = '--help';
const KEY_TEST_COMMAND = '--test-cmd';
const KEY_TASK_PREFIX = '--task-prefix';
const KEY_SPECS = '--specs';
const KEY_SPECS_SEPARATOR = '--specs-separator';
const KEY_THREADS = '--threads';
const KEY_MAX_THREADS = '--max-threads';
const KEY_AFTER_ALL_COMMAND = '--after-all-cmd';

const ARG_UNKNOWN_OPTION = 'ARG_UNKNOWN_OPTION';

const createConcurrntlyTask = ({ testCmd, taskPrefix, jobSpecArr, specsSeparator, index }) => {
    const name = `${taskPrefix} instance #${convertToNDigits(index + 1, 2)}`;

    printInfoLog(name, 'specs:', `\n${jobSpecArr.join('\n')}`);

    const cleanFolderNameStr = cleanFolderName(name);

    return  {
        command: testCmd.replace('@SPECS', jobSpecArr.join(specsSeparator)).replace('@INSTANCE', cleanFolderNameStr),
        name,
        env: {
            PARALLEL_TESTING_INSTANCE_NAME: cleanFolderNameStr
        }
    };
};

const buildConcurrentlyTasksList = ({ testCmd, taskPrefix, threads, allFiles, specsSeparator, numOfFilesPerThread }) => {
    const concurrentlyTaskList = [];
    for (let index = 0;  index < threads;  index++) {

        let jobSpecArr = allFiles.splice(0, numOfFilesPerThread);

        /* istanbul ignore if */
        if (jobSpecArr.length === 0) {
            continue;
        }

        const isLastItem = index === threads - 1;

        if (isLastItem) {
            // Adding remaining items to last job.
            jobSpecArr = jobSpecArr.concat(allFiles);
        }

        concurrentlyTaskList.push(createConcurrntlyTask({ testCmd, taskPrefix, jobSpecArr, specsSeparator, index }));
    }

    /* istanbul ignore if */
    if (concurrentlyTaskList.length === 0) {
        throw new Error('No specs found!');
    }

    return concurrentlyTaskList;
};

const getArgs = () => {
    let args;
    try {
        args = arg({
            [KEY_HELP]: Boolean,
            [KEY_TEST_COMMAND]: String,
            [KEY_TASK_PREFIX]: String,
            [KEY_SPECS]: String,
            [KEY_SPECS_SEPARATOR]: String,
            [KEY_THREADS]: Number,
            [KEY_MAX_THREADS]: Number,
            [KEY_AFTER_ALL_COMMAND]: String
        });

        if (Object.keys(args).filter((key) => key !== '_').length === 0) {
            const err = new Error('Missing args!');
            err.code = ARG_UNKNOWN_OPTION;
            throw err;
        }

        /* istanbul ignore next */
        if (args[KEY_HELP]) {
            const options = {
                [KEY_HELP]: 'Print cli options.',
                [KEY_TEST_COMMAND]: 'Command used to run tests. Add `@SPECS` as a placeholder in the command; it will be replaced with a comma-separated list of specs.',
                [KEY_TASK_PREFIX]: 'Prefix used for the logs.',
                [KEY_SPECS]: 'Test specs pattren, e.g: `e2e/**/**.spec.js`.',
                [KEY_SPECS_SEPARATOR]: 'Test spec files separator delimiter, e.g: `,`.',
                [KEY_THREADS]: 'Number of parallel threads.',
                [KEY_MAX_THREADS]: 'Maximum number of parallel threads (Optional).',
                [KEY_AFTER_ALL_COMMAND]: 'Command that runs after all tests are done.'
            };

            const optionsStr = Object.entries(options).map((arr) => {
                const key = arr[0];
                const value = arr[1];
                return `${key.padStart(15, ' ')}: ${value}`;
            }).join('\n');

            printInfoLog('Avilable options:', `\n${optionsStr}\n`);

            process.exit();
        }
    }
    catch (err) {
        /* istanbul ignore else */
        if (err.code === ARG_UNKNOWN_OPTION) {
            printErrorLog('Please run `parallel-testing --help` to check for available options.');
            throw err;
        }

        /* istanbul ignore next */
        throw err;
    }

    return args;
};

const exitInfoErrorCode = ({ exitInfo, doNotThrowError }) => {
    if (exitInfo.exitCode !== 0) {
        /* istanbul ignore next */
        const name = exitInfo.command && exitInfo.command.name || exitInfo.name;
        const exitCode = exitInfo.command && exitInfo.command.exitCode || exitInfo.exitCode;
        const err = new Error(`[${name}] exited with code ${exitCode}`);

        /* istanbul ignore else */
        if (doNotThrowError) {
            return err;
        }

        /* istanbul ignore next */
        throw err;
    }

    return null;
};

const afterAllJobAsync = async ({ afterAllCmd }) => {
    const { result } = await concurrently(
        [
            {
                command: afterAllCmd,
                name: 'AFTER ALL CMD'
            }
        ],
        {
            hide: true,
            restartTries: 0,
            restartAfter: 0
        }
    );

    return await result;
};

const startParallelTestingJobAsync = async ({ concurrentlyTaskList, afterAllCmd }) => {
    const { result } = await concurrently(
        concurrentlyTaskList,
        {
            hide: true,
            restartTries: 0,
            restartAfter: 0
        }
    );

    return await result;
};

const start = async () => {
    const args = getArgs();

    const testCmd = validateInput(args[KEY_TEST_COMMAND], KEY_TEST_COMMAND);
    const taskPrefix = validateInput(args[KEY_TASK_PREFIX], KEY_TASK_PREFIX);
    const specs = validateInput(args[KEY_SPECS], KEY_SPECS);
    const specsSeparator = validateInput(args[KEY_SPECS_SEPARATOR], KEY_SPECS_SEPARATOR);
    let threads = validateInput(args[KEY_THREADS], KEY_THREADS);
    const maxThreads = validateInput(args[KEY_MAX_THREADS], KEY_MAX_THREADS, threads);
    const afterAllCmd = validateInput(args[KEY_AFTER_ALL_COMMAND], KEY_AFTER_ALL_COMMAND);

    if (threads < 2) {
        throw new Error('The minimum number of supported threads is 2');
    }

    if (threads > maxThreads) {
        printWarningLog(`Warning: Threads are ${threads} which is more that the max threads ${maxThreads}, using max threads value.`);
        threads = maxThreads;
    }

    const { allFiles, numOfFilesPerThread } = calculateFiles({ specs, threads });

    const concurrentlyTaskList = buildConcurrentlyTasksList({ testCmd, taskPrefix, threads, allFiles, specsSeparator, numOfFilesPerThread });

    let testJobErr = null;

    try {
        const testJobResultArr = await startParallelTestingJobAsync({ concurrentlyTaskList, afterAllCmd });
        printSuccessLog('TESTING:DONE!');

        testJobResultArr.forEach((exitInfo) => {
            // IMPORTANT: DONT THROW ERROR BEFORE AFTER ALL COMMAND.
            testJobErr = testJobErr || exitInfoErrorCode({ exitInfo, doNotThrowError: true });
        });
    }
    catch (errArr) {
        printErrorLog('TESTING:DONE with errors!');

        /* istanbul ignore else */
        if (Array.isArray(errArr)) {
            errArr.forEach((exitInfo) => {
                // IMPORTANT: DONT THROW ERROR BEFORE AFTER ALL COMMAND.
                testJobErr = testJobErr || exitInfoErrorCode({ exitInfo, doNotThrowError: true });
            });
        }
    }

    const jobResultArr = await afterAllJobAsync({ afterAllCmd });

    const printAfterAllCmdLog = testJobErr ? printErrorLog : printSuccessLog;
    printAfterAllCmdLog('AFTER TESTING COMMAND:DONE!');

    jobResultArr.forEach((exitInfo) => {
        exitInfoErrorCode({ exitInfo });
    });

    if (testJobErr) {
        throw testJobErr;
    }

    return {
        actualThreads: concurrentlyTaskList.length
    };
};

module.exports = {
    start
};
