const chalk = require('chalk').default;
const fastGlob = require('fast-glob');
const getConsoleObj = require('./console');

const prefix = '[PARALLEL-TESTING]:';

const printInfoLog = (title, ...args) => {
    const consoleOb = getConsoleObj();
    consoleOb.log(chalk.bgBlue.white(prefix), chalk.blue(title), ...args);
};

const printWarningLog = (...args) => {
    const consoleOb = getConsoleObj();
    consoleOb.log(chalk.bgYellow.black(prefix), chalk.yellow(...args));
};

const printErrorLog = (...args) => {
    const consoleOb = getConsoleObj();
    consoleOb.log(chalk.bgRed.white(prefix), chalk.red(...args));
};

const printSuccessLog = (...args) => {
    const consoleOb = getConsoleObj();
    consoleOb.log(chalk.bgGreen.white(prefix), chalk.green(...args));
};

const convertToNDigits = (number, n) => String(number).padStart(n, '0');

const cleanFolderName = (name) => name.replaceAll(' ', '-').replaceAll('#', '');

const validateInput = (value, key, defaultValue) => {
    if (!value) {
        if (defaultValue) {
            return defaultValue;
        }

        throw new Error(`Missing ${key} arg!`);
    }

    return value;
};

const calculateFiles = ({ specs, threads, cwd }) => {
    cwd = cwd || process.cwd();

    const files = fastGlob.sync([specs], {
        onlyFiles: true,
        cwd
    });

    if (!files || files.length === 0) {
        throw new Error(`No specs found!, cwd: ${cwd}, specs: ${specs}`);
    }

    const filesCount = files.length;
    const allFiles = files.concat([]);

    const numOfFilesPerThread = Math.ceil(filesCount / threads);

    printInfoLog('Total files:', filesCount);
    printInfoLog('Threads:', threads);
    printInfoLog('Files per thread:', numOfFilesPerThread);
    printInfoLog('All Files:', `\n${allFiles.join('\n')}`);

    return {
        filesCount,
        numOfFilesPerThread,
        allFiles
    };
};

module.exports = {
    convertToNDigits,
    cleanFolderName,
    validateInput,
    calculateFiles,
    printInfoLog,
    printWarningLog,
    printErrorLog,
    printSuccessLog
};
