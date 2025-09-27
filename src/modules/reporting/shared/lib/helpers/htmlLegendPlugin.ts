import type { Chart, LegendItem } from 'chart.js';

export const htmlLegendPlugin = {
  id: 'htmlLegend',
  afterUpdate(chart: Chart) {
    const legendContainer = document.getElementById('legend-container');

    if (!legendContainer) return;

    const ul = legendContainer.querySelector('ul');

    if (!ul) return;

    // Remove old legend items
    while (ul.firstChild) {
      ul.firstChild.remove();
    }

    // Reuse the built-in legendItems generator
    const labels = chart.options?.plugins?.legend?.labels;

    if (!labels || !labels.generateLabels) return;

    const items = labels.generateLabels(chart) as LegendItem[];

    items.forEach((item: LegendItem) => {
      const li = document.createElement('li');
      li.style.cssText = `
          display: flex;
          flex-direction: row;
          align-items: center;
        `;

      // Color box
      const boxSpan = document.createElement('span');
      boxSpan.style.cssText = `
          width: 10px;
          height: 10px;
  
          flex-shrink: 0;
  
          margin-right: 4px;
          background: ${item.fillStyle};
          border-radius: 50%;
        `;

      // Text
      const textContainer = document.createElement('p');
      textContainer.style.cssText = `
        margin: 0;
        padding: 0;
  
        font-weight: 600;
        font-size: 12px;
        line-height: 17px;
        color: var(--button-text-graphite-primary-text);
        `;

      const data = item.text.split('|');
      const fullNameData = data[2];

      if (fullNameData) {
        const text = document.createTextNode(fullNameData);
        textContainer.appendChild(text);
      }

      li.appendChild(boxSpan);
      li.appendChild(textContainer);
      ul.appendChild(li);
    });
  },
};
