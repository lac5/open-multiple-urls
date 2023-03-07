import { useState } from 'react';
import './bootstrap/bootstrap.min.css';

function App() {
  const [urlBoxValue, setUrlBoxValue] = useState('');
  const [cooldownTimeValue, setCooldownTimeValue] = useState('0');
  const [dontLoadPageChecked, setDontLoadPageChecked] = useState(true);
  const [reverseOrderChecked, setReverseOrderChecked] = useState(true);

  return (
    <div class="container mt-5">
      <div class="row">
        <div class="col">
          <label for="urlBox">URL list</label>
          <textarea id="urlBox" class="form-control" rows="10" value={urlBoxValue} onChange={setUrlBoxValue}></textarea>
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
          <input id="cooldownTime" class="form-control-plaintext" type="number" step="0.01" value={cooldownTimeValue} onChange={setCooldownTimeValue} />
        </div>
      </div>
      <hr />
      <div class="row">
        <div class="col">
          <input id="dontLoadPage" type="checkbox" checked={dontLoadPageChecked} onChange={setDontLoadPageChecked} />
          <label for="dontLoadPage">Don't load pages right away.</label>
        </div>
        <div class="col">
          <input id="reverseOrder" type="checkbox" checked={reverseOrderChecked} onChange={setReverseOrderChecked} />
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
      let redirect = dontLoadPageChecked ? browser.extension.getURL('redirect.html') +'#' : '';
      let cooldown = parseFloat(cooldownTimeValue) * 1000;
  
      let urls = urlBoxValue.split(/\r?\n/g);
      if (reverseOrderChecked) {
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
      setUrlBoxValue((urlBoxValue.match(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig) || []).join('\n'));
    } catch (e) {
      alert(e);
    }
  }
}

export default App;
