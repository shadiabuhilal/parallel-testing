const { defineConfig } = require('cypress');

// IMPORTANT: use dymanic report name
const reportDirName = process.env.PARALLEL_TESTING_INSTANCE_NAME || 'report';

module.exports = defineConfig({
    video: true,
    videosFolder: './cypress/reports/videos',
    screenshotsFolder: './cypress/reports/screenshots',
    screenshotOnRunFailure: false,
    retries: 0,
    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
        reportDir: `./cypress/reports/${reportDirName}`, // IMPORTANT: use dymanic report name
        charts: true,
        overwrite: false, // IMPORTANT: use dymanic report name
        reportPageTitle: `Demo e2e ${reportDirName}`, // IMPORTANT: use dymanic report name
        ignoreVideos: false,
        videoOnFailOnly: false,
        embeddedScreenshots: true,
        inlineAssets: true,
        saveAllAttempts: false,
        html: true,
        json: true,
        saveJson: true,
        quite: false,
        debug: false
    },
    viewportWidth: 1280,
    viewportHeight: 1080,
    videoCompression: false,
    chromeWebSecurity: false,
    modifyObstructiveCode: false,
    e2e: {
        specPattern: 'cypress/integration/**/*.cy.{js,jsx,ts,tsx}',
        setupNodeEvents(on, config) {
            require('cypress-mochawesome-reporter/plugin')(on);
        }
    }
});
