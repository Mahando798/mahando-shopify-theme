"""Gemeinsamer Produktkarten-Block für alle Templates (Startseite, Kategorie, Suche, Empfehlungen)."""
HEADER = """/*
 * ------------------------------------------------------------
 * IMPORTANT: The contents of this file are auto-generated.
 *
 * This file may be updated by the Shopify admin theme editor
 * or related systems. Please exercise caution as any changes
 * made to this file may be overwritten.
 * ------------------------------------------------------------
 */
"""

def product_card(static=True, with_availability=True, with_button=True, eyebrow_source="vendor"):
    blocks = {
        "card-gallery": {
            "type": "_product-card-gallery",
            "settings": {
                "image_ratio": "square",
                "border": "none",
                "border_radius": 10,
                "padding-block-start": 0,
                "padding-block-end": 0,
                "padding-inline-start": 0,
                "padding-inline-end": 0
            },
            "blocks": {}
        },
        "card-type": {
            "type": "mahando-product-type",
            "settings": {"source": eyebrow_source, "padding-block-start": 8}
        },
        "card-title": {
            "type": "product-title",
            "settings": {
                "width": "100%",
                "max_width": "none",
                "alignment": "left",
                "type_preset": "custom",
                "font": "var(--font-body--family)",
                "font_size": "0.875rem",
                "line_height": "tight",
                "letter_spacing": "normal",
                "case": "none",
                "wrap": "pretty",
                "padding-block-start": 4,
                "padding-block-end": 0
            },
            "blocks": {}
        },
        "card-price": {
            "type": "price",
            "settings": {
                "show_sale_price_first": True,
                "show_installments": False,
                "show_tax_info": True,
                "type_preset": "h5",
                "width": "100%",
                "alignment": "left",
                "padding-block-start": 4,
                "padding-block-end": 0
            },
            "blocks": {}
        }
    }
    order = ["card-gallery", "card-type", "card-title", "card-price"]
    if with_availability:
        blocks["card-availability"] = {
            "type": "mahando-availability",
            "settings": {"show_delivery_time": True, "padding-block-start": 6}
        }
        order.append("card-availability")
    if with_button:
        blocks["card-button"] = {
            "type": "mahando-card-button",
            "settings": {"label": "In den Warenkorb", "label_options": "Optionen wählen", "style": "secondary", "show_icon": False}
        }
        order.append("card-button")
    card = {
        "type": "_product-card",
        "settings": {
            "product_card_gap": 0,
            "background_color": "{{ settings.color_palette.background }}",
            "border": "solid",
            "border_width": 1,
            "border_opacity": 100,
            "border_color": "{{ settings.color_palette.color3 }}",
            "border_radius": 14,
            "padding-block-start": 12,
            "padding-block-end": 12,
            "padding-inline-start": 12,
            "padding-inline-end": 12
        },
        "blocks": blocks,
        "block_order": order
    }
    if static:
        card["static"] = True
    return card

def product_list(section_id, heading, eyebrow, collection, button_label="Alle anzeigen", max_products=8, padding_top=0, padding_bottom=44):
    return {
        "type": "product-list",
        "blocks": {
            "static-header": {
                "type": "_product-list-content",
                "static": True,
                "settings": {
                    "content_direction": "row",
                    "vertical_on_mobile": False,
                    "horizontal_alignment": "space-between",
                    "vertical_alignment": "flex-end",
                    "gap": 16,
                    "width": "fill",
                    "padding-block-end": 0
                },
                "blocks": {
                    "heading-group": {
                        "type": "group",
                        "settings": {
                            "content_direction": "column",
                            "gap": 6,
                            "width": "fit-content",
                            "width_mobile": "fit-content",
                            "horizontal_alignment_flex_direction_column": "flex-start"
                        },
                        "blocks": {
                            "eyebrow": {
                                "type": "text",
                                "settings": {
                                    "text": f"<p>{eyebrow}</p>",
                                    "width": "fit-content",
                                    "type_preset": "custom",
                                    "font": "var(--font-body--family)",
                                    "font_size": "0.75rem",
                                    "letter_spacing": "loose",
                                    "case": "uppercase",
                                    "text_color": "#5B6B74"
                                }
                            },
                            "heading": {
                                "type": "text",
                                "settings": {
                                    "text": f"<h2>{heading}</h2>",
                                    "width": "fit-content",
                                    "type_preset": "h2",
                                    "wrap": "balance"
                                }
                            }
                        },
                        "block_order": ["eyebrow", "heading"]
                    },
                    "button": {
                        "type": "_product-list-button",
                        "settings": {
                            "label": button_label,
                            "style_class": "button-unstyled"
                        }
                    }
                },
                "block_order": ["heading-group", "button"]
            },
            "static-product-card": product_card()
        },
        "block_order": [],
        "name": heading,
        "settings": {
            "collection": collection,
            "layout_type": "grid",
            "carousel_on_mobile": False,
            "max_products": max_products,
            "columns": 4,
            "mobile_columns": "2",
            "mobile_card_size": "60cqw",
            "columns_gap": 16,
            "rows_gap": 16,
            "section_width": "page-width",
            "horizontal_alignment": "flex-start",
            "gap": 22,
            "padding-block-start": padding_top,
            "padding-block-end": padding_bottom
        }
    }
