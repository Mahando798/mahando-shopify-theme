import { Component } from '@theme/component';
import { StandardEvents } from '@shopify/events';

/**
 * Aktualisiert Artikelnummer (SKU) und EAN, wenn auf der Produktseite eine andere Variante gewählt wird.
 *
 * @typedef {Object} Refs
 * @property {HTMLElement} [skuItem]
 * @property {HTMLElement} [sku]
 * @property {HTMLElement} [eanItem]
 * @property {HTMLElement} [ean]
 *
 * @extends {Component<Refs>}
 */
class MahandoProductMeta extends Component {
  connectedCallback() {
    super.connectedCallback();
    this.#target().addEventListener(StandardEvents.productSelect, this.#handleProductSelect);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#target().removeEventListener(StandardEvents.productSelect, this.#handleProductSelect);
  }

  /**
   * Innerhalb der Produktsektion wird direkt dort gelauscht; außerhalb (z. B. Tabelle „Produktdetails“
   * in einer eigenen Sektion) am Dokument – das Event steigt auf.
   * @returns {EventTarget}
   */
  #target() {
    return this.closest('[id*="ProductInformation-"], [id*="QuickAdd-"], product-card') ?? document;
  }

  /** @param {CustomEvent & { promise: Promise<any> }} event */
  #handleProductSelect = (event) => {
    event.promise
      .then(({ detail }) => {
        if (!detail) return;
        const { newProduct, resource } = detail;
        if (newProduct) this.dataset.productId = newProduct.id;
        if (detail.productId && detail.productId !== this.dataset.productId) return;
        if (!resource) return;
        // Am Dokument lauschen mehrere Instanzen – nur die zum Produkt passende reagiert.
        if (resource.product_id && String(resource.product_id) !== this.dataset.productId) return;

        this.#update(this.refs.skuItem, this.refs.sku, resource.sku);
        this.#update(this.refs.eanItem, this.refs.ean, resource.barcode);
      })
      .catch((error) => {
        if (error?.name !== 'AbortError') console.warn('[mahando-product-meta] Event promise rejected:', error);
      });
  };

  /**
   * @param {HTMLElement | undefined} item
   * @param {HTMLElement | undefined} valueEl
   * @param {string | undefined} value
   */
  #update(item, valueEl, value) {
    if (!item || !valueEl) return;
    if (value) {
      valueEl.textContent = value;
      item.hidden = false;
    } else {
      valueEl.textContent = '';
      item.hidden = true;
    }
  }
}

if (!customElements.get('mahando-product-meta')) {
  customElements.define('mahando-product-meta', MahandoProductMeta);
}
