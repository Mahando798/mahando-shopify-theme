/**
 * Mahando Header-Suche: echtes Eingabefeld mit Vorschlags-Dropdown direkt unter der Suchleiste.
 *
 * Markup (snippets/search.liquid, Variante "bar"):
 *   <mahando-search data-url="/search/suggest" data-section="mahando-search-suggest">
 *     <form> <input type="search" name="q"> <button class="mahando-search-bar__clear"> <button type="submit"> </form>
 *     <div class="mahando-search-panel" hidden></div>
 *   </mahando-search>
 *
 * Die Vorschläge rendert die Section "mahando-search-suggest" (Section Rendering API auf /search/suggest).
 * Tastatur: Pfeil hoch/runter wählt einen Eintrag, Enter öffnet ihn (ohne Auswahl: normale Suche), Escape schließt.
 */
class MahandoSearch extends HTMLElement {
  /** @type {AbortController | null} */
  #activeFetch = null;
  /** @type {number | undefined} */
  #debounce;
  /** @type {Map<string, string>} */
  #cache = new Map();
  #index = -1;
  #listeners = new AbortController();
  #minLength = 2;

  connectedCallback() {
    this.form = this.querySelector('form');
    this.input = this.querySelector('input[type="search"]');
    this.panel = this.querySelector('.mahando-search-panel');
    this.clearButton = this.querySelector('.mahando-search-bar__clear');

    if (!this.form || !this.input || !this.panel) return;

    const { signal } = this.#listeners;

    this.input.addEventListener('input', this.#onInput, { signal });
    this.input.addEventListener('keydown', this.#onKeyDown, { signal });
    this.input.addEventListener('focus', this.#onFocus, { signal });
    this.form.addEventListener('submit', this.#onSubmit, { signal });
    this.addEventListener('focusout', this.#onFocusOut, { signal });
    this.panel.addEventListener('mousemove', this.#onPanelHover, { signal });
    document.addEventListener('pointerdown', this.#onDocumentPointerDown, { signal });
    document.addEventListener('keydown', this.#onDocumentKeyDown, { signal });
    this.clearButton?.addEventListener('click', this.#onClear, { signal });

    this.#toggleClear();
  }

  disconnectedCallback() {
    this.#listeners.abort();
    this.#activeFetch?.abort();
    window.clearTimeout(this.#debounce);
  }

  get #query() {
    return this.input.value.trim();
  }

  /** @returns {HTMLElement[]} */
  get #items() {
    return Array.from(this.panel.querySelectorAll('[data-search-item]'));
  }

  #onInput = () => {
    this.#toggleClear();
    window.clearTimeout(this.#debounce);

    const query = this.#query;
    if (query.length < this.#minLength) {
      this.#close();
      return;
    }

    this.#debounce = window.setTimeout(() => this.#search(query), 180);
  };

  #onFocus = () => {
    const query = this.#query;
    if (query.length >= this.#minLength && this.#cache.has(query)) {
      this.#render(this.#cache.get(query) || '');
    }
  };

  /** @param {FocusEvent} event */
  #onFocusOut = (event) => {
    const next = /** @type {Node | null} */ (event.relatedTarget);
    if (next && this.contains(next)) return;
    // Beim Klick auf einen Vorschlag wandert der Fokus kurz ins Leere – deshalb erst prüfen, ob die Maus im Panel ist.
    if (this.panel.matches(':hover')) return;
    this.#close();
  };

  /** @param {PointerEvent} event */
  #onDocumentPointerDown = (event) => {
    if (!this.contains(/** @type {Node} */ (event.target))) this.#close();
  };

  /** @param {KeyboardEvent} event */
  #onDocumentKeyDown = (event) => {
    if (event.key === 'Escape' && !this.panel.hidden) this.#close();
  };

  /** @param {SubmitEvent} event */
  #onSubmit = (event) => {
    if (!this.#query.length) {
      event.preventDefault();
      this.input.focus();
      return;
    }
    this.#close();
  };

  #onClear = () => {
    this.input.value = '';
    this.#toggleClear();
    this.#close();
    this.input.focus();
  };

  /** @param {MouseEvent} event */
  #onPanelHover = (event) => {
    const target = /** @type {HTMLElement} */ (event.target);
    const link = target.closest('[data-search-item]');
    if (!link) return;
    const index = this.#items.indexOf(/** @type {HTMLElement} */ (link));
    if (index !== -1 && index !== this.#index) this.#select(index, false);
  };

  /** @param {KeyboardEvent} event */
  #onKeyDown = (event) => {
    const items = this.#items;

    switch (event.key) {
      case 'ArrowDown':
        if (this.panel.hidden) {
          this.#onFocus();
          return;
        }
        if (!items.length) return;
        event.preventDefault();
        this.#select(this.#index < items.length - 1 ? this.#index + 1 : 0, true);
        break;
      case 'ArrowUp':
        if (this.panel.hidden || !items.length) return;
        event.preventDefault();
        this.#select(this.#index > 0 ? this.#index - 1 : items.length - 1, true);
        break;
      case 'Enter':
        if (!this.panel.hidden && this.#index >= 0 && items[this.#index]) {
          event.preventDefault();
          const href = items[this.#index].getAttribute('href');
          if (href) window.location.href = href;
        }
        break;
      case 'Escape':
        if (!this.panel.hidden) {
          event.preventDefault();
          this.#close();
        }
        break;
      default:
        break;
    }
  };

  /**
   * @param {number} index
   * @param {boolean} scroll
   */
  #select(index, scroll) {
    const items = this.#items;
    this.#index = index;

    items.forEach((item, itemIndex) => {
      const row = item.closest('li') || item;
      if (itemIndex === index) {
        if (!row.id) row.id = `mahando-search-item-${itemIndex}`;
        row.setAttribute('aria-selected', 'true');
        this.input.setAttribute('aria-activedescendant', row.id);
        if (scroll) row.scrollIntoView({ block: 'nearest' });
      } else {
        row.removeAttribute('aria-selected');
      }
    });
  }

  #toggleClear() {
    if (this.clearButton) this.clearButton.hidden = this.input.value.length === 0;
  }

