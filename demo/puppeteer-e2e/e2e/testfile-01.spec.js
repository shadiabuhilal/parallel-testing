/* eslint-disable no-undef */

describe('testfile-01', function () {

    it('should work', async function () {
        await page.goto('https://pptr.dev/');
        await page.click('#__docusaurus > nav > div.navbar__inner > div:nth-child(1) > a:nth-child(4)');
        expect(page.url()).to.include('https://pptr.dev/api/puppeteer.puppeteernode');
    });

});
