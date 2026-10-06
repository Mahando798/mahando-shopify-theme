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
     Wohnen · Sport + Freizeit · Sale. Jeder Punkt zeigt auf seine Kollektion; Unterpunkte (z. B. Notebooks, Tablets)
     erscheinen im Mega-Menü und als Chips auf der Kategorieseite.
   - `informationen`: Über uns, Kontakt, Zahlung & Versand, Rücksendung anmelden, Fragen & Antworten.
   - `rechtliches`: Impressum, AGB, Widerrufsbelehrung, Datenschutzerklärung, Batteriegesetz-Hinweise, Elektro-Altgeräte.
   - Optional je Kategorie ein Menü, dessen **Handle dem Kollektions-Handle entspricht** (z. B. `haushalt-garten`) –
     dann nutzt die Chips-Sektion dieses Menü statt der Unterpunkte des Hauptmenüs.
2. **Kollektionen** (Produkte → Kollektionen), alle automatisch, Bedingungen mit „beliebige Bedingung“:
   - Unterkategorien (z. B. `kueche`): „Produkttyp ist gleich Küche“ ODER „Produkt-Tag ist gleich Küche“.
   - Kategorien (z. B. `haushalt-garten`): eigener Name **plus alle Namen der Unterkategorien** (Typ oder Tag) –
     ein Artikel mit Tag `Küche` landet damit automatisch auch in „Haushalt + Garten“.
   - `bestseller`: Sortierung „Bestseller“, Bedingung „Preis > 0“.
   - `sale`: Bedingung „Preis ist reduziert“ (Sale = Artikel mit gesetztem Vergleichspreis/UVP).
   - **Wichtig:** Per API angelegte Kollektionen sind zunächst für keinen Vertriebskanal freigegeben (404 im Shop,
     Kacheln ohne Link). Im Admin unter Kollektion → „Vertriebskanäle“ den Onlineshop aktivieren.
3. **Versand** (Einstellungen → Versand): Deutschland pauschal 4,99 €, kostenlos ab 300 € Bestellwert. Es wird nur
   innerhalb Deutschlands geliefert – im Versandprofil darf nur die Zone „Deutschland“ existieren (Zonen „EU“ und
   „International“ löschen). Die Anzeige-Texte im Theme stehen unter Theme-Einstellungen → Mahando → Versandkosten,
   der Hinweis „Wir liefern derzeit ausschließlich innerhalb Deutschlands“ steht in der Versandrichtlinie und im
   Akkordeon „Versand & Rückgabe“ der Produktseite (`templates/product.json`).
4. **Rechtstexte** (Einstellungen → Richtlinien): Versandrichtlinie unbedingt ausfüllen – der Link „zzgl. Versandkosten“
   an jedem Preis zeigt dorthin. Widerruf, AGB, Datenschutz, Impressum als Seiten anlegen und im Menü `rechtliches`
   verlinken. Rechtstexte am besten über einen Anbieter (IT-Recht Kanzlei / Händlerbund) mit Shopify-Schnittstelle.
5. **Zahlungen:** Shopify Payments (Karte, Apple/Google Pay, Klarna) + PayPal. Die Icons im Footer folgen automatisch.
6. **Steuern:** Einstellungen → Steuern und Zollgebühren: „Umsatzsteuer in Produktpreis und Versandtarif einschließen“
   und „Umsatzsteuer auf Versand erheben“ an; unter „Europäische Union“ muss für Deutschland die MwSt.-Erhebung mit
   der USt-IdNr. aktiv sein (seit 29.09.2026 aktiv – vorher rechnete Shopify mit 0 %). Kein OSS, da nur Deutschland
   beliefert wird.
7. **Filter:** App „Shopify Search & Discovery“ installieren und Filter aktivieren: Verfügbarkeit, Preis, Produkttyp,
   Hersteller, Metafeld `mahando.zustand`.
