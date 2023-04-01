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
      if (isReady()) injectIframe();
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

function injectIframe() {
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
    const toggleEl = document.createElement('div');
    toggleEl.classList.add('toggle');

    // Left label
    const leftLabel = document.createElement('span');
    leftLabel.classList.add('label-text');
    leftLabel.textContent = 'Code';
    toggleEl.append(leftLabel);

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
    toggleEl.append(labelEl);

    // Left label
    const rightLabel = document.createElement('span');
    rightLabel.classList.add('label-text');
    rightLabel.textContent = 'Preview';
    toggleEl.append(rightLabel);

    // Click
    inputEl.addEventListener('change', () => {
      iframe.classList.toggle('-hide');
    })
    preEl.append(toggleEl);
    _log(`done one`);
  }
}

function scanHtmlBlock() {
  let htmlCodeEls = [];
  const allCodeEls = [...document.querySelectorAll('pre')];
  for (const el of allCodeEls) {
    const language = el.querySelector('span').textContent.toLowerCase();
    if (['html', 'svg'].includes(language) && !el.querySelector('iframe')) {
      htmlCodeEls.push(el);
    }
  }
  return htmlCodeEls;
}
