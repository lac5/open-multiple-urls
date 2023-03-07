import './bootstrap/bootstrap.min.css';

function App() {
  const urlBox = <textarea id="urlBox" class="form-control" rows="10"></textarea>;
  const cooldownTime = <input id="cooldownTime" class="form-control-plaintext" type="number" step="0.01" value="0" />;
  const dontLoadPage = <input id="dontLoadPage" type="checkbox" checked />;
  const reverseOrder = <input id="reverseOrder" type="checkbox" checked />;

  return (
    <div class="container mt-5">
      <div class="row">
        <div class="col">
          <label for="urlBox">URL list</label>
          {urlBox}
        </div>
      </div>
      <div class="row mt-3">
        <div class="col text-right">
          <button id="extractBtn" type="button" class="btn btn-secondary" onClick={extractBtnClick}>Extract URLs</button>
        </div>
      </div>
      <div class="row mt-3">
        <label for="cooldownTime" class="col-sm-2 col-form-label">Cooldown</label>
        <div class="col-sm-10">
          {cooldownTime}
        </div>
      </div>
      <hr />
      <div class="row">
        <div class="col">
          {dontLoadPage}
          <label for="dontLoadPage">Don't load pages right away.</label>
        </div>
        <div class="col">
          {reverseOrder}
          <label for="reverseOrder">Go in reverse order.</label>
        </div>
        <div class="col text-right">
          {<button id="goBtn" type="button" class="btn btn-primary" onClick={goBtnClick}>Go</button>}
        </div>
      </div>
    </div>
  );

  async function goBtnClick() {
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
  }

  function extractBtnClick() {
    try {
      urlBox.value = (urlBox.value.match(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig) || []).join('\n');
    } catch (e) {
      alert(e);
    }
  }
}

export default App;