8. **Metafeld-Definitionen** (Einstellungen → Benutzerdefinierte Daten → Produkte), Namespace `mahando` –
   sind im Shop bereits angelegt (angepinnt, Storefront-Zugriff), hier die Übersicht:

   | Schlüssel | Typ | Inhalt |
   |---|---|---|
   | `zustand` | Einzeiliger Text | `neu` (Standard, leer lassen), `verpackung-beschaedigt`, `b-ware`, `refurbished`, `auslaufmodell` |
   | `zustand_hinweis` | Einzeiliger Text | Erklärtext zum Zustand (optional, sonst Standardtext) |
   | `highlights` | Mehrzeiliger Text | „Auf einen Blick“ auf der Produktseite, eine Zeile je Stichpunkt (sonst Listenpunkte aus der Beschreibung) |
   | `technische_daten` | Mehrzeiliger Text | eine Zeile je Eintrag: `Spannung: 20 V` |
   | `lieferumfang` | Mehrzeiliger Text | eine Zeile je Position, optional mit `- ` als Aufzählung |
   | `sicherheitshinweise` | Mehrzeiliger Text | Warn-/Sicherheitshinweise |
   | `hersteller_name` | Einzeiliger Text | GPSR-Pflichtangabe |
   | `hersteller_anschrift` | Mehrzeiliger Text | GPSR-Pflichtangabe |
   | `hersteller_kontakt` | Einzeiliger Text | E-Mail oder Telefon |
   | `eu_verantwortlicher` | Mehrzeiliger Text | nur bei Herstellern außerhalb der EU |

   Filter nach Hersteller/Produkttyp kommen aus der App „Shopify Search & Discovery“ (installiert) – dort unter
   „Filter“ anlegen; das Theme zeigt alle konfigurierten Filter automatisch links an.

9. **Kategorietexte:** Alle Haupt- und Unterkategorien sowie Sale haben eine Beschreibung (2–3 Sätze, Sie-Form,
   gesetzt am 29.09.2026). Sie erscheint im Kopf der Kategorieseite; fehlt sie, zeigt das Theme einen Standardtext.
10. **Seite „Über uns“** (`/pages/ueber-uns`, Template `page.ueber-uns.json`, Sektion `mahando-about`, Menü
    „Informationen“, angelegt 30.09.2026): Einleitung, Lagerfoto, vier Kennzahlen, Geschichte, „So arbeiten wir“,
    zweites Lagerfoto, Inhaber-Karte, Kontakt-Hinweis. Alle Texte und Zahlen stehen im Template bzw. in den
    Sektions-Einstellungen (Theme-Editor). Die Fotos liegen als Fallback im Theme (`assets/mahando-ueber-uns-*.jpg`)
    und können im Theme-Editor durch Bilder aus „Inhalt → Dateien“ ersetzt werden. Kennzahlen (Bestellungen,
    Paletten, Fläche) bei Bedarf jährlich aktualisieren.
11. **Adressen:** Firmenadresse (Impressum, Footer, Kontakt-Richtlinie, Datenschutz) ist Silbeker Weg 45, 33142 Büren;
    Lager und Rücksende-/Widerrufsadresse ist Haarener Str. 3, 33142 Büren (steht in der Widerrufsbelehrung). Alle
    Rechtstexte nennen support@mahando.de als Kontaktadresse.
