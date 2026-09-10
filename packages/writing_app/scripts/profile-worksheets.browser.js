// Run with Playwright CLI run-code --filename (see docs/worksheet-performance-review.md).
// Change phase to keep before/after artifacts separate; use the same browser and viewport.
async (page) => {
  const phase = 'audit';
  const query = params => Object.entries(params).map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(v)).join('&');
  const base = 'http://127.0.0.1:5181/';
  const pangram = 'the quick brown fox jumps over the lazy dog';
  const all = Object.fromEntries(['top', 'practice'].flatMap(scope =>
    ['DirectionalDash', 'TurningPoint', 'StartArrow', 'DrawOrderNumber', 'MidpointArrow']
      .map(kind => [scope + kind, 'true'])));
  const cases = [
    ['cursive-default', 'cursive', {}],
    ['cursive-turning-arrows', 'cursive', {topDirectionalDash: false, topTurningPoint: true, topStartArrow: true, topMidpointArrow: true}],
    ['cursive-sentence', 'cursive', {text: pangram}],
    ['cursive-sentence-turning-arrows', 'cursive', {text: pangram, topDirectionalDash: false, topTurningPoint: true, topStartArrow: true, topMidpointArrow: true}],
    ['cursive-dense', 'cursive', {text: pangram, practiceSize: 14, practiceRepeats: 6, ...all}],
    ['letter-default', 'single_letter', {}],
    ['letter-print', 'single_letter', {letter: 'm', style: 'print'}],
    ['letter-dense', 'single_letter', {letter: 'm', practiceSize: 14, practiceRepeats: 14, ...all}],
  ];
  await page.setViewportSize({width: 1440, height: 1000});
  const results = [];
  for (const [name, generator, params] of cases) {
    const url = base + generator + '_worksheet_generator/?' + query({previewZoom: '70', ...params});
    await page.goto(url);
    await page.locator('.worksheet-word').first().waitFor();
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const measurement = await page.evaluate(async () => {
      const slider = document.querySelector('#stroke-width-slider');
      const frame = () => new Promise(resolve => requestAnimationFrame(resolve));
      const runs = [];
      for (let i = 0; i < 18; i++) {
        slider.value = i % 2 ? '54' : '56';
        const start = performance.now();
        slider.dispatchEvent(new Event('input', {bubbles: true}));
        const renderMs = performance.now() - start;
        // Force style/layout separately; rAF callbacks run before paint.
        document.querySelector('#worksheet-page').getBoundingClientRect();
        const layoutMs = performance.now() - start - renderMs;
        await frame();
        await frame();
        if (i >= 3) runs.push({renderMs, layoutMs, twoFrameMs: performance.now() - start});
      }
      const sheet = document.querySelector('#worksheet-page');
      const {estimateWorksheetVectorPrintComplexity} = await import('/src/worksheet-print.ts');
      const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(sheet.outerHTML)))].map(x => x.toString(16).padStart(2, '0')).join('');
      return {runs, hash, nodes: sheet.querySelectorAll('*').length, markupBytes: new TextEncoder().encode(sheet.outerHTML).length, primitives: estimateWorksheetVectorPrintComplexity(sheet), status: document.querySelector('#worksheet-status').textContent};
    });
    await page.locator('#worksheet-page').screenshot({path: `output/playwright/${phase}-${name}.png`});
    const pdf = await page.pdf({path: `output/playwright/${phase}-${name}.pdf`, preferCSSPageSize: true, printBackground: true});
    results.push({name, params, ...measurement, pdfBytes: pdf.length});
  }
  const letters = [];
  for (const style of ['pre-cursive', 'print']) {
    for (const letter of 'abcdefghijklmnopqrstuvwxyz') {
      await page.goto(base + 'single_letter_worksheet_generator/?' + query({letter, style, previewZoom: '70', ...all}));
      await page.locator('.worksheet-word').first().waitFor();
      const hash = await page.evaluate(async () => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(document.querySelector('#worksheet-page').outerHTML)))].map(x => x.toString(16).padStart(2, '0')).join(''));
      letters.push({style, letter, hash});
    }
  }
  return {phase, browser: await page.context().browser().version(), results, letters};
}
