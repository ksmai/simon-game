const path = require('path');

const PUBLIC_PATH = '/simon-game';

const SRC = path.resolve('src');
const ASSETS = path.resolve('assets');
const DOCS = path.resolve('docs');
const TSCONFIG = path.join('tsconfig.json');

const APP = path.join(SRC, 'app');
const STYLES = path.join(SRC, 'styles');
const INDEX = path.join(SRC, 'index.html');
const POLYFILLS = path.join(SRC, 'polyfills.ts');
const MAIN = path.join(SRC, 'main.ts');
const FAVICON = path.join(ASSETS, 'favicon.png');

const APP_MODULE = path.join(APP, 'app.module#AppModule');

module.exports = {
  PUBLIC_PATH,
  SRC,
  ASSETS,
  DOCS,
  TSCONFIG,
  APP,
  STYLES,
  INDEX,
  POLYFILLS,
  MAIN,
  FAVICON,
  APP_MODULE,
};
