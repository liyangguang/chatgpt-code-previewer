function _log(message) {
  console.debug('[ChatGPT HTML viewer]', message);
}

(function start() {
  _log('start')
  listenToResize();
})();

// Using resize as a signal of new message
function listenToResize() {
  const resizeObserver = new ResizeObserver(() => {
    _log('resize');
    setTimeout(() => {
      if (isReady()) injectUI();
    }, 1000)
  });
  
  // Not the best selector. But hard to find a good one in tailwind.
  const scrollEl = document.querySelector('main > div > div > div > div');
  resizeObserver.observe(scrollEl);
  _log('listener attached')
}

function isReady() {
  // The current message finished rendering.
  return document.querySelector('form button').textContent.includes('Regenerate response');
}

function injectUI() {
  const preEls = scanHtmlBlock();
  _log(`found: ${preEls.length}`);
  for (const preEl of preEls) {
    preEl.classList.add('yg-gpt-html');

    // Inject iframe
    const code = preEl.querySelector('code').textContent;
    const iframe = document.createElement('iframe');
    iframe.srcdoc = code;
    preEl.append(iframe)

    // Inject toggle button
    const controls = document.createElement('div');
    controls.classList.add('toggle');

    // Left label
    const leftLabel = document.createElement('span');
    leftLabel.classList.add('label-text');
    leftLabel.textContent = 'Code';
    controls.append(leftLabel);

    // Input
    const labelEl = document.createElement('label');
    labelEl.classList.add('switch');
    const inputEl = document.createElement('input');
    inputEl.type = 'checkbox';
    inputEl.checked = true;
    const insideSpanEl = document.createElement('span');
    insideSpanEl.classList.add('slider');
    insideSpanEl.classList.add('round');
    labelEl.append(inputEl);
    labelEl.append(insideSpanEl);
    inputEl.addEventListener('change', () => {
      iframe.classList.toggle('-hide');
    })
    controls.append(labelEl);

    // Left label
    const rightLabel = document.createElement('span');
    rightLabel.classList.add('label-text');
    rightLabel.textContent = 'Preview';
    controls.append(rightLabel);

    const codepenEl = document.createElement('a');
    codepenEl.textContent = 'Open in CodePen';
    codepenEl.href = 'https://codepen.io/pen/';
    codepenEl.target = '_blank';
    codepenEl.addEventListener('click', () => {
      const type = preEl.querySelector('span').textContent.toLowerCase();
      const {htmlString, styleString, scriptString} = parseCode(code, type);
      console.log('htmlString', htmlString);
      console.log('styleString', styleString);
      console.log('scriptString', scriptString);
      // TODO: save to storage
    });
    controls.append(codepenEl);

    preEl.append(controls);
    _log(`done one`);
  }
}

function scanHtmlBlock() {
  let htmlCodeEls = [];
  const allCodeEls = [...document.querySelectorAll('pre')];
  for (const el of allCodeEls) {
    const language = el.querySelector('span').textContent.toLowerCase();
    if (['html', 'svg', 'xml'].includes(language) && !el.querySelector('iframe')) {
      htmlCodeEls.push(el);
    }
  }
  return htmlCodeEls;
}

function parseCode(code, type) {
  switch (type) {
    case 'html': {
      const tempFrame = document.createElement('html');
      tempFrame.innerHTML = code;
      const styleEls = [...tempFrame.querySelectorAll('style')];
      const styleString = styleEls.map((el) => el.textContent).join('\n');
  
      const scriptEls = [...tempFrame.querySelectorAll('script')];
      const scriptString = scriptEls.map((el) => el.textContent).join('\n');
  
      for (const el of [...styleEls, ...scriptEls]) {
        el.remove();
      }
      const htmlString = tempFrame.querySelector('body').innerHTML;
      return {htmlString, styleString, scriptString}
    }
    case 'svg':
    case 'xml':
    default:
      return {htmlString: code, styleString: '', scriptString: ''};
  }
}