12. **Store-Check 04.10.2026:** 23 Kollektionen des Vorgänger-Shops gelöscht (star-wars, barbie, pokemon, hot-wheels,
    brandneu, rabattaktionen, sonderaktionen, spielzeug-alt, elektronikartikel, neu-eingetroffen, frontpage u. a.) und
    per URL-Weiterleitung auf die passenden neuen Kategorien bzw. `/collections/all` umgeleitet. Kategorien ohne Artikel
    zeigen einen eigenen Leerzustand (Hinweis + Buttons zu Bestsellern/Kategorien) und blenden Filter/Sortierung aus
    (`snippets/product-grid.liquid`, `sections/main-collection.liquid`). Leerzustand der Suche: Kollektion „bestseller“
    (Theme-Einstellung `empty_state_collection`). Warenkorb-Wording in `locales/de.json`: „Zur Kasse“, „Gesamtbetrag“,
    „Inkl. MwSt. … an der Kasse berechnet“.
    Seite „Für Händler (B2B)“ neu: Template `page.b2b.json` (Einleitung aus dem Seiteninhalt, Karten „Was wir bieten“,
    „So läuft es ab“, Händlerkontakt b2b@mahando.de), Sie-Form, ohne „Restposten“. Versandrichtlinie um den Abschnitt
    „Zahlungsarten“ ergänzt (PayPal, Klarna, Kreditkarte, Maestro, Apple Pay, Google Pay, Shop Pay – kein Rechnungskauf).
    Hauptmenü auf dem Desktop als klassisches Dropdown unter dem Menüpunkt (CSS in `assets/mahando.css`, Horizon-Mega-Menü
    bleibt im Code erhalten).
    **Leere Kategorien** (Stand 06.10.2026): Kollektions-Links ohne Artikel werden automatisch ausgeblendet – im
    Desktop-Dropdown, in der Navigationsleiste, im Mobil-Drawer und in den Chips der Kategorieseite
    (`snippets/mahando-menu-visible.liquid`, eingebunden in `blocks/_header-menu.liquid`, `snippets/mega-menu-list.liquid`,
    `snippets/header-drawer.liquid`, `sections/mahando-collection-chips.liquid`). Hauptkategorien mit Unterpunkten bleiben
    immer sichtbar (ohne Dropdown, wenn alle Unterpunkte leer sind); ein Hauptpunkt ohne Unterpunkte (z. B. „Sale“) erscheint
    erst, wenn die Kollektion Artikel hat. „Sale“ ist eine automatische Kollektion (Regel: Streichpreis gesetzt). Der leere
    Blog „News“ wurde gelöscht. Startseiten-Newsletter zweispaltig (Text links, Formular rechts). Rücksendeweg einheitlich:
    per E-Mail an support@mahando.de mit Bestellnummer (Startseite, Kontaktseite, Produktseite).
13. **Suche** (Stand 03.10.2026): Die Header-Suchleiste (Desktop, Theme-Einstellung „Große Suchleiste“) ist ein
    echtes Suchfeld (`snippets/search.liquid`, Element `<mahando-search>`, Skript `assets/mahando-search.js`). Ab zwei
    Zeichen lädt es die Section `mahando-search-suggest` über `/search/suggest` und zeigt die Vorschläge direkt unter
    der Leiste: Suchbegriffe, bis zu sechs Produkte als Zeilen (Bild, Titel, Hersteller, Preis, Verfügbarkeit),
    Kategorien/Seiten als Chips und den Link zur Ergebnisseite. Durchsucht werden Titel, Produkttyp, Hersteller,
    Variantentitel, Artikelnummer (SKU) und EAN (Barcode). Tastatur: Pfeile, Enter, Escape. Der Such-Dialog (Lupe,
    mobil/Tablet) nutzt dieselben Zeilen (`snippets/mahando-search-results.liquid`, `mahando-search-row.liquid`,
    `mahando-search-recent.liquid`) und zeigt im Leerzustand nur noch „Zuletzt angesehen“, keine Zufallsprodukte.
    Suchbegriff-Vorschläge („queries“) liefert Shopify erst, wenn der Shop genügend Suchanfragen gesammelt hat.
