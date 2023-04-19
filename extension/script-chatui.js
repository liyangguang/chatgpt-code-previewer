(function start() {
  _log('Start scanning ChatUI code blocks.')
  listenToChange('main div.bg-gradient-to-b button', '.codeblock', 'pre');
})();