  /** @param {string} query */
  async #search(query) {
    const cached = this.#cache.get(query);
    if (cached !== undefined) {
      this.#render(cached);
      return;
    }

    this.#activeFetch?.abort();
    const controller = new AbortController();
    this.#activeFetch = controller;

    const url = new URL(this.dataset.url || '/search/suggest', window.location.origin);
    url.searchParams.set('q', query);
    url.searchParams.set('section_id', this.dataset.section || 'mahando-search-suggest');
    url.searchParams.set('resources[type]', 'product,collection,page,query');
    url.searchParams.set('resources[limit]', '6');
    url.searchParams.set('resources[limit_scope]', 'each');
    url.searchParams.set('resources[options][unavailable_products]', 'last');
    url.searchParams.set(
      'resources[options][fields]',
      'title,product_type,variants.title,vendor,variants.sku,variants.barcode'
    );

    this.classList.add('is-loading');

    try {
      const response = await fetch(url.toString(), { signal: controller.signal });
      if (!response.ok) throw new Error(`Suchvorschläge: HTTP ${response.status}`);

      const markup = await response.text();
      const doc = new DOMParser().parseFromString(markup, 'text/html');
      const results = doc.querySelector('.mahando-search-results');
      const html = results ? results.outerHTML : '';

      if (this.#cache.size > 40) {
        const first = this.#cache.keys().next().value;
        if (first !== undefined) this.#cache.delete(first);
      }
      this.#cache.set(query, html);

      // Nur rendern, wenn der Suchbegriff inzwischen nicht weitergetippt wurde
      if (this.#query === query) this.#render(html);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      console.warn(error);
      this.#close();
    } finally {
      if (this.#activeFetch === controller) {
        this.#activeFetch = null;
        this.classList.remove('is-loading');
      }
    }
  }

  /** @param {string} html */
  #render(html) {
    if (!html) {
      this.#close();
      return;
    }
    this.panel.innerHTML = html;
    this.#index = -1;
    this.input.removeAttribute('aria-activedescendant');
    this.panel.hidden = false;
    this.input.setAttribute('aria-expanded', 'true');
    this.classList.add('is-open');
  }

  #close() {
    if (this.panel.hidden) return;
    this.panel.hidden = true;
    this.#index = -1;
    this.input.setAttribute('aria-expanded', 'false');
    this.input.removeAttribute('aria-activedescendant');
    this.classList.remove('is-open');
  }
}

if (!customElements.get('mahando-search')) {
  customElements.define('mahando-search', MahandoSearch);
}
