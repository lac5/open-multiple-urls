# open-multiple-urls
An extension that can open a list of URLs at once. Paste your URLs into the box labeled "URL list" and click "Go". It'll open all the URLs in order depending on how fast your computer can process it. There are also other options too. 

### Build instructions
1. Install node.js
2. Run `npm install`
3. Run `npm run build`
4. Run `npm pack`
5. There should be a file named "open-multiple-urls-`{version}`.tgz" in the root folder of the project. Inside it is "open-multiple-urls-`{version}`.tar/package/". Move the contents of that into a new zip file. In other words:
```
open-multiple-urls-{version}.tgz/open-multiple-urls-{version}.tar/package/* -> open-multiple-urls.zip
```
