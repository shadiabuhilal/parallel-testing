
/* eslint-disable no-undef */

describe('testfile-10', function () {

    it('should work', async function () {
        await page.goto('https://pptr.dev/');
        await page.click('#__docusaurus > nav > div.navbar__inner > div:nth-child(1) > a:nth-child(3)');
        expect(page.url()).to.include('https://pptr.dev/category/introduction');
    });

});