14. **Verknüpfung mit Xentral** (06.10.2026): Die Xentral-Shopify-App gleicht Artikel ausschließlich über die SKU ab
    (Shopify-SKU = Xentral-Artikelnummer; „Fremdnummern“ sind aus). Alle 18 Startartikel tragen jetzt ihre
    Xentral-Artikelnummer als SKU, fehlende EANs wurden aus Xentral ergänzt (ABUS 57/45, 57/50, Hisense HS205G, X-SHOT).
    Zuordnung: ABUS 57/45 → 100028, ABUS 57/50 → 100027, FRITZ!Box 7581 (refurbished) → 100222, Derbystar → 100005,
    Hisense HS205G → 100058, Kärcher Battery Power 18/25 → 100016, Kärcher Schnellladegerät → 100015, New Era → 100035,
    Tefal Duetto+ G71944 → 100639 (Xentral-Name korrigiert, hieß fälschlich „Duetto A70544“), Duetto+ G71946 → 100993,
    OptiGrill+ GC712D → 100410 (EAN in Xentral ergänzt), X-SHOT Trace Fire → 100258. Neu in Xentral angelegt (API,
    Nummern aus dem Nummernkreis): 101027 Kärcher GSH 4-4 Plus **Battery Set** (1.445-321.0; 100203 ist die Solo-Version
    1.445-320.0), 101028 FRITZ!Box 6660 Cable neu, 101029 FRITZ!Box 6660 Cable refurbished (gleiche EAN, Freifeld
    Zustand), 101030 Bosch EasyGrassCut 23, 101031 Kärcher LTR 3-18 Dual Battery Set, 101032 Tefal Easy Fry Oven & Grill
    FW5018. Zustand steht in Xentral im Freifeld 1 „Zustand“ (`neu`, `refurbished`, `gebraucht`).

## Datenstandard je Artikel (so sind die 18 Startartikel gepflegt)

| Feld | Inhalt | Beispiel |
|---|---|---|
| Titel | Marke Modell – Art, wichtigste Merkmale (Zustand) | `Kärcher LTR 3-18 Dual Battery Set – Akku-Rasentrimmer 36 V, 30 cm, inkl. 2 Akkus & Ladegerät (Neu & OVP)` |
| Beschreibung | 2 kurze Absätze, sachlich, Sie-Form, keine Werbesprüche, keine Aufzählung (die kommt aus `highlights`) | „Der Kärcher LTR 3-18 ist ein Akku-Rasentrimmer mit 30 cm Schnittkreis …“ |
| Produkttyp | Artikelart, ein Wort/Begriff | `Rasentrimmer`, `Router`, `Kochtopf`, `Gel-Blaster` |
| Tags | Unterkategorie exakt wie im Shop (`Garten`, `Netzwerk`, `Küche`, …) + `elektro` (Elektrogerät), `akku`/`batterie` (enthält Akku/Batterie), `refurbished`/`b-ware`/… (Zustand) | `Garten, elektro, akku` |
| `mahando.highlights` | 4–5 Zeilen „Auf einen Blick“ | `36 V Dual-Akku-System mit zwei 18-V-Akkus` |
| `mahando.technische_daten` | eine Zeile je Wert `Schlüssel: Wert` | `Schnittkreis: 30 cm` |
| `mahando.lieferumfang` | eine Zeile je Position; nur angeben, wenn sicher bekannt | `2 × Akku Battery Power 18 V / 2,0 Ah` |
| `mahando.sicherheitshinweise` | Warnhinweise (Spielzeug ab 14, Akkus, Kleinteile) | „Nicht auf Augen oder Gesicht zielen.“ |
| `mahando.zustand` / `zustand_hinweis` | nur bei Nicht-Neuware | `refurbished` / „Professionell aufbereitet, geprüft …“ |
| `mahando.hersteller_*`, `eu_verantwortlicher` | GPSR-Angaben je Marke (siehe Tabelle) | |

**GPSR-Herstellerangaben je Marke** (Stand 29.09.2026, Quellen: Hersteller-Impressum/-Anleitungen, GPSR-Blöcke bei Otto/Alternate/Hornbach; in Xentral als Hersteller-Stammdaten pflegen):

