import './editor';

import { BarCardConfig } from './types';
import { localize } from './localize/localize';
import { mergeDeep, hasConfigOrEntitiesChanged, createConfigArray, getMaxMinBasedOnType } from './helpers';
import { styles } from './styles';
import { CARD_VERSION } from './const';
import { LovelaceCardEditor, HomeAssistant, domainIcon, computeDomain, handleAction } from 'custom-card-helpers';
import { LitElement, PropertyValues, html, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { actionHandler } from './action-handler-directive';

console.info(
  `%c BAR-CARD %c v${CARD_VERSION} `,
  'color: white; font-weight: bold; background: dimgray;',
  'color: dimgray; font-weight: bold; background: white;',
);

interface Section {
  text: string
  color: string
  from: number
  to: number
  icon: boolean
  hide: boolean
}

@customElement('bar-card')
export class BarCard extends LitElement {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement('bar-card-editor') as LovelaceCardEditor;
  }

  public static getStubConfig(): object {
    return {};
  }

  private _hass?: HomeAssistant;
  private _config!: BarCardConfig;
  private _configArray: BarCardConfig[] = [];
  private _stateArray: string[] = [];
  private _animationState: string[] = [];
  private _indicatorToggle: boolean[] = [];
  private _rowAmount = 1;

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    return hasConfigOrEntitiesChanged(this, changedProps, false);
  }

  public setConfig(config: BarCardConfig): void {
    if (!config) {
      throw new Error(localize('common.invalid_configuration'));
    }

    this._config = mergeDeep(
      {
        animation: {
          state: 'off',
          speed: 5,
        },
        color: 'var(--bar-card-color, var(--primary-color))',
        columns: 1,
        direction: 'right',
        max: 100,
        min: 0,
        positions: {
          icon: 'outside',
          indicator: 'outside',
          name: 'inside',
          minmax: 'off',
          value: 'inside',
        },
      },
      config,
    );

    if (this._config.stack == 'horizontal') this._config.columns = this._config.entities.length;
    this._configArray = createConfigArray(this._config);
    this._rowAmount = this._configArray.length / this._config.columns;
  }

  private _showMoreInfo(entityId: string) {
    this.dispatchEvent(
      new CustomEvent('hass-more-info', {
        bubbles: true,
        composed: true,
        detail: { entityId },
      }),
    );
  }

  private _handleAction(ev: CustomEvent): void {
    if (this._hass && ev.detail && ev.detail.action) {
      // Get the config for this specific bar from the target element's dataset
      const configIndex = parseInt((ev.target as HTMLElement).dataset.configIndex || '0');
      const config = this._configArray[configIndex] || this._config;
      
      handleAction(ev.target as HTMLElement, this._hass, config, ev.detail.action);
    }
  }


  protected render(): TemplateResult | void {
    if (!this._config || !this._hass) {
      return html``;
    }

    return html`
      <ha-card
        .header=${this._config.title ? this._config.title : null}
        style="${this._config.entity_row ? 'background: #0000; box-shadow: none;' : ''}"
      >
        <div
          id="states"
          class="card-content"
          style="${this._config.entity_row ? 'padding: 0px;' : ''} ${['up', 'up-reverse', 'down', 'down-reverse'].includes(this._config.direction)
        ? ''
        : 'flex-grow: 0;'}"
        >
          ${this._createBarArray()}
        </div>
      </ha-card>
      ${styles}
    `;
  }

  private _createBarArray(): TemplateResult[] {
    // Create array containing number of bars per row.
    const columnsArray: number[] = [];
    for (let i = 0; i < this._configArray.length; i++) {
      if ((columnsArray.length + 1) * this._config.columns == i) {
        columnsArray.push(this._config.columns);
      }
      if (this._configArray.length == i + 1) {
        columnsArray.push(this._configArray.length - columnsArray.length * this._config.columns);
      }
    }

    // For each row add contained bars based on columnsArray.
    const perRowArray: object[] = [];
    for (let i = 0; i < columnsArray.length; i++) {
      // For every number in columnsArray add bars.
      const currentRowArray: TemplateResult[] = [];
      for (let x = 0; x < columnsArray[i]; x++) {
        const index = i * this._config.columns + x;
        const config = this._configArray[index];
        const state = this._hass!.states[config.entity];
        if (!state) {
          currentRowArray.push(html`
            <div class="warning" style="margin-bottom: 8px;">
              ${localize('common.entity_not_available')}: ${config.entity}
            </div>
          `);
          continue
        }

        // If attribute is defined use attribute value as bar value.
        let entityState;
        if (config.attribute) {
          entityState = state.attributes[config.attribute];
        } else {
          entityState = state.state;
        }

        // Contine if severity hide is defined.
        if (config.severity) {
          if (this._computeSeverityVisibility(entityState, index)) {
            continue;
          }
        }

        // If limit_value is defined limit the displayed value to min and max.
        let max = getMaxMinBasedOnType(this._hass, config.max);
        let min = getMaxMinBasedOnType(this._hass, config.min);
        
        // Ensure max > min relationship; provide fallbacks if needed
        if (max <= min) {
          // If both are 0 (invalid), use default range
          if (max === 0 && min === 0) {
            min = 0;
            max = 100;
          } else {
            // Ensure max is always greater than min
            max = min + Math.max(1, Math.abs(min) * 0.1);
          }
        }
        if (config.limit_value) {
          entityState = Math.min(entityState, max);
          entityState = Math.max(entityState, min);
        }

        // If decimal is defined check if NaN and apply number fix.
        if (!isNaN(Number(entityState))) {
          if (config.decimal == 0) entityState = Number(entityState).toFixed(0);
          else if (config.decimal) entityState = Number(entityState).toFixed(config.decimal);
        }

        // Figure out the bar's pixel height.
        const defaultHeight = Math.round(this._getLineHeightPx() * 2);
        const barHeight: string | number = config.height ?? defaultHeight;

        // Set style variables based on direction. The "-reverse" variants
        // keep their base axis's layout (flexDirection/backgroundMargin/
        // marker orientation) and rely solely on _computePercent() inverting
        // the fill percentage — they must NOT fall through to the
        // pre-switch ('right') defaults below, or they render with the
        // wrong layout while still showing an inverted (and now meaningless)
        // percentage.
        const isVertical = ['up', 'up-reverse', 'down', 'down-reverse'].includes(config.direction);
        let alignItems = 'stretch';
        let backgroundMargin = '0px 0px 0px 13px';
        let barDirection = 'right';
        let flexDirection = 'row';
        let markerDirection = 'left';
        let markerStyle = 'height: 100%; width: 2px;';

        switch (config.direction) {
          case 'right':
          case 'right-reverse':
            barDirection = 'right';
            markerDirection = 'left';
            break
          case 'left':
          case 'left-reverse':
            barDirection = 'left';
            markerDirection = 'right';
            break
          case 'up':
          case 'up-reverse':
            backgroundMargin = '0px';
            barDirection = 'top';
            flexDirection = 'column-reverse';
            markerDirection = 'bottom';
            markerStyle = 'height: 2px; width: 100%;';
            break
          case 'down':
          case 'down-reverse':
            backgroundMargin = '0px';
            barDirection = 'bottom';
            flexDirection = 'column';
            markerDirection = 'top';
            markerStyle = 'height: 2px; width: 100%;';
            break
        }

        // Set icon position html.
        let iconOutside;
        let iconInside;
        let icon;
        if (this._computeSeverityIcon(entityState, index)) {
          icon = this._computeSeverityIcon(entityState, index);
        } else if (config.icon) {
          icon = config.icon;
        } else if (state.attributes.icon) {
          icon = state.attributes.icon;
        } else {
          icon = domainIcon(computeDomain(config.entity), entityState);
        }
        switch (config.positions.icon) {
          case 'outside':
            iconOutside = html`
              <bar-card-iconbar>
                <ha-icon icon="${icon}"></ha-icon>
              </bar-card-iconbar>
            `;
            break
          case 'inside':
            iconInside = html`
              <bar-card-iconbar>
                <ha-icon icon="${icon}"></ha-icon>
              </bar-card-iconbar>
            `;
            backgroundMargin = '0px';
            break
          case 'off':
            backgroundMargin = '0px';
            break
        }

        // Check for configured name otherwise use friendly name.
        const name = config.name ? config.name : state.attributes.friendly_name;

        // Set name html based on position.
        let nameOutside;
        let nameInside;
        switch (config.positions.name) {
          case 'outside':
            nameOutside = html`
              <bar-card-name
                class="${config.entity_row ? 'name-outside' : ''}"
                style="${isVertical ? '' : config.width ? `width: calc(100% - ${config.width});` : ''}"
                >${name}</bar-card-name
              >
            `;
            backgroundMargin = '0px';
            break
          case 'inside':
            nameInside = html`
              <bar-card-name>${name}</bar-card-name>
            `;
            break
          case 'off':
            break;
        }

        // Check for configured unit of measurement otherwise use attribute value.
        let unitOfMeasurement;
        if (isNaN(Number(entityState))) {
          unitOfMeasurement = '';
        } else {
          if (config.unit_of_measurement) {
            unitOfMeasurement = config.unit_of_measurement;
          } else {
            unitOfMeasurement = state.attributes.unit_of_measurement;
          }
        }

        // Set min and max html based on position.
        let minMaxOutside;
        let minMaxInside;
        switch (config.positions.minmax) {
          case 'outside':
            minMaxOutside = html`
              <bar-card-min>${max}${unitOfMeasurement}</bar-card-min>
              <bar-card-divider>/</bar-card-divider>
              <bar-card-max>${max}${unitOfMeasurement}</bar-card-max>
            `;
            break
          case 'inside':
            minMaxInside = html`
              <bar-card-min class="${isVertical ? 'min-direction-up' : 'min-direction-right'}"
                >${min}${unitOfMeasurement}</bar-card-min
              >
              <bar-card-divider>/</bar-card-divider>
              <bar-card-max> ${max}${unitOfMeasurement}</bar-card-max>
            `;
            break
          case 'off':
            break;
        }

        // Set value html based on position.
        let valueOutside;
        let valueInside;
        switch (config.positions.value) {
          case 'outside':
            valueOutside = html`
              <bar-card-value class="${isVertical ? 'value-direction-up' : 'value-direction-right'}"
                >${config.complementary ? max - entityState : entityState} ${unitOfMeasurement}</bar-card-value
              >
            `;
            break
          case 'inside':
            valueInside = html`
              <bar-card-value
                class="${config.positions.minmax == 'inside'
                ? ''
                : config.direction == 'up'
                  ? 'value-direction-up'
                  : 'value-direction-right'}"
                >${config.complementary ? max - entityState : entityState} ${unitOfMeasurement}</bar-card-value
              >
            `;
            break
          case 'off':
            backgroundMargin = '0px';
            break
        }

        // Set indicator and animation state based on value change.
        let indicatorText = '';
        if (entityState > this._stateArray[index]) {
          indicatorText = '▲';
          if (config.direction == 'up') this._animationState[index] = 'animation-increase-vertical';
          else this._animationState[index] = 'animation-increase';
        } else if (entityState < this._stateArray[index]) {
          indicatorText = '▼';
          if (config.direction == 'up') this._animationState[index] = 'animation-decrease-vertical';
          else this._animationState[index] = 'animation-decrease';
        } else {
          this._animationState[index] = this._animationState[index];
        }
        if (isNaN(Number(entityState))) {
          indicatorText = '';
        }

        // Set bar color.
        const barColor = this._computeBarColor(entityState, index);

        // Set indicator html based on position.
        let indicatorOutside;
        let indicatorInside;
        const fadeName = this._indicatorToggle[index] ? 'bar-card-indicator-fade-a' : 'bar-card-indicator-fade-b';
        const indicatorStyleFade = indicatorText ? `opacity:1; animation: ${fadeName} 2s forwards;` : '';
        switch (config.positions.indicator) {
          case 'outside':
            indicatorOutside = html`
              <bar-card-indicator
                class="${config.direction == 'up' ? '' : 'indicator-direction-right'}"
                style="--bar-color: ${barColor}; ${indicatorStyleFade}"
                >${indicatorText}</bar-card-indicator
              >
            `;
            break
          case 'inside':
            indicatorInside = html`
              <bar-card-indicator style="--bar-color: ${barColor}; ${indicatorStyleFade}">${indicatorText}</bar-card-indicator>
            `;
            break
          case 'off':
            break;
        }

        // Set bar percent and marker percent based on value difference.
        const barPercent = this._computePercent(entityState, index, max, min);
        const targetMarkerPercent = this._computePercent(config.target, index, max, min);
        let targetStartPercent = barPercent;
        let targetEndPercent = this._computePercent(config.target, index, max, min);
        if (targetEndPercent < targetStartPercent) {
          targetStartPercent = targetEndPercent;
          targetEndPercent = barPercent;
        }

        // Set bar width if configured. bar-card-background has flex-grow: 1
        // (see styles.ts) so it normally stretches to fill the row — that
        // would silently override an explicit width, so pin it with
        // flex-grow: 0 whenever a width is configured.
        let barWidth = '';
        if (config.width) {
          alignItems = 'center';
          barWidth = `width: ${config.width}; flex-grow: 0;`;
        }

        // Set animation state inside array.
        const animation = this._animationState[index];
        let animationDirection = 'right';
        let animationPercent = barPercent * 100;
        let animationClass = 'animationbar-horizontal';
        if (animation == 'animation-increase-vertical' || animation == 'animation-decrease-vertical') {
          animationDirection = 'bottom';
          animationClass = 'animationbar-vertical';
          animationPercent = (100 - barPercent) * 100;
        }

        // Add current bar to row array.
        currentRowArray.push(html`
          <bar-card-card
            style="flex-direction: ${flexDirection}; align-items: ${alignItems};"
          >
            ${iconOutside} ${indicatorOutside} ${nameOutside}
            <bar-card-background
              style="margin: ${backgroundMargin}; height: ${barHeight}${typeof barHeight === 'number' ? 'px' : ''}; ${barWidth}"
              data-config-index="${index}"
              ${actionHandler(this, {
                hasDoubleClick: config.double_tap_action !== undefined,
              })}
              @action=${this._handleAction}
            >
              <bar-card-backgroundbar style="--bar-color: ${barColor};"></bar-card-backgroundbar>
              ${config.animation.state === 'on'
                ? html`
                    <bar-card-animationbar
                      style="animation: ${animation} ${config.animation.speed}s infinite ease-out;
                             --bar-percent: ${animationPercent}%;
                             --bar-color: ${barColor};
                             --animation-direction: ${animationDirection};"
                      class="${animationClass}"
                    ></bar-card-animationbar>
                  `
                : ''}
              <bar-card-currentbar
                style="--bar-color: ${barColor};
                       --bar-percent: ${barPercent}%;
                       --bar-direction: ${barDirection}"
              ></bar-card-currentbar>
              ${config.target
                ? html`
                    <bar-card-targetbar
                      style="--bar-color: ${barColor};
                             --bar-percent: ${targetStartPercent}%;
                             --bar-target-percent: ${targetEndPercent}%;
                             --bar-direction: ${barDirection};"
                    ></bar-card-targetbar>
                    <bar-card-markerbar
                      style="--bar-color: ${barColor};
                             --bar-target-percent: ${targetMarkerPercent}%;
                             ${markerDirection}: calc(${targetMarkerPercent}% - 1px);
                             ${markerStyle}"
                    ></bar-card-markerbar>
                  `
                : ''}
              <bar-card-contentbar
                class="${config.direction === 'up'
                  ? 'contentbar-direction-up'
                  : 'contentbar-direction-right'}"
              >
                ${iconInside} ${indicatorInside} ${nameInside} ${minMaxInside} ${valueInside}
              </bar-card-contentbar>
            </bar-card-background>
            ${minMaxOutside} ${valueOutside}
          </bar-card-card>
        `);


        // Set entity state inside array if changed.
        if (entityState !== this._stateArray[index]) {
          this._stateArray[index] = entityState;
        }

        // toggle fade animation name for next time
        this._indicatorToggle[index] = !this._indicatorToggle[index];
      }

      // Add all bars for this row to array.
      perRowArray.push(currentRowArray);
    }

    // Create array containing all rows.
    let rowFlexDirection = 'column';
    if (this._config.columns || this._config.stack) rowFlexDirection = 'row';

    const rowArray: TemplateResult[] = [];
    for (const row of perRowArray) {
      rowArray.push(html`
        <bar-card-row style="flex-direction: ${rowFlexDirection};">${row}</bar-card-row>
      `);
    }
    return rowArray;
  }

  private _computeBarColor(value: string, index: number): string {
    const config = this._configArray[index];
    let barColor: string
    if (config.severity) {
      barColor = this._computeSeverityColor(value, index);
    } else if (value == 'unavailable') {
      barColor = `var(--bar-card-disabled-color, ${config.color})`;
    } else {
      barColor = config.color;
    }
    return barColor;
  }

  private _computeSeverityColor(value: string, index: number): string {
    const config = this._configArray[index];
    const numberValue = Number(value);
    const sections = config.severity;
    let color: undefined | string;

    if (isNaN(numberValue)) {
      sections.forEach((section: Section) => {
        if (value == section.text) {
          color = section.color;
        }
      });
    } else {
      sections.forEach((section: Section) => {
        if (numberValue >= section.from && numberValue <= section.to) {
          color = section.color;
        }
      });
    }

    if (color == undefined) color = config.color;
    return color;
  }

  private _computeSeverityVisibility(value: string, index: number): boolean {
    const config = this._configArray[index];
    const numberValue = Number(value);
    const sections = config.severity;
    let hide = false;

    if (isNaN(numberValue)) {
      sections.forEach((section: Section) => {
        if (value == section.text) {
          hide = section.hide;
        }
      });
    } else {
      sections.forEach((section: Section) => {
        if (numberValue >= section.from && numberValue <= section.to) {
          hide = section.hide;
        }
      });
    }
    return hide;
  }

  private _computeSeverityIcon(value: string, index: number): string | boolean {
    const config = this._configArray[index];
    const numberValue = Number(value);
    const sections = config.severity;
    let icon = false;

    if (!sections) return false;

    if (isNaN(numberValue)) {
      sections.forEach((section: Section) => {
        if (value == section.text) {
          icon = section.icon;
        }
      });
    } else {
      sections.forEach((section: Section) => {
        if (numberValue >= section.from && numberValue <= section.to) {
          icon = section.icon;
        }
      });
    }
    return icon;
  }

  private _computePercent(value: string, index: number, max: number, min: number): number {
    const config = this._configArray[index];
    const numberValue = Number(value);

    if (value == 'unavailable') return 0;
    if (isNaN(numberValue)) return 100;
    
    // Prevent division by zero when max equals min
    if (max === min) {
      return numberValue >= max ? 100 : 0;
    }

    switch (config.direction) {
      case 'right-reverse':
      case 'left-reverse':
      case 'up-reverse':
      case 'down-reverse':
        return 100 - (100 * (numberValue - min)) / (max - min);
      default:
        return (100 * (numberValue - min)) / (max - min);
    }
  }

  // Always returns a pixel value; never throws or NaNs
  private _getLineHeightPx(): number {
    try {
      const s = getComputedStyle(document.body);

      // 1. Pixel value most browsers provide
      const px = parseFloat(s.lineHeight);
      if (!isNaN(px) && isFinite(px)) return px;

      // 2. Multiplier × font‑size
      const font = parseFloat(s.fontSize) || 14;
      const mult = parseFloat(s.getPropertyValue('--ha-line-height-normal'));
      if (!isNaN(mult) && isFinite(mult)) return font * mult;
    } catch { /* ignore and fall back */ }

    // 3. Absolute fallback keeps the card visible
    return 20;
  }


  getCardSize(): number {
    if (this._config.height) {
      const heightString = this._config.height.toString();
      const cardSize = Math.trunc((Number(heightString.replace('px', '')) / 50) * this._rowAmount);
      return cardSize + 1;
    } else {
      return this._rowAmount + 1;
    }
  }

  public set hass(value: HomeAssistant | undefined) {
    const oldVal = this._hass;
    this._hass = value;
    // Trigger reactive update for 'hass'
    this.requestUpdate('hass', oldVal);
  }

  public get hass(): HomeAssistant | undefined {
    return this._hass;
  }
}
