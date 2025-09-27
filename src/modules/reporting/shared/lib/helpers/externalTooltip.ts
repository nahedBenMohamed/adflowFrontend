import { generalSettingsStore } from '@/app';
import { AvatarUtil, Currency, currencyFormatterHelper } from '@/shared';
import type { Chart, TooltipModel } from 'chart.js';

export const externalTooltip = ({
  context,
  isAmount,
}: {
  context: { chart: Chart; tooltip: TooltipModel<'pie' | 'doughnut'> };
  isAmount: boolean;
}): void => {
  const tooltipModel = context.tooltip;
  const title = tooltipModel.title ? tooltipModel.title[0] : '';

  if (!title) return;

  const data = title.split('|');

  const [avatarUrl, initials, fullNameData, percentData] = data;

  const valueData = data[4]
    ? isAmount
      ? currencyFormatterHelper.format({
          value: Number(data[4]),
          currency: generalSettingsStore.accountSettings?.currency ?? Currency.USD,
        })
      : data[4]
    : '';

  const isOthers = !avatarUrl && !initials;

  let tooltipEl = document.getElementById('chartjs-tooltip');

  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.id = 'chartjs-tooltip';

    document.body.appendChild(tooltipEl);
  }

  // hide if no tooltip
  if (tooltipModel.opacity === 0) {
    tooltipEl.style.opacity = '0';

    return;
  }

  // set caret position
  tooltipEl.classList.remove('above', 'below', 'no-transform');

  if (tooltipModel.yAlign) {
    tooltipEl.classList.add(tooltipModel.yAlign);
  } else {
    tooltipEl.classList.add('no-transform');
  }

  // set text
  tooltipEl.innerHTML = `
              ${
                isOthers
                  ? ''
                  : `<div>
                ${
                  avatarUrl ? `<img src=${avatarUrl} alt={${fullNameData} avatar}></img>` : initials
                }
              </div>`
              }
              <span>${fullNameData}</span>
              <hr></hr>
              <p>${percentData}</p>
              <hr></hr>
              <p id='value-data'>${valueData}</p>
            `;

  const avatarWrapper = tooltipEl.querySelector('div');

  if (avatarWrapper)
    avatarWrapper.style.cssText = `
              width: 28px;
              height: 28px;
  
              display: flex;
              justify-content: center;
              align-items: center;
              flex-shrink: 0;
              
              background: ${AvatarUtil.getInitialsBackground(initials ?? '')};
              border-radius: 50%;
            `;

  const avatar = tooltipEl.querySelector('img');

  if (avatar)
    avatar.style.cssText = `
              width: 28px;
              height: 28px;
  
              border-radius: 50%;
            `;

  const fullName = tooltipEl.querySelector('span');

  if (fullName)
    fullName.style.cssText = `
              max-width: 104px;

              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            `;

  const value = tooltipEl.querySelector('#value-data');

  if (value)
    (value as HTMLParagraphElement).style.cssText = `
              max-width: 112px;

              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            `;

  const delimiters = tooltipEl.querySelectorAll('hr');

  delimiters.forEach(
    d =>
      (d.style.cssText = `
            height: 12px;
            border-radius: 2px;
            border: 1px solid var(--graphite-graphite-680);
          `)
  );

  const position = context.chart.canvas.getBoundingClientRect();

  // display, position, and set styles for font
  const tooltipWidth = tooltipEl.clientWidth;
  const tooltipHeight = 36;

  const tooltipLeftPosition =
    position.left + window.scrollX + tooltipModel.caretX - tooltipWidth / 2;
  const tooltipTopPosition = position.top + window.scrollY + tooltipModel.caretY - tooltipHeight;

  tooltipEl.style.cssText = `
          pointer-events: none;

          position: absolute;
          left: ${tooltipLeftPosition}px;
          top: ${tooltipTopPosition}px;
  
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 4px;
  
          font-size: 12px;
          font-weight: 600;
          line-height: 17px;
          color: var(--graphite-graphite-680);
  
          opacity: 1;
          padding: 4px 8px;
          border-radius: var(--border-radius-element);
          background-color: var(--primary-statuses-white-0);
          box-shadow: 0px 1px 2px 0px #D0DAEB, 0px 0px 2px 0px #EEF4FE;
        `;
};