| Marke | Hersteller | Anschrift | Kontakt | EU-Verantwortlicher |
|---|---|---|---|---|
| ABUS | ABUS August Bremicker Söhne KG | Altenhofer Weg 25, 58300 Wetter (Ruhr), DE | info@abus.de, +49 2335 634-0 | – |
| AVM / FRITZ! | FRITZ! GmbH (vormals AVM GmbH) | Alt-Moabit 95, 10559 Berlin, DE | info@fritz.com, +49 30 39976-0 | – |
| Bosch (Home & Garden) | Robert Bosch Power Tools GmbH | Max-Lang-Straße 40-46, 70771 Leinfelden-Echterdingen, DE | kontakt@bosch.de, +49 711 400 40990 | – |
| Derbystar | DERBYSTAR Sportartikelfabrik GmbH | Feldstraße 195, 47574 Goch, DE | info@derbystar.de, +49 2823 325-0 | – |
| Hisense (Audio) | Xin Yang (Hong Kong) Co., Ltd. | 148 Connaught Road West, Hongkong | xyzlb@xinyangitc.com | Gorenje gospodinjski aparati, d.o.o., Partizanska cesta 12, 3320 Velenje, SI, info@gorenje.com – **mit Verpackung abgleichen** |
| Kärcher | Alfred Kärcher SE & Co. KG | Alfred-Kärcher-Straße 28-40, 71364 Winnenden, DE | info@karcher.com, +49 7195 14-0 | – |
| New Era | New Era Cap Co., Inc. | 160 Delaware Avenue, Buffalo, NY 14202, USA | customer.care@neweracap.com | New Era Cap GmbH, Lichtstraße 25, 50825 Köln, germany@neweracap.com |
| Tefal | SEB S.A.S. (Groupe SEB) | 21260 Selongey, FR | Tefal-Service +49 7331 256 256, tefal.de/contact-form | – (Vertrieb DE: Groupe SEB WMF Consumer GmbH, Geislingen) – **mit Verpackung abgleichen** |
| X-SHOT (ZURU) | ZURU Inc. | Energy Plaza, 92 Granville Road, Kowloon, Hongkong | care@zuru.com, +852 3746 9003 | ZURU Germany GmbH, Bleichstraße 8-10, 40211 Düsseldorf, care@zuru.com |

## Rechtliche Pflichtelemente (Stand 30.09.2026)

- **Gesetzlicher Gewährleistungshinweis** (Durchführungsverordnung (EU) 2025/1960, Pflicht seit 27.09.2026): Das amtliche
  deutsche Plakat der EU-Kommission liegt unverändert unter `assets/mahando-gewaehrleistung-de.png` (Original-PNG
  1654×2339) und `.svg`; es darf nicht bearbeitet werden. Eingebaut über `snippets/mahando-gewaehrleistung.liquid`:
  Produktseite (Block `mahando-gewaehrleistung` in der Kaufbox: Satz + Link, Plakat im Dialog), Warenkorb-Drawer und
  Warenkorbseite (Link direkt über dem Button „Zur Kasse“ in `snippets/cart-summary.liquid`; das Plakat in voller
  Größe auf der Warenkorbseite wurde am 04.10.2026 entfernt), Seite `/pages/gewaehrleistung` (Template `page.gewaehrleistung.json`,
  Sektion `mahando-gewaehrleistung`, Footer-Menü „rechtliches“) sowie in der Bestellbestätigungs-Mail (Einstellungen →
  Benachrichtigungen → Bestellbestätigung; Bild aus „Inhalt → Dateien“). Die Kommissions-Leitlinien erlauben die
  Anzeige per Klick/Mouseover, verlangen aber immer den klickbaren Link auf europa.eu/youreurope/garantien.
- **Widerrufsbutton** (§ 356a BGB, Pflicht seit 19.06.2026): hervorgehobener Button „Vertrag widerrufen“ ohne Login →
  Formular (Name, Bestellnummer, E-Mail) → „Widerruf bestätigen“ → sofortige automatische Eingangsbestätigung mit
  Datum/Uhrzeit. Umsetzung über die App „EU Widerrufsbutton Pro“ (Visionz GmbH); der Button wird im Footer eingebunden.

## Kunden-E-Mails (Stand 30.09.2026)

