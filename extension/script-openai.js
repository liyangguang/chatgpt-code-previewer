(function start() {
  _log('Start scanning ChatGPT code blocks.')
  listenToChange('main > div > form button', 'pre', 'div:has(> code)');
})();
