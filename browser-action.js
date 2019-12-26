browser.browserAction.onClicked.addListener(async tab => {
    let activeTabs = await browser.tabs.query({ active: true });
    await browser.tabs.create({
        url: browser.extension.getURL('index.html'),
        cookieStoreId: activeTabs.length > 0 ? activeTabs[0].cookieStoreId : void 0,
        active: true,
    });
});