- **Absender:** Einstellungen → Benachrichtigungen → Absender-E-Mail `info@mahando.de`. Damit Mails nicht als „über
  shopifyemail.com“ erscheinen und nicht im Spam landen, muss die Domain authentifiziert sein (Einstellungen →
  Benachrichtigungen → E-Mail-Domain-Authentifizierung). Shopify verlangt 6 CNAME-Einträge bei Hetzner
  (`mailer2so`, `2so._domainkey`, `2so2._domainkey`, `mailerhzb`, `pdk1._domainkey.mailerhzb`,
  `pdk2._domainkey.mailerhzb`); **Werte bei Hetzner immer mit Punkt am Ende** eintragen, sonst hängt Hetzner
  `.mahando.de` an und Shopify meldet „DNS-Datensatz stimmt nicht überein“. Ein alter Eintrag `2so3._domainkey` wird
  nicht mehr benötigt. Zusätzlich empfohlen: TXT `_dmarc` = `v=DMARC1; p=none; rua=mailto:info@mahando.de`.
- **Sprache/Anrede:** Alle 40 Kundenbenachrichtigungen (Einstellungen → Benachrichtigungen → Kundenbenachrichtigungen)
  sind auf Deutsch und in der Sie-Form (umgestellt 30.09.2026, inkl. Betreffzeilen; „Hallo“ → „Guten Tag“). Nicht
  angefasst: POS- und B2B-Vorlagen (`buy_online`, `pos_send_cart`, `store_receipt`, `pos_exchange_v2_receipt`,
  `company_*`), da nicht im Einsatz. Wer eine Vorlage über „Auf Standard zurücksetzen“ zurücksetzt, bekommt wieder
  Shopifys Du-Form.
- **Bestellbestätigung** enthält zusätzlich den gesetzlichen Gewährleistungshinweis (siehe unten).
- **Abgebrochener Checkout** („You left an item in your basket“) kommt nicht aus den Benachrichtigungen, sondern aus
  Apps → Messaging → Automatisierungen → „Abgebrochener Checkout“ (Shopify Email). Texte dort im E-Mail-Editor auf
  Deutsch/Sie pflegen; Shopifys deutsche Vorlagen sind in der Du-Form.

## Datenfluss aus Xentral

**Stand der Anbindung (06.10.2026):** In Xentral (Einstellungen → Verkaufen → Shops/Marktplätze → Shopify) existiert die
Integration „Shopify“ im Modus **Entwicklung** (Produktivmodus aus), die **Artikelzuordnung (Artikelfilter) ist noch nicht
konfiguriert** – ohne Filter würde Xentral alle rund 1.000 Artikel synchronisieren; sinnvoll ist ein Filter wie
„Artikel Nr. IN …“ oder ein Tag `shopify`. Alle sieben Features sind eingeschaltet. Vor dem Produktivschalten zu klären:
Artikel-, Kategorie- und Preisabgleich (Xentral → Shop) überschreiben Shopify-Titel/-Texte/-Preise mit den Xentral-Daten;
der Bestandsabgleich würde mit dem aktuellen Xentral-Bestand (0 bei allen Artikeln) alle Artikel auf „Ausverkauft“
setzen – vorher Bestände in Xentral buchen. Die Shopify-Bestände (99–6000) sind bis dahin Platzhalter.

