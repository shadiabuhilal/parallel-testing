/* eslint-disable no-undef */
import puppeteer from 'puppeteer';
import { expect } from 'chai';
import { makeDirectory } from 'make-dir';
import addContext from 'mochawesome/addContext.js';

// puppeteer options
const opts = {
    headless: true,
    timeout: 10000
};

beforeEach(async function () {
    global.expect = expect;
    global.browser = await puppeteer.launch(opts);
    global.page = await browser.newPage();
    await global.page.setViewport({ width: 1280, height: 1080 });
});

afterEach(async function () {
    const testScreenshotsDir = `screenshots/${this.currentTest.parent.title}`;
    const fileDirPath = await makeDirectory(`reports/${testScreenshotsDir}`);
    const fileName = `${this.currentTest.title}.png`;
    await global.page.screenshot({ path: `${fileDirPath}/${fileName}`  });
    // Add the screenshot to Mochawesome report, user relative path from html report
    addContext(this, `${testScreenshotsDir}/${fileName}` );

    browser.close();
});
