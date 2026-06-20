import { BarCardConfig } from './types';
import { createEditorConfigArray, arrayMove, hasConfigOrEntitiesChanged } from './helpers';
import { LovelaceCardEditor, HomeAssistant, fireEvent } from 'custom-card-helpers';
import { LitElement, PropertyValues, CSSResult, css, html, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('bar-card-editor')
export class BarCardEditor extends LitElement implements LovelaceCardEditor {
  public hass?: HomeAssistant;
  private _config: BarCardConfig = {
    animation: undefined,
    attribute: undefined,
    color: '',
    columns: 0,
    complementary: false,
    decimal: undefined,
    direction: '',
    entities: undefined,
    entity_row: false,
    entity: '',
    height: '',
    history: undefined,
    icon: undefined,
    limit_value: false,
    max: '',
    min: '',
    name: '',
    positions: undefined,
    severity: undefined,
    stack: '',
    target: undefined,
    title: '',
    type: '',
    unit_of_measurement: '',
    width: ''
  };
  private _toggle?: boolean;
  private _dragEntityIndex: number | null = null;
  private _dragOriginalIndex: number | null = null;
  private _dragRowElement: HTMLElement | null = null;
  private _dragStartClientY = 0;
  private _dragLastDeltaY = 0;
  private _dragRowOriginalRects: DOMRect[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _configArray: any[] = [];
  private _entityOptionsArray: object[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _options: any;

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    return hasConfigOrEntitiesChanged(this, changedProps, true);
  }

  public setConfig(config: BarCardConfig): void {
    // Home Assistant freezes the lovelace config it passes in; a shallow
    // spread still aliases nested objects/arrays (e.g. entities) to that
    // frozen original, so mutating them later throws "object is not
    // extensible". Deep clone to fully detach from the frozen source.
    this._config = JSON.parse(JSON.stringify(config));

    if (!config.entity && !config.entities) {
      this._config.entity = 'none';
    }
    // Only bootstrap `entities` from the single-`entity` field once: if
    // `entities` already holds real data, this `entity` (often the leftover
    // 'none' sentinel from the branch above) must not keep overwriting it.
    if (this._config.entity && !this._config.entities) {
      this._configArray.push({ entity: config.entity });
      this._config.entities = [{ entity: config.entity }];
    }

    this._configArray = createEditorConfigArray(this._config);

    // Drop these if a render call left them as an empty placeholder object.
    // The single fireEvent at the end of this method already announces the
    // cleaned-up config — firing here too just spawns extra config-changed
    // round-trips that, combined with renders recreating the empty
    // placeholder, never settle.
    if (this._config.animation && Object.entries(this._config.animation).length === 0) {
      delete this._config.animation;
    }
    if (this._config.positions && Object.entries(this._config.positions).length === 0) {
      delete this._config.positions;
    }
    if (this._config.history && Object.entries(this._config.history).length === 0) {
      delete this._config.history;
    }

    for (const entityConfig of this._configArray) {
      if (entityConfig.animation) {
        if (Object.entries(entityConfig.animation).length === 0) {
          delete entityConfig.animation;
        }
      }
      if (entityConfig.positions) {
        if (Object.entries(entityConfig.positions).length === 0) {
          delete entityConfig.positions;
        }
      }
      if (entityConfig.history) {
        if (Object.entries(entityConfig.history).length === 0) {
          delete entityConfig.history;
        }
      }
    }
    this._config.entities = this._configArray;
    // Do NOT fireEvent('config-changed') here unconditionally: this._config
    // is a fresh object reference on every single setConfig() call (see the
    // JSON deep clone above). Home Assistant's own change detection appears
    // to be reference-based, so echoing a brand-new reference back up on
    // every call — including calls that are themselves just HA syncing this
    // editor after OUR previous fireEvent — creates an infinite setConfig()
    // <-> config-changed ping-pong. User-driven changes already fire their
    // own config-changed from the handler that made the change (see
    // _valueChanged, _addEntity, _removeEntity, etc.).

    const barOptions = {
      icon: 'format-list-numbered',
      name: 'Bar',
      secondary: 'Bar settings.',
      show: false,
    };

    const valueOptions = {
      icon: 'numeric',
      name: 'Value',
      secondary: 'Value settings.',
      show: false,
    };

    const cardOptions = {
      icon: 'card-bulleted',
      name: 'Card',
      secondary: 'Card settings.',
      show: false,
    };

    const positionsOptions = {
      icon: 'arrow-expand-horizontal',
      name: 'Positions',
      secondary: 'Set positions of card elements.',
      show: false,
    };

    const actionsOptions = {
      icon: 'gesture-tap',
      name: 'Actions',
      secondary: 'Coming soon... Use code editor for Actions.',
      show: false,
    };

    const severityOptions = {
      icon: 'exclamation-thick',
      name: 'Severity',
      secondary: 'Define bar colors based on value.',
      show: false,
    };

    const animationOptions = {
      icon: 'animation',
      name: 'Animation',
      secondary: 'Define animation settings.',
      show: false,
    };

    const historyOptions = {
      icon: 'history',
      name: 'History',
      secondary: 'Derive the bar value from entity history instead of live state.',
      show: false,
    };

    const entityOptions = {
      show: false,
      options: {
        positions: { ...positionsOptions },
        bar: { ...barOptions },
        value: { ...valueOptions },
        severity: { ...severityOptions },
        actions: { ...actionsOptions },
        animation: { ...animationOptions },
        history: { ...historyOptions },
      },
    };

    while (this._entityOptionsArray.length < this._configArray.length) {
      this._entityOptionsArray.push({ ...entityOptions });
    }
    if (!this._options) {
      this._options = {
        entities: {
          icon: 'tune',
          name: 'Entities',
          secondary: 'Manage card entities.',
          show: true,
          options: {
            entities: this._entityOptionsArray,
          },
        },
        appearance: {
          icon: 'palette',
          name: 'Appearance',
          secondary: 'Customize the global name, icon, etc.',
          show: false,
          options: {
            positions: positionsOptions,
            bar: barOptions,
            value: valueOptions,
            card: cardOptions,
            severity: severityOptions,
            animation: animationOptions,
            history: historyOptions,
          },
        },
      };
    }

    // hass/_config/_options are plain fields, not reactive Lit properties,
    // so nothing automatically re-renders after setConfig() runs. Without
    // this, a render() that fired before setConfig() completed (and got
    // blanked by the guard below) would never be followed by a real one.
    this.requestUpdate();
  }

  protected render(): TemplateResult | void {
    // LitElement can schedule a render before Home Assistant calls setConfig()
    // (e.g. right after element creation/connection), at which point _options
    // is still undefined since it's only populated inside setConfig().
    if (!this.hass || !this._config || !this._options) {
      return html``;
    }
    return html`
      ${this._createAppearanceElement()} ${this._createEntitiesElement()}
    `;
  }

  private _createActionsElement(index: number): TemplateResult {
    const options = this._options?.entities.options.entities[index].options.actions;
    return html`
      <div class="sub-category" style="opacity: 0.5;">
        <div>
          <div class="row">
            <ha-icon .icon=${`mdi:${options.icon}`}></ha-icon>
            <div class="title">${options.name}</div>
          </div>
          <div class="secondary">${options.secondary}</div>
        </div>
      </div>
    `;
  }

  private _createEntitiesValues(): TemplateResult[] {
    if (!this.hass || !this._config) {
      return [html``];
    }

    const options = this._options.entities;
    const valueElementArray: TemplateResult[] = [];
    for (const config of this._configArray) {
      const index = this._configArray.indexOf(config);
      valueElementArray.push(html`
        <div class="sub-category entity-row" style="display: flex; flex-direction: row; align-items: center;">
          <ha-icon
            class="ha-icon-large drag-handle"
            icon="mdi:drag-horizontal-variant"
            @pointerdown=${this._entityDragStart}
            @pointermove=${this._entityDragMove}
            @pointerup=${this._entityDragEnd}
            @pointercancel=${this._entityDragEnd}
            .index=${index}
          ></ha-icon>
          <div class="value" style="flex-grow: 1;">
            <ha-entity-picker
              allow-custom-entity
              @value-changed=${this._valueChanged}
              .configAttribute=${'entity'}
              .configObject=${this._configArray[index]}
              .hass=${this.hass}
              .value=${config.entity}
            >
            </ha-entity-picker>
          </div>
          <ha-icon
            class="ha-icon-large"
            icon="mdi:close"
            @click=${this._removeEntity}
            .configAttribute=${'entity'}
            .configArray=${'entities'}
            .configIndex=${index}
          ></ha-icon>
          <ha-icon
            class="ha-icon-large"
            icon="mdi:pencil"
            @click=${this._toggleThing}
            .options=${options.options.entities[index]}
            .optionsTarget=${options.options.entities}
            .index=${index}
          ></ha-icon>
        </div>
        ${options.options.entities[index].show
          ? html`
              <div class="options">
                ${this._createBarElement(index)} ${this._createValueElement(index)}
                ${this._createPositionsElement(index)} ${this._createSeverityElement(index)}
                ${this._createAnimationElement(index)} ${this._createActionsElement(index)}
                ${this._createHistoryElement(index)}
              </div>
            `
          : ''}
      `);
    }
    return valueElementArray;
  }

  private _createEntitiesElement(): TemplateResult {
    if (!this.hass || !this._config) {
      return html``;
    }
    const options = this._options.entities;

    return html`
      <div class="card-config">
        <div class="option" @click=${this._toggleThing} .options=${options} .optionsTarget=${this._options}>
          <div class="row">
            <ha-icon .icon=${`mdi:${options.icon}`}></ha-icon>
            <div class="title">${options.name}</div>
            <ha-icon .icon=${options.show ? `mdi:chevron-up` : `mdi:chevron-down`} style="margin-left: auto;"></ha-icon>
          </div>
          <div class="secondary">${options.secondary}</div>
        </div>
        ${options.show
        ? html`
              <div class="card-background" style="max-height: 400px; overflow: auto;">
                ${this._createEntitiesValues()}
                <div class="sub-category" style="display: flex; flex-direction: column; align-items: flex-end;">
                  <ha-icon
                    class="ha-icon-large"
                    icon="mdi:plus-circle"
                    @click=${this._addEntity}
                    .configArray=${this._configArray}
                    .configAddValue=${'entity'}
                    .sourceArray=${this._config.entities}
                  ></ha-icon>
                </div>
              </div>
            `
        : ''}
      </div>
    `;
  }

  private _createAppearanceElement(): TemplateResult {
    if (!this.hass) {
      return html``;
    }
    const options = this._options.appearance;
    return html`
        <div class="option" @click=${this._toggleThing} .options=${options} .optionsTarget=${this._options}>
          <div class="row">
            <ha-icon .icon=${`mdi:${options.icon}`}></ha-icon>
            <div class="title">${options.name}</div>
            <ha-icon
              .icon=${options.show ? `mdi:chevron-up` : `mdi:chevron-down`}
              style="margin-left: auto;"
            ></ha-icon>
          </div>
          <div class="secondary">${options.secondary}</div>
        </div>
        ${options.show
        ? html`
                <div class="card-background">
                  ${this._createCardElement()} ${this._createBarElement(null)} ${this._createValueElement(null)}
                  ${this._createPositionsElement(null)} ${this._createSeverityElement(null)}
                  ${this._createAnimationElement(null)} ${this._createHistoryElement(null)}
                </div>
              `
        : ''
      }
      </div>`;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _globalValue(path: string): any {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return path.split('.').reduce((o: any, k: string) => (o == null ? undefined : o[k]), this._config);
  }

  private _createBarElement(index: number | null): TemplateResult {
    let options;
    let config;
    if (index !== null) {
      options = this._options.entities.options.entities[index].options.bar;
      config = this._configArray[index];
    } else {
      options = this._options.appearance.options.bar;
      config = this._config;
    }
    return html`
      <div class="category" id="bar">
        <div
          class="sub-category"
          @click=${this._toggleThing}
          .options=${options}
          .optionsTarget=${this._options.appearance.options}
        >
          <div class="row">
            <ha-icon .icon=${`mdi:${options.icon}`}></ha-icon>
            <div class="title">${options.name}</div>
            <ha-icon .icon=${options.show ? `mdi:chevron-up` : `mdi:chevron-down`} style="margin-left: auto;"></ha-icon>
          </div>
          <div class="secondary">${options.secondary}</div>
        </div>
        ${options.show
        ? html`
              <div class="value">
                <div>
                  <label class="field-label"
                    >Direction
                    <select
                      .value=${config.direction ? config.direction : ''}
                      @change=${this._valueChanged}
                      .configObject=${config}
                      .configAttribute=${'direction'}
                      .ignoreNull=${true}
                    >
                      <option value="">-</option>
                      <option value="right">right</option>
                      <option value="up">up</option>
                    </select>
                  </label>
                  ${config.direction
            ? html`
                        <ha-icon
                          class="ha-icon-large"
                          icon="mdi:close"
                          @click=${this._valueChanged}
                          .value=${''}
                          .configAttribute=${'direction'}
                          .configObject=${config}
                        ></ha-icon>
                      `
            : ''}
                  ${index !== null && !config.direction && this._globalValue('direction')
            ? html`<span class="global-hint">(globaal: ${this._globalValue('direction')})</span>`
            : ''}
                </div>
                ${index !== null
            ? html`
                      <label class="field-label"
                        >Name
                        <input
                          type="text"
                          .value="${config.name ? config.name : ''}"
                          .configAttribute=${'name'}
                          .configObject=${config}
                          @input=${this._valueChanged}
                        />
                      </label>
                    `
            : ''}
                <div class="value-row">
                  <label class="field-label"
                    >Icon
                    <input
                      type="text"
                      placeholder="${index !== null ? (this._globalValue('icon') ?? '') : ''}"
                      .value="${config.icon ? config.icon : ''}"
                      .configAttribute=${'icon'}
                      .configObject=${config}
                      @input=${this._valueChanged}
                    />
                  </label>
                  <label class="field-label"
                    >Color
                    <input
                      type="text"
                      placeholder="${index !== null ? (this._globalValue('color') ?? '') : ''}"
                      .value="${config.color ? config.color : ''}"
                      .configAttribute=${'color'}
                      .configObject=${config}
                      @input=${this._valueChanged}
                    />
                  </label>
                </div>
                <div class="value-row">
                  <label class="field-label"
                    >Height
                    <input
                      type="text"
                      placeholder="${index !== null ? (this._globalValue('height') ?? '') : ''}"
                      .value="${config.height ? config.height : ''}"
                      .configAttribute=${'height'}
                      .configObject=${config}
                      @input=${this._valueChanged}
                    />
                  </label>
                  <label class="field-label"
                    >Width
                    <input
                      type="text"
                      placeholder="${index !== null ? (this._globalValue('width') ?? '') : ''}"
                      .value="${config.width ? config.width : ''}"
                      .configAttribute=${'width'}
                      .configObject=${config}
                      @input=${this._valueChanged}
                    />
                  </label>
                </div>
              </div>
            `
        : ''}
      </div>
    `;
  }

  private _createAnimationElement(index: number | null): TemplateResult {
    let options;
    let config;
    if (index !== null) {
      options = this._options.entities.options.entities[index].options.animation;
      config = this._configArray[index];
    } else {
      options = this._options.appearance.options.animation;
      config = this._config;
    }
    config.animation = { ...config.animation };
    return html`
      <div class="category" id="bar">
        <div
          class="sub-category"
          @click=${this._toggleThing}
          .options=${options}
          .optionsTarget=${this._options.appearance.options}
        >
          <div class="row">
            <ha-icon .icon=${`mdi:${options.icon}`}></ha-icon>
            <div class="title">${options.name}</div>
            <ha-icon .icon=${options.show ? `mdi:chevron-up` : `mdi:chevron-down`} style="margin-left: auto;"></ha-icon>
          </div>
          <div class="secondary">${options.secondary}</div>
        </div>
        ${options.show
        ? html`
                <div class="value">
                  <div>
                    <label class="field-label"
                      >State
                      <select
                        .value=${config.animation.state ? config.animation.state : ''}
                        @change=${this._valueChanged}
                        .configAttribute=${'state'}
                        .configObject=${config.animation}
                        .index=${index}
                        .ignoreNull=${true}
                      >
                        <option value="">-</option>
                        <option value="on">on</option>
                        <option value="off">off</option>
                      </select>
                    </label>
                    ${config.animation.state
            ? html`
                          <ha-icon
                            class="ha-icon-large"
                            icon="mdi:close"
                            @click=${this._valueChanged}
                            .value=${''}
                            .configAttribute=${'state'}
                            .configObject=${config.animation}
                            .index=${index}
                          ></ha-icon>
                        `
            : ''}
                    ${index !== null && !config.animation.state && this._globalValue('animation.state')
            ? html`<span class="global-hint">(globaal: ${this._globalValue('animation.state')})</span>`
            : ''}
                  </div>
                  <label class="field-label"
                    >Speed
                    <input
                      type="number"
                      class="field-number"
                      placeholder="${index !== null ? (this._globalValue('animation.speed') ?? '') : ''}"
                      .value="${config.animation.speed ? config.animation.speed : ''}"
                      @input=${this._valueChanged}
                      .configAttribute=${'speed'}
                      .configObject=${config.animation}
                      .index=${index}
                    />
                  </label>
                </div>
              `
        : ''}
      </div>
    `;
  }

  private _createHistoryElement(index: number | null): TemplateResult {
    let options;
    let config;
    if (index !== null) {
      options = this._options.entities.options.entities[index].options.history;
      config = this._configArray[index];
    } else {
      options = this._options.appearance.options.history;
      config = this._config;
    }
    config.history = { ...config.history };
    return html`
      <div class="category" id="history">
        <div
          class="sub-category"
          @click=${this._toggleThing}
          .options=${options}
          .optionsTarget=${this._options.appearance.options}
        >
          <div class="row">
            <ha-icon .icon=${`mdi:${options.icon}`}></ha-icon>
            <div class="title">${options.name}</div>
            <ha-icon .icon=${options.show ? `mdi:chevron-up` : `mdi:chevron-down`} style="margin-left: auto;"></ha-icon>
          </div>
          <div class="secondary">${options.secondary}</div>
        </div>
        ${options.show
        ? html`
              <div class="value">
                <div>
                  <label class="field-label"
                    >Period
                    <select
                      .value=${config.history.period ? config.history.period : ''}
                      @change=${this._valueChanged}
                      .configAttribute=${'period'}
                      .configObject=${config.history}
                      .index=${index}
                      .ignoreNull=${true}
                    >
                      <option value="">-</option>
                      <option value="today">today</option>
                      <option value="yesterday">yesterday</option>
                      <option value="last_7d">last_7d</option>
                      <option value="last_30d">last_30d</option>
                      <option value="this_month">this_month</option>
                      <option value="last_month">last_month</option>
                      <option value="last_12_months">last_12_months</option>
                      <option value="this_year">this_year</option>
                      <option value="last_year">last_year</option>
                    </select>
                  </label>
                  ${config.history.period
            ? html`
                        <ha-icon
                          class="ha-icon-large"
                          icon="mdi:close"
                          @click=${this._valueChanged}
                          .value=${''}
                          .configAttribute=${'period'}
                          .configObject=${config.history}
                        ></ha-icon>
                      `
            : ''}
                  ${index !== null && !config.history.period && this._globalValue('history.period')
            ? html`<span class="global-hint">(globaal: ${this._globalValue('history.period')})</span>`
            : ''}
                </div>
              </div>
            `
        : ''}
      </div>
    `;
  }

  private _createSeverityElement(index: number | null): TemplateResult {
    let options;
    let config;
    if (index !== null) {
      options = this._options.entities.options.entities[index].options.severity;
      config = this._configArray[index];
    } else {
      options = this._options.appearance.options.severity;
      config = this._config;
    }
    const arrayLength = config.severity ? config.severity.length : 0;
    return html`
      <div class="category" id="bar">
        <div
          class="sub-category"
          @click=${this._toggleThing}
          .options=${options}
          .optionsTarget=${this._options.appearance.options}
        >
          <div class="row">
            <ha-icon .icon=${`mdi:${options.icon}`}></ha-icon>
            <div class="title">${options.name}</div>
            <ha-icon .icon=${options.show ? `mdi:chevron-up` : `mdi:chevron-down`} style="margin-left: auto;"></ha-icon>
          </div>
          <div class="secondary">${options.secondary}</div>
        </div>
        ${options.show
        ? html`
              <div class="card-background" style="overflow: auto; max-height: 420px;">
                ${index !== null && this._config.severity?.length
            ? html`<div class="secondary">Globale severity-regels worden ook toegepast (samengevoegd, niet overschreven).</div>`
            : ''}
                ${arrayLength > 0
            ? html`
                      ${this._createSeverityValues(index)}
                    `
            : ''}
                <div class="sub-category" style="display: flex; flex-direction: column; align-items: flex-end;">
                  <ha-icon class="ha-icon-large" icon="mdi:plus-circle" @click=${this._addSeverity} .index=${index}></ha-icon>
                </div>
              </div>
            `
        : ''}
      </div>
    `;
  }

  private _createSeverityValues(index: number | null): TemplateResult[] {
    let config;
    if (index === null) {
      config = this._config;
    } else {
      config = this._configArray[index];
    }
    const severityValuesArray: TemplateResult[] = [];
    for (const severity of config.severity) {
      const severityIndex = config.severity.indexOf(severity);
      severityValuesArray.push(html`
        <div class="sub-category" style="display: flex; flex-direction: row; align-items: center;">
          <div class="value">
            <div style="display:flex;">
              <label class="field-label"
                >From
                <input
                  type="number"
                  class="field-number"
                  .value="${severity.from || severity.from === 0 ? severity.from : ''}"
                  .severityAttribute=${'from'}
                  .index=${index}
                  .severityIndex=${severityIndex}
                  @input=${this._updateSeverity}
                />
              </label>
              <label class="field-label"
                >To
                <input
                  type="number"
                  class="field-number"
                  .value="${severity.to ? severity.to : ''}"
                  .severityAttribute=${'to'}
                  .index=${index}
                  .severityIndex=${severityIndex}
                  @input=${this._updateSeverity}
                />
              </label>
            </div>
            <div style="display:flex;">
              <label class="field-label"
                >Color
                <div style="display: flex; align-items: center; gap: 4px;">
                  <input
                    type="text"
                    .value="${severity.color ? severity.color : ''}"
                    .severityAttribute=${'color'}
                    .index=${index}
                    .severityIndex=${severityIndex}
                    @input=${this._updateSeverity}
                  />
                  <input
                    type="color"
                    class="color-swatch"
                    title="Kies een kleur"
                    .value="${/^#[0-9a-fA-F]{6}$/.test(severity.color) ? severity.color : '#ffffff'}"
                    .severityAttribute=${'color'}
                    .index=${index}
                    .severityIndex=${severityIndex}
                    @input=${this._updateSeverity}
                  />
                </div>
              </label>
              <label class="field-label"
                >Icon
                <input
                  type="text"
                  .value="${severity.icon ? severity.icon : ''}"
                  .severityAttribute=${'icon'}
                  .index=${index}
                  .severityIndex=${severityIndex}
                  @input=${this._updateSeverity}
                />
              </label>
            </div>
            <ha-switch
              .checked=${!!severity.hide}
              .severityAttribute=${'hide'}
              .index=${index}
              .severityIndex=${severityIndex}
              .value=${!severity.hide}
              @change=${this._updateSeverity}
              >Hide</ha-switch
            >
          </div>
          <div style="display: flex;">
            ${severityIndex !== 0
          ? html`
                  <ha-icon
                    class="ha-icon-large"
                    icon="mdi:arrow-up"
                    @click=${this._moveSeverity}
                    .configDirection=${'up'}
                    .index=${index}
                    .severityIndex=${severityIndex}
                  ></ha-icon>
                `
          : html`
                  <ha-icon icon="mdi:arrow-up" style="opacity: 25%;" class="ha-icon-large"></ha-icon>
                `}
            ${severityIndex !== config.severity.length - 1
          ? html`
                  <ha-icon
                    class="ha-icon-large"
                    icon="mdi:arrow-down"
                    @click=${this._moveSeverity}
                    .configDirection=${'down'}
                    .index=${index}
                    .severityIndex=${severityIndex}
                  ></ha-icon>
                `
          : html`
                  <ha-icon icon="mdi:arrow-down" style="opacity: 25%;" class="ha-icon-large"></ha-icon>
                `}
            <ha-icon
              class="ha-icon-large"
              icon="mdi:close"
              @click=${this._removeSeverity}
              .index=${index}
              .severityIndex=${severityIndex}
            ></ha-icon>
          </div>
        </div>
      `);
    }
    return severityValuesArray;
  }

  private _createCardElement(): TemplateResult {
    if (!this.hass) {
      return html``;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const config: any = this._config;
    const options = this._options.appearance.options.card;
    return html`
      <div class="category" id="card">
        <div
          class="sub-category"
          @click=${this._toggleThing}
          .options=${options}
          .optionsTarget=${this._options.appearance.options}
        >
          <div class="row">
            <ha-icon .icon=${`mdi:${options.icon}`}></ha-icon>
            <div class="title">${options.name}</div>
            <ha-icon .icon=${options.show ? `mdi:chevron-up` : `mdi:chevron-down`} style="margin-left: auto;"></ha-icon>
          </div>
          <div class="secondary">${options.secondary}</div>
        </div>
        ${options.show
        ? html`
              <div class="value-container">
                <label class="field-label"
                  >Header Title
                  <input
                    type="text"
                    .value="${config.title ? config.title : ''}"
                    .configObject=${config}
                    .configAttribute=${'title'}
                    @input=${this._valueChanged}
                  />
                </label>
                <label class="field-label"
                  >Columns
                  <input
                    type="number"
                    class="field-number"
                    .value=${config.columns ? config.columns : ''}
                    .configObject=${config}
                    .configAttribute=${'columns'}
                    @input=${this._valueChanged}
                  />
                </label>
                <div>
                  <ha-switch
                    .checked=${!!config.entity_row}
                    .configAttribute=${'entity_row'}
                    .configObject=${config}
                    .value=${!config.entity_row}
                    @change=${this._valueChanged}
                    >Entity Row</ha-switch
                  >
                </div>
              </div>
            `
        : ''}
      </div>
    `;
  }

  private _createPositionsValues(index: number | null): TemplateResult[] {
    const defaultPositions = {
      icon: 'outside',
      indicator: 'outside',
      name: 'inside',
      minmax: 'off',
      value: 'inside',
    };
    let config;
    if (index === null) {
      config = this._config;
    } else {
      config = this._configArray[index];
    }
    config.positions = { ...config.positions };
    const positionElementsArray: TemplateResult[] = [];
    const objectKeys = Object.keys(defaultPositions);
    for (const position of objectKeys) {
      positionElementsArray.push(html`
          <div class="value">
            <label class="field-label"
              >${position}
              <select
                .value=${config.positions[position] ? config.positions[position] : ''}
                @change=${this._valueChanged}
                .configAttribute=${position}
                .configObject=${config.positions}
                .ignoreNull=${true}
              >
                <option value="">-</option>
                <option value="inside">inside</option>
                <option value="outside">outside</option>
                <option value="off">off</option>
              </select>
            </label>
            ${config.positions[position]
            ? html`
                  <ha-icon
                    class="ha-icon-large"
                    icon="mdi:close"
                    @click=${this._valueChanged}
                    .value=${''}
                    .configAttribute=${position}
                    .configObject=${config.positions}
                  ></ha-icon>
                `
            : ''}
            ${index !== null && !config.positions[position] && this._globalValue(`positions.${position}`)
            ? html`<span class="global-hint">(globaal: ${this._globalValue(`positions.${position}`)})</span>`
            : ''}
          </div>
        `);
    }
    return positionElementsArray;
  }

  private _createPositionsElement(index: number | null): TemplateResult {
    if (!this.hass) {
      return html``;
    }

    let options;
    if (index === null) {
      options = this._options.appearance.options.positions;
    } else {
      options = this._options.entities.options.entities[index].options.positions;
    }
    return html`
      <div class="category">
        <div
          class="sub-category"
          @click=${this._toggleThing}
          .options=${options}
          .optionsTarget=${this._options.appearance.options}
        >
          <div class="row">
            <ha-icon .icon=${`mdi:${options.icon}`}></ha-icon>
            <div class="title">${options.name}</div>
            <ha-icon .icon=${options.show ? `mdi:chevron-up` : `mdi:chevron-down`} style="margin-left: auto;"></ha-icon>
          </div>
          <div class="secondary">${options.secondary}</div>
        </div>
        ${options.show
        ? html`
              <div class="positions-grid">${this._createPositionsValues(index)}</div>
            `
        : ``}
      </div>
    `;
  }

  private _createValueElement(index: number | null): TemplateResult {
    if (!this.hass) {
      return html``;
    }

    let options;
    let config;
    if (index !== null) {
      options = this._options.entities.options.entities[index].options.value;
      config = this._configArray[index];
    } else {
      options = this._options.appearance.options.value;
      config = this._config;
    }

    return html`
      <div class="category" id="value">
        <div
          class="sub-category"
          @click=${this._toggleThing}
          .options=${options}
          .optionsTarget=${this._options.appearance.options}
        >
          <div class="row">
            <ha-icon .icon=${`mdi:${options.icon}`}></ha-icon>
            <div class="title">${options.name}</div>
            <ha-icon .icon=${options.show ? `mdi:chevron-up` : `mdi:chevron-down`} style="margin-left: auto;"></ha-icon>
          </div>
          <div class="secondary">${options.secondary}</div>
        </div>
        ${options.show
        ? html`
              <div class="value">
                <div class="value-row">
                  <ha-switch
                    .checked=${!!config.limit_value}
                    .configAttribute=${'limit_value'}
                    .configObject=${config}
                    .value=${!config.limit_value}
                    @change=${this._valueChanged}
                    >Limit Value</ha-switch
                  >
                  ${index !== null && !config.limit_value && this._globalValue('limit_value')
            ? html`<span class="global-hint">(globaal: aan)</span>`
            : ''}
                  <ha-switch
                    .checked=${!!config.complementary}
                    .configAttribute=${'complementary'}
                    .configObject=${config}
                    .value=${!config.complementary}
                    @change=${this._valueChanged}
                    >Complementary</ha-switch
                  >
                  ${index !== null && !config.complementary && this._globalValue('complementary')
            ? html`<span class="global-hint">(globaal: aan)</span>`
            : ''}
                </div>
                <div class="value-row">
                  <label class="field-label"
                    >Decimal
                    <input
                      type="number"
                      class="field-number"
                      placeholder="${index !== null ? (this._globalValue('decimal') ?? '') : ''}"
                      .value="${config.decimal ? config.decimal : ''}"
                      .configAttribute=${'decimal'}
                      .configObject=${config}
                      @input=${this._valueChanged}
                    />
                  </label>
                  <label class="field-label"
                    >Min
                    <input
                      type="number"
                      class="field-number"
                      placeholder="${index !== null ? (this._globalValue('min') ?? '') : ''}"
                      .value="${config.min ? config.min : ''}"
                      .configAttribute=${'min'}
                      .configObject=${config}
                      @input=${this._valueChanged}
                    />
                  </label>
                  <label class="field-label"
                    >Max
                    <input
                      type="number"
                      class="field-number"
                      placeholder="${index !== null ? (this._globalValue('max') ?? '') : ''}"
                      .value="${config.max ? config.max : ''}"
                      .configAttribute=${'max'}
                      .configObject=${config}
                      @input=${this._valueChanged}
                    />
                  </label>
                  <label class="field-label"
                    >Target
                    <input
                      type="number"
                      class="field-number"
                      placeholder="${index !== null ? (this._globalValue('target') ?? '') : ''}"
                      .value="${config.target ? config.target : ''}"
                      .configAttribute=${'target'}
                      .configObject=${config}
                      @input=${this._valueChanged}
                    />
                  </label>
                </div>
                <div class="value-row">
                  <label class="field-label"
                    >Unit of Measurement
                    <input
                      type="text"
                      placeholder="${index !== null ? (this._globalValue('unit_of_measurement') ?? '') : ''}"
                      .value="${config.unit_of_measurement ? config.unit_of_measurement : ''}"
                      .configAttribute=${'unit_of_measurement'}
                      .configObject=${config}
                      @input=${this._valueChanged}
                    />
                  </label>
                  <label class="field-label"
                    >Attribute
                    <input
                      type="text"
                      placeholder="${index !== null ? (this._globalValue('attribute') ?? '') : ''}"
                      .value="${config.attribute ? config.attribute : ''}"
                      .configAttribute=${'attribute'}
                      .configObject=${config}
                      @input=${this._valueChanged}
                    />
                  </label>
                </div>
              </div>
            `
        : ''}
      </div>
    `;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _toggleThing(event: any): void {
    const options = event.target.options;
    const show = !options.show;
    if (event.target.optionsTarget) {
      if (Array.isArray(event.target.optionsTarget)) {
        for (const options of event.target.optionsTarget) {
          options.show = false;
        }
      } else {
        for (const [key] of Object.entries(event.target.optionsTarget)) {
          event.target.optionsTarget[key].show = false;
        }
      }
    }
    options.show = show;
    this._toggle = !this._toggle;
    // _options/_toggle are plain fields, not reactive Lit properties, so
    // mutating them alone never triggers a re-render (see setConfig()).
    this.requestUpdate();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _addEntity(event: any): void {
    if (!this._config || !this.hass) {
      return;
    }
    const target = event.target;
    let newObject;
    if (target.configAddObject) {
      newObject = target.configAddObject;
    } else {
      newObject = { [target.configAddValue]: '' };
    }
    const newArray = target.configArray.slice();
    newArray.push(newObject);
    this._config.entities = newArray;
    fireEvent(this, 'config-changed', { config: this._config });
  }

  private _getEntityRowElements(): HTMLElement[] {
    return Array.from(this.shadowRoot?.querySelectorAll('.entity-row') ?? []) as HTMLElement[];
  }

  // Native HTML5 drag-and-drop always shows a separate "ghost" image while
  // leaving the dragged element in place. To actually move the real row
  // under the pointer (matching HA's own sortable rows) this uses Pointer
  // Events instead, with the moved row positioned via setPointerCapture so
  // it keeps receiving move/up events no matter which row is underneath.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _entityDragStart(event: any): void {
    const handle = event.currentTarget;
    const row = handle.closest('.entity-row');
    if (!row || (event.button !== undefined && event.button !== 0)) {
      return;
    }
    event.preventDefault();
    this._dragEntityIndex = handle.index;
    this._dragOriginalIndex = handle.index;
    this._dragRowElement = row;
    this._dragStartClientY = event.clientY;
    this._dragLastDeltaY = 0;
    this._dragRowOriginalRects = this._getEntityRowElements().map((r) => r.getBoundingClientRect());
    handle.setPointerCapture(event.pointerId);
    row.classList.add('dragging');
  }

  // _dragRowElement is whichever physical row currently shows the dragged
  // entity (Lit reuses rows positionally, so this node changes on every
  // swap). Its own natural layout slot rarely matches the slot the drag
  // started from, so the translateY needed to keep it under the pointer is
  // the cursor delta PLUS the gap between those two original slot tops —
  // not just the raw cursor delta, which only ever happens to be correct
  // for the very first (un-swapped) row.
  private _applyDragTransform(): void {
    if (this._dragEntityIndex === null || this._dragOriginalIndex === null || !this._dragRowElement) {
      return;
    }
    const originalTop = this._dragRowOriginalRects[this._dragOriginalIndex]?.top;
    const currentSlotTop = this._dragRowOriginalRects[this._dragEntityIndex]?.top;
    if (originalTop === undefined || currentSlotTop === undefined) {
      return;
    }
    this._dragRowElement.style.transform = `translateY(${originalTop + this._dragLastDeltaY - currentSlotTop}px)`;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _entityDragMove(event: any): void {
    if (this._dragEntityIndex === null || this._dragOriginalIndex === null || !this._dragRowElement) {
      return;
    }
    this._dragLastDeltaY = event.clientY - this._dragStartClientY;
    this._applyDragTransform();

    const draggedRect = this._dragRowOriginalRects[this._dragOriginalIndex];
    if (!draggedRect) {
      return;
    }
    const draggedCenter = draggedRect.top + draggedRect.height / 2 + this._dragLastDeltaY;

    let targetIndex = 0;
    this._dragRowOriginalRects.forEach((rect, i) => {
      const midpoint = rect.top + rect.height / 2;
      const closestMidpoint = this._dragRowOriginalRects[targetIndex].top + this._dragRowOriginalRects[targetIndex].height / 2;
      if (Math.abs(midpoint - draggedCenter) < Math.abs(closestMidpoint - draggedCenter)) {
        targetIndex = i;
      }
    });

    if (targetIndex !== this._dragEntityIndex) {
      this._reorderEntities(this._dragEntityIndex, targetIndex);
      this._dragEntityIndex = targetIndex;
    }
  }

  private _reorderEntities(fromIndex: number, toIndex: number): void {
    if (!this._config) {
      return;
    }
    const beforeRects = new Map<unknown, DOMRect>();
    this._getEntityRowElements().forEach((row, i) => {
      const config = this._configArray[i];
      if (config) {
        beforeRects.set(config, row.getBoundingClientRect());
      }
    });

    this._configArray = arrayMove(this._configArray, fromIndex, toIndex);
    this._config.entities = this._configArray;
    this.requestUpdate();

    this.updateComplete.then(() => {
      const draggedConfig = this._configArray[toIndex];
      this._getEntityRowElements().forEach((row, i) => {
        const config = this._configArray[i];
        if (config === draggedConfig) {
          // This is now the actual DOM node showing the dragged entity
          // (Lit reuses rows positionally, so it's likely a different node
          // than before this reorder) — keep it following the pointer.
          this._dragRowElement = row;
          row.classList.add('dragging');
          row.style.transition = 'none';
          this._applyDragTransform();
          return;
        }
        const before = config && beforeRects.get(config);
        if (!before) {
          return;
        }
        const after = row.getBoundingClientRect();
        const deltaY = before.top - after.top;
        if (!deltaY) {
          return;
        }
        row.style.transition = 'none';
        row.style.transform = `translateY(${deltaY}px)`;
        requestAnimationFrame(() => {
          row.style.transition = 'transform 150ms ease';
          row.style.transform = '';
        });
      });
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _entityDragEnd(event: any): void {
    const handle = event.currentTarget;
    if (this._dragEntityIndex === null) {
      return;
    }
    if (handle.hasPointerCapture?.(event.pointerId)) {
      handle.releasePointerCapture(event.pointerId);
    }
    this._getEntityRowElements().forEach((row) => {
      row.style.transition = '';
      row.style.transform = '';
      row.classList.remove('dragging');
    });
    this._dragEntityIndex = null;
    this._dragOriginalIndex = null;
    this._dragRowElement = null;
    this._dragRowOriginalRects = [];
    fireEvent(this, 'config-changed', { config: this._config });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _removeEntity(event: any): void {
    if (!this._config || !this.hass) {
      return;
    }
    const target = event.target;
    const entitiesArray: BarCardConfig[] = [];
    let index = 0;
    for (const config of this._configArray) {
      if (target.configIndex !== index) {
        entitiesArray.push(config);
      }
      index++;
    }
    const newConfig = { [target.configArray]: entitiesArray };
    this._config = Object.assign(this._config, newConfig);
    fireEvent(this, 'config-changed', { config: this._config });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _addSeverity(event: any): void {
    if (!this._config || !this.hass) {
      return;
    }
    const target = event.target;

    let severityArray;
    if (target.index === null) {
      severityArray = this._config.severity;
    } else {
      severityArray = this._config.entities[target.index].severity;
    }

    if (!severityArray) {
      severityArray = [];
    }

    const newObject = { from: '', to: '', color: '' };
    const newArray = severityArray.slice();
    newArray.push(newObject);

    if (target.index === null) {
      this._config.severity = newArray;
    } else {
      this._configArray[target.index].severity = newArray;
    }
    this._config.entities = this._configArray;
    fireEvent(this, 'config-changed', { config: this._config });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _moveSeverity(event: any): void {
    if (!this._config || !this.hass) {
      return;
    }
    const target = event.target;

    let severityArray;
    if (target.index === null) {
      severityArray = this._config.severity;
    } else {
      severityArray = this._config.entities[target.index].severity;
    }

    let newArray = severityArray.slice();
    if (target.configDirection == 'up') {
      newArray = arrayMove(newArray, target.severityIndex, target.severityIndex - 1);
    } else if (target.configDirection == 'down') {
      newArray = arrayMove(newArray, target.severityIndex, target.severityIndex + 1);
    }

    if (target.index === null) {
      this._config.severity = newArray;
    } else {
      this._configArray[target.index].severity = newArray;
    }
    this._config.entities = this._configArray;
    fireEvent(this, 'config-changed', { config: this._config });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _removeSeverity(event: any): void {
    if (!this._config || !this.hass) {
      return;
    }
    const target = event.target;

    let severityArray;
    if (target.index === null) {
      severityArray = this._config.severity;
    } else {
      severityArray = this._configArray[target.index].severity;
    }

    const clonedArray = severityArray.slice();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newArray: any = [];
    let arrayIndex = 0;
    for (const { } of clonedArray) {
      if (target.severityIndex !== arrayIndex) {
        newArray.push(clonedArray[arrayIndex]);
      }
      arrayIndex++;
    }
    if (target.index === null) {
      if (newArray.length === 0) {
        delete this._config.severity;
      } else {
        this._config.severity = newArray;
      }
    } else {
      if (newArray.length === 0) {
        delete this._configArray[target.index].severity;
      } else {
        this._configArray[target.index].severity = newArray;
      }
    }
    this._config.entities = this._configArray;
    fireEvent(this, 'config-changed', { config: this._config });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _updateSeverity(event: any): void {
    const target = event.target;

    let severityArray;
    if (target.index === null) {
      severityArray = this._config.severity;
    } else {
      severityArray = this._configArray[target.index].severity;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newSeverityArray: any = [];
    for (const index in severityArray) {
      if (target.severityIndex == index) {
        const clonedObject = { ...severityArray[index] };
        const newObject = { [target.severityAttribute]: target.value };
        const mergedObject = Object.assign(clonedObject, newObject);
        if (target.value == '') {
          delete mergedObject[target.severityAttribute];
        }
        newSeverityArray.push(mergedObject);
      } else {
        newSeverityArray.push(severityArray[index]);
      }
    }

    if (target.index === null) {
      this._config.severity = newSeverityArray;
    } else {
      this._configArray[target.index].severity = newSeverityArray;
    }
    this._config.entities = this._configArray;
    fireEvent(this, 'config-changed', { config: this._config });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _valueChanged(event: any): void {
    if (!this._config || !this.hass) {
      return;
    }
    const target = event.target;
    if (target.configObject[target.configAttribute] == target.value) {
      return;
    }

    if (target.configAdd && target.value !== '') {
      target.configObject = Object.assign(target.configObject, {
        [target.configAdd]: { [target.configAttribute]: target.value },
      });
    }
    if (target.configAttribute && target.configObject && !target.configAdd) {
      if (target.value == '' || target.value === false) {
        if (target.ignoreNull == true) return;
        delete target.configObject[target.configAttribute];
      } else {
        console.log(target.configObject);
        target.configObject[target.configAttribute] = target.value;
      }
    }
    this._config.entities = this._configArray;
    fireEvent(this, 'config-changed', { config: this._config });
  }

  static get styles(): CSSResult {
    return css`
      .option {
        padding: 4px 0px;
        cursor: pointer;
      }
      .options {
        background: var(--primary-background-color);
        border-radius: var(--ha-card-border-radius);
        cursor: pointer;
        padding: 8px;
      }
      .sub-category {
        cursor: pointer;
      }
      .row {
        display: flex;
        margin-bottom: -14px;
        pointer-events: none;
        margin-top: 14px;
      }
      .title {
        padding-left: 16px;
        margin-top: -6px;
        pointer-events: none;
      }
      .secondary {
        padding-left: 40px;
        color: var(--secondary-text-color);
        pointer-events: none;
      }
      .value {
        padding: 0px 8px;
      }
      .value-container {
        padding: 0px 8px;
        transition: all 0.5s ease-in-out;
      }
      .value-container:target {
        height: 50px;
      }
      .value-number {
        width: 100px;
      }
      .global-hint {
        color: var(--secondary-text-color);
        font-size: 12px;
        margin-left: 8px;
      }
      .field-label {
        display: inline-flex;
        flex-direction: column;
        font-size: 12px;
        color: var(--secondary-text-color);
        margin: 8px 4px 8px 0px;
      }
      .field-label select,
      .field-label input {
        font-size: 14px;
        padding: 8px 12px;
        margin-top: 4px;
        background: var(--ha-color-form-background, rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.08));
        color: var(--primary-text-color);
        border: none;
        border-radius: 12px;
        box-sizing: border-box;
      }
      .field-label input {
        width: 140px;
      }
      .field-label input.field-number {
        width: 80px;
      }
      .field-label input.color-swatch {
        width: 36px;
        padding: 2px;
        cursor: pointer;
      }
      .value-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
      }
      .positions-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0px 16px;
      }
      ha-switch {
        padding: 16px 0;
      }
      .card-background {
        background: var(--ha-card-background);
        border-radius: var(--ha-card-border-radius);
        padding: 8px;
      }
      .category {
        background: #0000;
      }
      .ha-icon-large {
        cursor: pointer;
        margin: 0px 4px;
      }
      .drag-handle {
        cursor: grab;
        align-self: center;
        margin-top: auto;
        margin-bottom: auto;
        touch-action: none;
      }
      .drag-handle:active {
        cursor: grabbing;
      }
      .entity-row.dragging {
        position: relative;
        z-index: 2;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        background: var(--card-background-color);
      }
      .entity-row {
        margin-bottom: 8px;
      }
    `;
  }
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.customCards = window.customCards || [];
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.customCards.push({
  type: 'bar-card',
  name: 'Bar Card',
  preview: false, // Optional - defaults to false
  description: 'A customizable bar card.', // Optional
  getEntitySuggestion: (hass: HomeAssistant, entityId: string) => {
    const domain = entityId.split('.')[0];
    if (!['sensor', 'number', 'input_number'].includes(domain)) {
      return null;
    }
    const stateObj = hass.states[entityId];
    if (!stateObj || isNaN(Number(stateObj.state))) {
      return null;
    }
    return { config: { type: 'custom:bar-card', entity: entityId } };
  },
});