| Shopify-Feld | Quelle in Xentral | Wirkung im Theme |
|---|---|---|
| Titel, Beschreibung, Bilder, Preis, Bestand | Standard-Sync | Produktkarte, Produktseite, Verfügbarkeit („Nur noch X Stück“ ab Bestand ≤ 5) |
| Vergleichspreis | UVP **nur bei reduzierten Artikeln** setzen | Streichpreis + Badge „−X %“, Kollektion `sale` |
| Tags | **Unterkategorie exakt wie im Shop benannt** (z. B. `Küche`, `Netzwerk`, `TV & Audio`) – reicht für Unter- und Hauptkategorie; Zustand (`verpackung-beschaedigt`, `b-ware`, `refurbished`, `auslaufmodell`); `neu`; `einzelstueck`; `elektro`/`akku`/`batterie` | Kategorie-Kollektionen, Badges, Zustandshinweis, Entsorgungshinweis (ElektroG/BattG) |
| Produkttyp | Artikelart (z. B. `Kochtopf`, `Rasentrimmer`) – frei wählbar | Label auf den Produktkarten, Filter; Kategorie-Namen als Typ funktionieren ebenfalls |
| SKU | Artikelnummer | „Art.-Nr.“ auf der Produktseite |
| Barcode | EAN | „EAN“ auf der Produktseite |
| Hersteller (Vendor) | Hersteller | Filter, GPSR-Fallback |
| Metafelder `mahando.*` | Freifelder (Zuordnung im Xentral-Connector prüfen, alternativ per Matrixify/Flow) | Zustand, technische Daten, Lieferumfang, GPSR |

Badge „Neu“ erscheint automatisch für Artikel jünger als 30 Tage (Theme-Einstellung) oder mit Tag `neu`.

## Theme-Einstellungen → Mahando

Schriften, eingebautes Logo, Suchleiste im Header, Badges (Prozent, Neu-Frist, Einzelstück), Verfügbarkeits-Schwelle,
Lieferzeit- und Versandtexte, Telefon/Servicezeiten, Entsorgungshinweis.

## Eigene Dateien (alles mit Präfix `mahando-`)

- `assets/`: `mahando.css` (globale Feinjustierung), `mahando-*.woff2` (Schriften), `mahando-logo*.svg`,
  `mahando-product-meta.js`, `mahando-delivery.js`, `mahando-ueber-uns-*.jpg` (Fotos der Über-uns-Seite)
- `snippets/`: `mahando-fonts`, `mahando-icon`, `mahando-badges`, `mahando-zustand`, `mahando-product-category`,
  `mahando-shipping-bar`, `mahando-gewaehrleistung`
- `blocks/`: `mahando-availability`, `mahando-product-type`, `mahando-product-meta`, `mahando-condition`,
  `mahando-shipping-info`, `mahando-specs`, `mahando-gpsr`, `mahando-metafield-text`, `mahando-highlights`,
  `mahando-delivery-box`, `mahando-trust-list`, `mahando-details-table`, `mahando-section-title`,
  `mahando-product-chips`, `mahando-card-button`, `mahando-gewaehrleistung`
- `sections/`: `mahando-usp-bar`, `mahando-hero`, `mahando-icon-cards`, `mahando-categories`,
  `mahando-collection-chips`, `mahando-collection-header`, `mahando-breadcrumb`, `mahando-contact-info`,
  `mahando-gewaehrleistung`, `mahando-footer-bar`, `mahando-about`, `mahando-search-suggest`
- Suche: `snippets/mahando-search-results.liquid`, `snippets/mahando-search-row.liquid`,
  `snippets/mahando-search-recent.liquid`, `assets/mahando-search.js`

Angepasste Horizon-Dateien (klein gehalten, damit Upstream-Updates mergebar bleiben): `layout/theme.liquid`,
`layout/password.liquid`, `blocks/_header-logo.liquid`, `blocks/_product-card-gallery.liquid`, `blocks/price.liquid`,
`blocks/_product-card.liquid`, `blocks/product-card.liquid`, `blocks/_product-card-group.liquid`,
`snippets/card-gallery.liquid`, `snippets/theme-styles-variables.liquid`, `snippets/search.liquid`, `snippets/fonts.liquid`,
`sections/predictive-search.liquid`, `snippets/predictive-search-empty-state.liquid`, `assets/predictive-search.js`,
`sections/header.liquid`, `snippets/meta-tags.liquid`, `snippets/cart-drawer.liquid`, `sections/main-cart.liquid`, `config/*`, `locales/de.json`, `locales/en.default.json`, Templates und Section-Groups.
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
