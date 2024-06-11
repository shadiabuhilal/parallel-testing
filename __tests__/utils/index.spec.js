const path = require('path');
const getConsoleObj = require('../../src/utils/console');
const { convertToNDigits, cleanFolderName, validateInput, calculateFiles } = require('../../src/utils/index');

const debugMode = false; // IMPORTANT: To skip mocking console.log, console.error ...etc.

jest.mock('../../src/utils/console');

describe('Utils', () => {

    beforeEach(() => {
        getConsoleObj.mockImplementation(() => {
            return {
                log: debugMode ? console.log : jest.fn(),
                error: debugMode ? console.error : jest.fn(),
                warn: debugMode ? console.warn : jest.fn(),
                info: debugMode ? console.info : jest.fn()
            };
        });
    });

    describe('convertToNDigits', () => {
        it('should convert a number to a string with leading zeros', () => {
            expect.assertions(3);
            expect(convertToNDigits(5, 3)).toBe('005');
            expect(convertToNDigits(123, 5)).toBe('00123');
            expect(convertToNDigits(0, 2)).toBe('00');
        });

        it('should return the number as string if n is less than or equal to the length of the number', () => {
            expect.assertions(2);
            expect(convertToNDigits(12345, 3)).toBe('12345');
            expect(convertToNDigits(987, 3)).toBe('987');
        });
    });

    describe('cleanFolderName', () => {
        it('should replace spaces with hyphens', () => {
            expect.assertions(3);
            expect(cleanFolderName('my folder name')).toBe('my-folder-name');
            expect(cleanFolderName('folder name')).toBe('folder-name');
            expect(cleanFolderName('  leading and trailing  ')).toBe('--leading-and-trailing--');
        });

        it('should handle strings with no spaces correctly', () => {
            expect.assertions(2);
            expect(cleanFolderName('foldername')).toBe('foldername');
            expect(cleanFolderName('')).toBe('');
        });

        it('should handle strings with multiple consecutive spaces correctly', () => {
            expect.assertions(1);
            expect(cleanFolderName('multiple   spaces')).toBe('multiple---spaces');
        });
    });

    describe('validateInput', () => {

        it('should throw an error if the value is missing', () => {
            expect.assertions(1);
            expect(() => validateInput(null, 'testKey')).toThrow('Missing testKey arg!');
        });

        it('should return the value if it is present', () => {
            expect.assertions(1);
            expect(validateInput('value', 'testKey')).toBe('value');
        });

        it('should return the default value if it not is present', () => {
            expect.assertions(1);
            expect(validateInput(undefined, 'testKey', 20)).toBe(20);
        });
    });

    describe('calculateFiles', () => {

        it('should correctly calculate file distribution', () => {
            expect.assertions(3);
            const result = calculateFiles({ specs: '__fixtures__/e2e/**/*.cy.js', threads: 6, cwd: path.join(__dirname, '../') });
            expect(result.filesCount).toBe(17);
            expect(result.numOfFilesPerThread).toBe(3);
            expect(result.allFiles).toEqual([
                '__fixtures__/e2e/testfile-01.cy.js',
                '__fixtures__/e2e/testfile-02.cy.js',
                '__fixtures__/e2e/feature1/feature1-03.cy.js',
                '__fixtures__/e2e/feature2/feature2-04.cy.js',
                '__fixtures__/e2e/feature1/sub-feature1/feature1-05.cy.js',
                '__fixtures__/e2e/feature1/sub-feature1/feature1-06.cy.js',
                '__fixtures__/e2e/feature1/sub-feature1/feature1-07.cy.js',
                '__fixtures__/e2e/feature1/sub-feature1/feature1-08.cy.js',
                '__fixtures__/e2e/feature1/sub-feature1/feature1-09.cy.js',
                '__fixtures__/e2e/feature1/sub-feature1/feature1-10.cy.js',
                '__fixtures__/e2e/feature1/sub-feature1/feature1-11.cy.js',
                '__fixtures__/e2e/feature1/sub-feature1/feature1-12.cy.js',
                '__fixtures__/e2e/feature1/sub-feature1/feature1-13.cy.js',
                '__fixtures__/e2e/feature2/sub-feature2/feature2-14.cy.js',
                '__fixtures__/e2e/feature2/sub-feature2/feature2-15.cy.js',
                '__fixtures__/e2e/feature2/sub-feature2/feature2-16.cy.js',
                '__fixtures__/e2e/feature2/sub-feature2/feature2-17.cy.js'
            ]);
        });
    });

});
