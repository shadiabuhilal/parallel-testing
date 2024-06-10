# parallel-testing
![Build Status](https://github.com/shadiabuhilal/parallel-testing/actions/workflows/push-workflows.yml/badge.svg)

parallel-testing allows the execution of any test frameworks in parallel, dramatically reducing the execution time.


## Usage

Install parallel-testing package
```js
npm install parallel-testing --save-dev
```

Add parallel-testing command to package.json scripts
```
{
    ...,
    scripts: {
        ...,
        "e2e": "parallel-testing --threads=<NUMBER> --test-cmd='<STRING>' --task-prefix='<STRING>' --specs='<STRING>' --specs-separator='<STRING>' --after-all-cmd='<STRING>'",
    },
    ....
}
```
 [KEY_TEST_COMMAND]: '',
                [KEY_TASK_PREFIX]: '',
                [KEY_SPECS]: '',
                [KEY_THREADS]: '',
                [KEY_MAX_THREADS]: '',
                [KEY_AFTER_ALL_COMMAND]: ''
## parallel-testing args options

| Option            | Description                                       |
|-------------------|---------------------------------------------------|
| --test-cmd        | Command used to run tests. 
Add `@SPECS` as a placeholder in the command; it will be replaced with a comma-separated list of specs.
Add `@INSTANCE` as a placeholder in the command; it will be replaced with a thread instance ID, useful for report directory names. |
| --task-prefix     | Prefix used for the logs.                          |
| --specs           | Test specs pattren, e.g: `e2e/**/**.spec.js`.      |
| --specs-separator |Test spec files separator delimiter, e.g: `,`.
| --threads         | Number of parallel threads (Optional).             |
| --max-threads     | Maximum number of parallel threads (Optional).     |
| --after-all-cmd   | Command that runs after all tests are done.        |


----------


## parallel-testing with

### Cypress

Running Cypress e2e tests parallel, please check [Cypress Demo](demo/cypress-e2e).
The demo covers how to generate **HTML report** with **screenshots** and **videos**.

|  Type    |  Total    | Threads   |
|----------|-----------|-----------|
| Serial   | 57.8171s  | 1         |
| Parallel | 24.9825s  | 5         |


![cypress-e2e](https://github.com/shadiabuhilal/parallel-testing/assets/1387462/2221bd91-c957-4a7b-9a8e-3ab38fb4575e)


### Puppeteer

Running Puppeteer e2e tests parallel, please check [Puppeteer Demo](demo/puppeteer-e2e).
The demo covers how to generate **HTML report** with **screenshots**.

|  Type    |  Total    | Threads   |
|----------|-----------|-----------|
| Serial   | 16.6492s  | 1         |
| Parallel | 8.8565s   | 5         |


![puppeteer-e2e](https://github.com/shadiabuhilal/parallel-testing/assets/1387462/25eb61c5-6939-46cf-a770-34ba540c1c9e)


*NOTE: Tests for each framework are different; please don't use these numbers to compare between these testing frameworks.*

The demo statistics are generated using the [Gnomon](https://github.com/paypal/gnomon) tool.