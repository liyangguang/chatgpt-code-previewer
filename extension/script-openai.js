function _log(message) {
  console.debug('[ChatGPT HTML viewer]', message);
}

(function start() {
  _log('start')
  listenToChange();
})();

function listenToChange() {
  _log('listening to change')
  setInterval(() => {
    if (document.querySelector('form button').textContent.includes('Regenerate response')) {
      injectUI();
    }
  }, 1000);
}

function injectUI() {
  const preEls = scanHtmlBlock();
  _log(`found: ${preEls.length}`);
  for (const preEl of preEls) {
    preEl.classList.add('yg-gpt-html');
    const code = preEl.querySelector('code').textContent;
    const type = preEl.querySelector('span').textContent.toLowerCase();

    // Inject iframe
    const iframeEl = createElement('iframe', {srcdoc: code});
    preEl.append(iframeEl);

    const toggleEl = generateToggle(() => {
      iframeEl.classList.toggle('-hide');
    });

    const codepenEl = generateCodepenLink(code, type);

    const controlRow = preEl.querySelector('div > div');
    controlRow.classList.add('control-row');
    const titleEl = controlRow.querySelector('span');
    titleEl.classList.add('control-title');
    titleEl.after(toggleEl, codepenEl);
    _log(`done one`);
  }
}

function generateToggle(eventHandler) {
  const toggleEl = createElement('div', {}, ['toggle']);

  // Left label
  toggleEl.append(createElement('span', {textContent: 'Code'}, ['label-text']));

  // Input
  const labelEl = createElement('label', {}, ['switch']);
  const inputEl = createElement('input', {type: 'checkbox', checked: true});
  const insideSpanEl = createElement('span', {}, ['slider', 'round']);
  labelEl.append(inputEl);
  labelEl.append(insideSpanEl);
  toggleEl.append(labelEl);

  // Left label
  toggleEl.append(createElement('span', {textContent: 'Preview'}, ['label-text']));


  inputEl.addEventListener('change', eventHandler);
  return toggleEl;
}

function generateCodepenLink(code, type) {
  const codeContent = JSON.stringify({
    title: 'New Pen by ChatGPT Code Previewer',
    description: 'New Pen by ChatGPT Code Previewer Chrome extension',
    ...parseCode(code, type),
  });
  const formEl = createElement('form', {action: 'https://codepen.io/pen/define', method: 'POST', target: '_blank'});
  const hiddenEl = createElement('input', {type: 'hidden', name: 'data', value: codeContent});
  const clickEl = createElement('button', {textContent: 'Open in CodePen'}, ['codepen']);
  formEl.append(hiddenEl);
  formEl.append(clickEl);

  return formEl;
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
      return {
        html: removeExtraIndentation(htmlString),
        css: removeExtraIndentation(styleString),
        js: removeExtraIndentation(scriptString),
      };
    }
    case 'svg':
    case 'xml':
    default:
      return {
        html: removeExtraIndentation(code),
        css: '',
        js: '',
      };
  }
}

function removeExtraIndentation(codeString) {
  const originalLines = codeString.split('\n');
  const lines = originalLines[0].trim().length ? originalLines : originalLines.slice(1);
  const indentationSize = (lines[0] || '').match(/^ */)?.[0].length;
  return lines.map((line) => line.replace(new RegExp(`^ {${indentationSize}}`), '')).join('\n');
}

function createElement(tag, attributes, classes = [], innerHTML = '') {
  const element = document.createElement(tag);
  for (const [key, value] of Object.entries(attributes)) {
    element[key] = value;
  }
  for (const classname of classes) {
    element.classList.add(classname);
  }
  if (innerHTML) {
    element.innerHTML = innerHTML;
  }
  return element;
}
