import React from 'react'
import './bootstrap/bootstrap.min.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      urlBoxValue: '',
      cooldownTimeValue: '0',
      dontLoadPageChecked: true,
      reverseOrderChecked: true,
    };
  }
  render() {
    return (
      <div className="container mt-5">
        <div className="row">
          <div className="col">
            <label for="urlBox">URL list</label>
            <textarea id="urlBox" className="form-control" rows="10"
              value={this.state.urlBoxValue}
              onChange={e => this.setState({ urlBoxValue: e.target.value })}
              ></textarea>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col text-right">
            <button id="extractBtn" type="button" class="btn btn-secondary"
              onClick={() => this.extractBtnClick()}
              >Extract URLs</button>
          </div>
        </div>
        <div className="row mt-3">
          <label htmlFor="cooldownTime" className="col-sm-2 col-form-label">Cooldown</label>
          <div className="col-sm-10">
            <input id="cooldownTime" className="form-control-plaintext" type="number" step="0.01"
              value={this.state.cooldownTimeValue}
              onChange={e => this.setState({ cooldownTimeValue: e.target.value })}
              />
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col">
            <input id="dontLoadPage" type="checkbox"
              checked={this.state.dontLoadPageChecked}
              onChange={e => this.setState({ dontLoadPageChecked: e.target.checked })}
              />
            <label htmlFor="dontLoadPage">Don't load pages right away.</label>
          </div>
          <div className="col">
            <input id="reverseOrder" type="checkbox"
              checked={this.state.reverseOrderChecked}
              onChange={e => this.setState({ reverseOrderChecked: e.target.checked })}
              />
            <label htmlFor="reverseOrder">Go in reverse order.</label>
          </div>
          <div className="col text-right">
            <button id="goBtn" type="button" className="btn btn-primary"
              onClick={() => this.goBtnClick()}
              >Go</button>
          </div>
        </div>
      </div>
    );
  }

  async goBtnClick() {
    try {
      let current = await browser.tabs.getCurrent();
      let redirect = this.state.dontLoadPageChecked ? browser.extension.getURL('build/redirect.html') +'#' : '';
      let cooldown = parseFloat(this.state.cooldownTimeValue) * 1000;
  
      let urls = this.state.urlBoxValue.split(/\r?\n/g);
      if (this.state.reverseOrderChecked) {
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

  extractBtnClick() {
    try {
      this.setState({
        urlBoxValue: (this.state.urlBoxValue
          .match(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig) || [])
          .join('\n')
      });
    } catch (e) {
      alert(e);
    }
  }
}

export default App;
