const globals = require('globals');
const jestPlugin = require('eslint-plugin-jest');
const stylisticJs = require('@stylistic/eslint-plugin-js');

const ignores = [
    '.git/**/*',
    '.github/**/*',
    '.vscode/**/*',
    'node_modules/**/*',
    '__snapshots__/**/*',
    'unit-test-reports/**/*',
    'coverage/**/*',
    'build/**/*',
    '__tests__/__fixtures__/**/*',
    'demo/cypress-e2e/cypress/reports/**/*',
    '.editorconfig',
    '.DS_Store',
    '.gitignore'
];

const rules = {
    camelcase: 'off',
    'consistent-return': 'off',
    'vars-on-top': 'off',
    'new-cap': 'off',
    'no-console': 'off',
    'no-constant-condition': 'error',
    'no-empty': 'off',
    'no-native-reassign': 'off',
    'no-underscore-dangle': 'off',
    'no-undef': ['error', { typeof: false }],
    'no-process-exit': 'off',
    'no-unused-expressions': 'off',
    'no-regex-spaces': 'off',
    'no-catch-shadow': 'off',
    'no-lonely-if': 'off',
    'brace-style': ['warn', 'stroustrup'],
    'no-shadow': ['warn', { allow: ['err', 'done'] }],
    'no-unused-vars': [
        'warn',
        {
            vars: 'all',
            varsIgnorePattern: '^internals$',
            args: 'none'
        }
    ],
    'one-var': ['error', 'never'],
    'handle-callback-err': ['error', '^(e|err|error)$'],
    'array-bracket-spacing': 'warn',
    'dot-notation': 'warn',
    'eol-last': 'warn',
    'no-trailing-spaces': 'warn',
    'no-eq-null': 'warn',
    'no-extend-native': 'warn',
    'no-redeclare': 'warn',
    'no-loop-func': 'warn',
    yoda: ['warn', 'never'],
    'sort-vars': 'warn',
    'arrow-parens': ['error', 'always'],
    'arrow-spacing': ['error', { before: true, after: true }],
    quotes: ['error', 'single'],
    'consistent-this': ['error', 'self'],
    'new-parens': 'error',
    'no-array-constructor': 'error',
    'no-new-object': 'error',
    'no-spaced-func': 'error',
    'no-mixed-spaces-and-tabs': 'error',
    'keyword-spacing': ['error', { before: true, after: true }],
    semi: ['error', 'always'],
    'semi-spacing': ['error', { before: false, after: true }],
    'space-infix-ops': 'error',
    'space-unary-ops': ['warn', { words: true, nonwords: false }],
    strict: ['error', 'global'],
    eqeqeq: 'error',
    curly: ['error', 'all'],
    'no-eval': 'error',
    'no-else-return': 'error',
    'no-return-assign': 'error',
    'no-new-wrappers': 'error',
    'comma-dangle': ['error', 'never'],
    'no-sparse-arrays': 'error',
    'no-ex-assign': 'error',
    indent: ['error', 4, { SwitchCase: 1 }],
    'space-before-function-paren': [
        'error',
        { anonymous: 'always', named: 'never' }
    ],
    'func-style': ['error', 'expression'],
    'object-curly-spacing': ['error', 'always'],
    'no-unsafe-finally': 'error',
    'no-useless-computed-key': 'error'
};

module.exports = [
    {
        files: ['**/*.js'],
        ignores,
        plugins: {
            '@stylistic/js': stylisticJs
        },
        languageOptions: {
            globals: {
                ...globals.node
            }
        },
        rules: {
            ...rules,
            '@stylistic/js/no-multiple-empty-lines': ['error', { 'max': 1, 'maxBOF': 1 }]

        }
    },
    {
        files: ['src/**/*.js'],
        ignores,
        languageOptions: {
            globals: {
                ...globals.node
            }
        },
        rules
    },
    {
        files: ['__tests__/**/*.js'],
        ...jestPlugin.configs['flat/recommended'],
        ignores,
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest
            }
        },
        rules: {
            ...rules,
            ...jestPlugin.configs['flat/recommended'].rules,
            'jest/prefer-expect-assertions': 'error'
        }
    }
];
