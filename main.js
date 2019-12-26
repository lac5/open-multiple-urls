(function() {
    'use strict';

    const urlBox = document.getElementById('urlBox');
    const cooldownTime = document.getElementById('cooldownTime');
    const dontLoadPage = document.getElementById('dontLoadPage');
    const reverseOrder = document.getElementById('reverseOrder');

    document.getElementById('goBtn').addEventListener('click', async function() {
        try {
            let current = await browser.tabs.getCurrent();
            let redirect = dontLoadPage.checked ? browser.extension.getURL('redirect.html') +'#' : '';
            let cooldown = parseFloat(cooldownTime.value) * 1000;

            let urls = urlBox.value.split(/\r?\n/g);
            if (reverseOrder.checked) {
                urls.reverse();
            }

            await urls.reduce(async (p, url) => {
                await p;
                url = url.trim();
                if (url) {
                    try {
                        await browser.tabs.create({
                            url: redirect + url,
                            cookieStoreId: current.cookieStoreId,
                            active: false,
                        });
                    } catch (e) {
                        alert(e);
                    }

                    if (cooldown > 0) {
                        await new Promise(resolve => setTimeout(resolve, cooldown));
                    }
                }
            }, Promise.resolve());
        } catch (e) {
            alert(e);
        }
    });

    document.getElementById('extractBtn').addEventListener('click', function() {
        try {
            urlBox.value = (urlBox.value.match(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig) || []).join('\n');
        } catch (e) {
            alert(e);
        }
    });
})();
