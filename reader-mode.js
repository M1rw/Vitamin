function isReaderEligible(url) {
  if (typeof url !== 'string' || url.length > 4096) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && Boolean(parsed.hostname);
  } catch {
    return false;
  }
}

function buildReaderModeScript() {
  return `(() => {
    const selectedText = window.getSelection ? window.getSelection().toString().trim() : '';
    const candidates = [...document.querySelectorAll('article, main, [role="main"], .article, .post, .entry-content, .content')];
    const candidate = candidates
      .map((element) => ({ element, text: (element.innerText || '').trim() }))
      .filter((entry) => entry.text.length > 280)
      .sort((left, right) => right.text.length - left.text.length)[0];
    const text = selectedText || candidate?.text || (document.body?.innerText || '').trim();
    if (text.length < 280) return false;
    const title = (document.title || location.hostname).trim().slice(0, 240);
    document.head.replaceChildren();
    const style = document.createElement('style');
    style.textContent = 'html,body{margin:0;background:#f7f4ed;color:#1b1b1b;font-family:Georgia,serif}main{max-width:740px;margin:0 auto;padding:64px 24px 96px}h1{font-family:ui-serif,Georgia,serif;font-size:2.25rem;line-height:1.16;margin:0 0 12px}p.meta{font:12px system-ui,sans-serif;color:#6b655b;margin:0 0 36px}article{font-size:1.18rem;line-height:1.78;white-space:pre-wrap}';
    document.head.appendChild(style);
    document.body.replaceChildren();
    const main = document.createElement('main');
    const heading = document.createElement('h1');
    heading.textContent = title;
    const meta = document.createElement('p');
    meta.className = 'meta';
    meta.textContent = 'Vitamin Reader • Reload or toggle Reader to return to the original page';
    const article = document.createElement('article');
    article.textContent = text;
    main.append(heading, meta, article);
    document.body.appendChild(main);
    return true;
  })()`;
}

module.exports = { buildReaderModeScript, isReaderEligible };
