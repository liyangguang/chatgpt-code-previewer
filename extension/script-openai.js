(function start() {
  _log('Start scanning ChatGPT code blocks.')
  listenToChange('form button.btn.relative.btn-neutral', 'pre', 'div:has(> code)');
})();
