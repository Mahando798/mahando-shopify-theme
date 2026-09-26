# Mahando Shopify-Theme

Eigenes Theme für den Mahando-Shop auf Basis von **Shopify Horizon 4.2.0** (Upstream-Commit `5acd1b6`, 21.09.2026).
Horizon liefert Header, Mega-Menü, Suche, Warenkorb-Drawer, Filter, Varianten und deutsche Texte;
alles Mahando-Spezifische liegt in eigenen Dateien mit dem Präfix `mahando-`.

## Design

| Was | Wert | Wo |
|---|---|---|
| Primärfarbe (Buttons, Links) | Türkis `#0A7E83` | `config/settings_data.json` → `color_palette.color1` |
| Rabatt/Sale | Pink `#D82A6F` | `badge_sale_background_color` |
| Text | Dunkelgrau `#1D2B33` | `color_palette.foreground` |
| Flächen / Rahmen | `#EEF3F5` / `#DCE5E9` | `color2` / `color3` |
| Seitenhintergrund | `#F5F8F9` | `page_background_color` |
| Überschriften | Outfit 600/700 | `snippets/mahando-fonts.liquid` |
| Fließtext, Preise | Source Sans 3 | `snippets/mahando-fonts.liquid` |

Die Schriften liegen als WOFF2 im Theme (`assets/mahando-*.woff2`, SIL Open Font License) und werden vom
Shopify-CDN ausgeliefert – **keine Google-Fonts-Verbindung** (Abmahnrisiko). Über Theme-Einstellungen → Mahando
→ „Mahando-Schriften verwenden“ lässt sich auf die Shopify-Font-Picker zurückschalten.

Das Logo ist als SVG eingebaut (`assets/mahando-logo*.svg`) und wird verwendet, solange unter
Theme-Einstellungen → Logo kein eigenes Bild hochgeladen ist. Favicon ebenfalls (Wellen).

## Installation

**Variante A – ZIP:** Onlineshop → Themes → „Theme hinzufügen“ → „ZIP-Datei hochladen“. Dann „Anpassen“, prüfen,
zuletzt „Veröffentlichen“. Der alte Look bleibt bis dahin online.

**Variante B – GitHub:** Repo unter GitHub anlegen, dieses Verzeichnis pushen, in Shopify unter Onlineshop → Themes →
„Theme hinzufügen“ → „Aus GitHub verbinden“ den Branch `main` wählen. Jeder Push aktualisiert das Theme; Änderungen
im Theme-Editor werden zurück ins Repo committet.

## Einrichtung im Shopify-Admin (Pflicht)

1. **Navigation** (Onlineshop → Navigation)
   - `main-menu` (Hauptmenü): Computer + Tablets · Foto + Video · Gaming · Handy · Haushalt + Garten · Spielzeug ·
     Wohnen · Beauty + Wellness · Sale. Jeder Punkt zeigt auf seine Kollektion; Unterpunkte (z. B. Notebooks, Tablets)
     erscheinen im Mega-Menü und als Chips auf der Kategorieseite.
   - `informationen`: Über uns, Kontakt, Zahlung & Versand, Rücksendung anmelden, Fragen & Antworten.
   - `rechtliches`: Impressum, AGB, Widerrufsbelehrung, Datenschutzerklärung, Batteriegesetz-Hinweise, Elektro-Altgeräte.
   - Optional je Kategorie ein Menü, dessen **Handle dem Kollektions-Handle entspricht** (z. B. `haushalt-garten`) –
     dann nutzt die Chips-Sektion dieses Menü statt der Unterpunkte des Hauptmenüs.
2. **Kollektionen** (Produkte → Kollektionen), alle automatisch:
   - Je Kategorie: Bedingung „Produkttyp ist gleich …“ (Produkttyp kommt aus Xentral, siehe unten).
   - Unterkategorien: Bedingung „Produkt-Tag ist gleich …“.
   - `bestseller`: Sortierung „Bestseller“, Bedingung z. B. „Bestand > 0“.
   - `sale`: Bedingung „Vergleichspreis ist größer als 0“ (Sale = Artikel mit gesetztem Vergleichspreis/UVP).
3. **Versand** (Einstellungen → Versand): Deutschland pauschal 4,99 €, kostenlos ab 300 € Bestellwert. Die Anzeige-
   Texte im Theme stehen unter Theme-Einstellungen → Mahando → Versandkosten.
4. **Rechtstexte** (Einstellungen → Richtlinien): Versandrichtlinie unbedingt ausfüllen – der Link „zzgl. Versandkosten“
   an jedem Preis zeigt dorthin. Widerruf, AGB, Datenschutz, Impressum als Seiten anlegen und im Menü `rechtliches`
   verlinken. Rechtstexte am besten über einen Anbieter (IT-Recht Kanzlei / Händlerbund) mit Shopify-Schnittstelle.
5. **Zahlungen:** Shopify Payments (Karte, Apple/Google Pay, Klarna) + PayPal. Die Icons im Footer folgen automatisch.
6. **Steuern:** Einstellungen → Steuern → „Alle Preise inkl. Steuern“ aktivieren, sonst fehlt „inkl. MwSt.“.
7. **Filter:** App „Shopify Search & Discovery“ installieren und Filter aktivieren: Verfügbarkeit, Preis, Produkttyp,
   Hersteller, Metafeld `mahando.zustand`.
8. **Metafeld-Definitionen** (Einstellungen → Benutzerdefinierte Daten → Produkte), Namespace `mahando`:

   | Schlüssel | Typ | Inhalt |
   |---|---|---|
   | `zustand` | Einzeiliger Text | `neu` (Standard, leer lassen), `verpackung-beschaedigt`, `b-ware`, `auslaufmodell` |
   | `zustand_hinweis` | Einzeiliger Text | Erklärtext zum Zustand (optional, sonst Standardtext) |
   | `technische_daten` | Mehrzeiliger Text | eine Zeile je Eintrag: `Spannung: 20 V` |
   | `lieferumfang` | Mehrzeiliger Text | eine Zeile je Position, optional mit `- ` als Aufzählung |
   | `sicherheitshinweise` | Mehrzeiliger Text | Warn-/Sicherheitshinweise |
   | `hersteller_name` | Einzeiliger Text | GPSR-Pflichtangabe |
   | `hersteller_anschrift` | Mehrzeiliger Text | GPSR-Pflichtangabe |
   | `hersteller_kontakt` | Einzeiliger Text | E-Mail oder Telefon |
   | `eu_verantwortlicher` | Mehrzeiliger Text | nur bei Herstellern außerhalb der EU |

   Alle Metafelder als „Storefront-Zugriff“ freigeben, damit das Theme sie lesen kann.

## Datenfluss aus Xentral

| Shopify-Feld | Quelle in Xentral | Wirkung im Theme |
|---|---|---|
| Titel, Beschreibung, Bilder, Preis, Bestand | Standard-Sync | Produktkarte, Produktseite, Verfügbarkeit („Nur noch X Stück“ ab Bestand ≤ 5) |
| Vergleichspreis | UVP **nur bei reduzierten Artikeln** setzen | Streichpreis + Badge „−X %“, Kollektion `sale` |
| Produkttyp | Kategorie | Kategorie-Label auf Karten, automatische Kategorie-Kollektionen |
| Tags | Unterkategorie; Zustand (`verpackung-beschaedigt`, `b-ware`, `auslaufmodell`); `neu`; `einzelstueck`; `elektro`/`akku`/`batterie` | Unterkategorie-Kollektionen, Badges, Zustandshinweis, Entsorgungshinweis (ElektroG/BattG) |
| SKU | Artikelnummer | „Art.-Nr.“ auf der Produktseite |
| Barcode | EAN | „EAN“ auf der Produktseite |
| Hersteller (Vendor) | Hersteller | Filter, GPSR-Fallback |
| Metafelder `mahando.*` | Freifelder (Zuordnung im Xentral-Connector prüfen, alternativ per Matrixify/Flow) | Zustand, technische Daten, Lieferumfang, GPSR |

Badge „Neu“ erscheint automatisch für Artikel jünger als 30 Tage (Theme-Einstellung) oder mit Tag `neu`.

## Theme-Einstellungen → Mahando

Schriften, eingebautes Logo, Suchleiste im Header, Badges (Prozent, Neu-Frist, Einzelstück), Verfügbarkeits-Schwelle,
Lieferzeit- und Versandtexte, Telefon/Servicezeiten, Entsorgungshinweis.

## Eigene Dateien (alles mit Präfix `mahando-`)

- `assets/`: `mahando.css` (globale Feinjustierung), `mahando-*.woff2` (Schriften), `mahando-logo*.svg`, `mahando-product-meta.js`
- `snippets/`: `mahando-fonts`, `mahando-icon`, `mahando-badges`
- `blocks/`: `mahando-availability`, `mahando-product-type`, `mahando-product-meta`, `mahando-condition`,
  `mahando-shipping-info`, `mahando-specs`, `mahando-gpsr`, `mahando-metafield-text`
- `sections/`: `mahando-usp-bar`, `mahando-hero`, `mahando-icon-cards`, `mahando-categories`,
  `mahando-collection-chips`, `mahando-footer-bar`

Angepasste Horizon-Dateien (klein gehalten, damit Upstream-Updates mergebar bleiben): `layout/theme.liquid`,
`layout/password.liquid`, `blocks/_header-logo.liquid`, `blocks/_product-card-gallery.liquid`, `blocks/price.liquid`,
`blocks/_product-card.liquid`, `blocks/product-card.liquid`, `blocks/_product-card-group.liquid`,
`snippets/card-gallery.liquid`, `snippets/theme-styles-variables.liquid`, `snippets/search.liquid`, `snippets/fonts.liquid`,
`sections/header.liquid`, `config/*`, `locales/de.json`, `locales/en.default.json`, Templates und Section-Groups.
Andere Sprachdateien wurden entfernt (Shop läuft auf Deutsch, Englisch bleibt als Fallback).

## Entwicklung

```bash
# Theme Check (Shopify CLI)
shopify theme check

# Lokale Vorschau gegen den Store (Login nötig)
shopify theme dev --store <shop>.myshopify.com

# Horizon-Updates einspielen
git remote add horizon https://github.com/Shopify/horizon.git
git fetch horizon && git merge horizon/main
```

Commit 1 ist der unveränderte Horizon-Stand, alles Weitere sind Mahando-Anpassungen – so bleibt jederzeit sichtbar,
was vom Upstream kommt und was eigen ist.
