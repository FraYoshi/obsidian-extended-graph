
import * as Color from 'src/colors/color-bits';
import { GraphColorAttributes, GraphRenderer } from "obsidian-typings";
import path from "path";
import { TextStyleFill, TextStyleFontStyle, TextStyleFontVariant, TextStyleFontWeight } from "pixi.js";
import { GraphInstances, PluginInstances } from "src/internal";

// =============================== Text Style =============================== //

export interface CSSTextStyle {
    fontFamily: string;
    fontSize: number;
    fontStyle: TextStyleFontStyle;
    fontVariant: TextStyleFontVariant;
    fontWeight: TextStyleFontWeight;
    letterSpacing: number;
    fill?: TextStyleFill;
}

const DEFAULT_TEXT_STYLE: CSSTextStyle = {
    fontFamily: 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Microsoft YaHei Light", sans-serif',
    fontSize: 14,
    fontStyle: 'normal',
    fontVariant: 'normal',
    fontWeight: 'normal',
    letterSpacing: 0
}

// ============================== Folder Style ============================== //

export interface CSSFolderTextStyle {
    textStyle: CSSTextStyle;
    align: 'left' | 'center' | 'right';
}

export interface CSSFolderStyle {
    textStyle: CSSFolderTextStyle;
    radius: number;
    borderWidth: number;
    fillOpacity: number;
    strokeOpacity: number;
    padding: { left: number, top: number, right: number, bottom: number };
}

export const DEFAULT_FOLDER_STYLE: CSSFolderStyle = {
    textStyle: {
        textStyle: DEFAULT_TEXT_STYLE,
        align: 'center',
    },
    radius: 50,
    borderWidth: 2,
    fillOpacity: 0.03,
    strokeOpacity: 0.03 * 15,
    padding: { left: 0, top: 0, right: 0, bottom: 0 },
}

// ============================ Link Label Style ============================ //

export interface CSSLinkLabelStyle {
    textStyle: CSSTextStyle,
    radius: number;
    borderWidth: number;
    borderColor: GraphColorAttributes;
    padding: { left: number, top: number, right: number, bottom: number };
    backgroundColor: GraphColorAttributes;
}

const DEFAULT_LINK_LABEL_STYLE: CSSLinkLabelStyle = {
    textStyle: DEFAULT_TEXT_STYLE,
    radius: 0,
    borderWidth: 0,
    padding: { left: 0, top: 0, right: 0, bottom: 0 },
    borderColor: { rgb: 0, a: 0 },
    backgroundColor: { rgb: 0, a: 0 }
}

// ==================== Creation of the <style> elements ==================== //

const cssDivId = "extended-graph-css-div";

export function applyCSSStyle(instances: GraphInstances): void {
    applyCoreCSSStyle(instances);
    applyExtendedCSSStyle(instances);
}

function applyCoreCSSStyle(instances: GraphInstances): void {
    if (!instances.coreStyleEl) return;

    const colors = instances.renderer.colors;

    const css = `
    .graph-view.color-fill {
        color: ${colorAttributes2hex(colors.fill)};
    }
    .graph-view.color-fill-focused {
        color: ${colorAttributes2hex(colors.fillFocused)};
    }
    .graph-view.color-fill-tag {
        color: ${colorAttributes2hex(colors.fillTag)};
    }
    .graph-view.color-fill-attachment {
        color: ${colorAttributes2hex(colors.fillAttachment)};
    }
    .graph-view.color-fill-unresolved {
        color: ${colorAttributes2hex(colors.fillUnresolved)};
        opacity: ${colors.fillUnresolved.a};
    }
    .graph-view.color-arrow {
        color: ${colorAttributes2hex(colors.arrow)};
        opacity: ${colors.arrow.a};
    }
    .graph-view.color-circle {
        color: ${colorAttributes2hex(colors.fillFocused)};
    }
    .graph-view.color-line {
        color: ${colorAttributes2hex(colors.line)};
    }
    .graph-view.color-text {
        color: ${
        // @ts-ignore
        colorAttributes2hex(colors.text)
        };
    }
    .graph-view.color-fill-highlight {
        color: ${colorAttributes2hex(colors.fillHighlight)};
    }
    .graph-view.color-line-highlight {
        color: ${colorAttributes2hex(colors.lineHighlight)};
    }
    body {
        font-family: ${getComputedStyle(instances.renderer.interactiveEl).fontFamily};
    }`;


    instances.coreStyleEl.innerHTML = css;
}

function applyExtendedCSSStyle(instances: GraphInstances): void {
    if (!instances.extendedStyleEl) return;

    // First, add base styling with default values
    const css = `
    .graph-view.node-text {
        font-family: ${DEFAULT_TEXT_STYLE.fontFamily};
        font-size: ${DEFAULT_TEXT_STYLE.fontSize};
        font-style: ${DEFAULT_TEXT_STYLE.fontStyle};
        font-variant: ${DEFAULT_TEXT_STYLE.fontVariant};
        font-weight: ${DEFAULT_TEXT_STYLE.fontWeight};
        letter-spacing: ${DEFAULT_TEXT_STYLE.letterSpacing}px;
    }
    .graph-view.link-text {
        font-family: ${DEFAULT_LINK_LABEL_STYLE.textStyle.fontFamily};
        font-size: ${DEFAULT_LINK_LABEL_STYLE.textStyle.fontSize};
        font-style: ${DEFAULT_LINK_LABEL_STYLE.textStyle.fontStyle};
        font-variant: ${DEFAULT_LINK_LABEL_STYLE.textStyle.fontVariant};
        font-weight: ${DEFAULT_LINK_LABEL_STYLE.textStyle.fontWeight};
        letter-spacing: ${DEFAULT_LINK_LABEL_STYLE.textStyle.letterSpacing}px;
        
        border-radius: ${DEFAULT_LINK_LABEL_STYLE.radius}px;
        border-width: ${DEFAULT_LINK_LABEL_STYLE.borderWidth}px;
        border-color: ${colorAttributes2hex(DEFAULT_LINK_LABEL_STYLE.borderColor)};
        padding: ${DEFAULT_LINK_LABEL_STYLE.padding.top}px ${DEFAULT_LINK_LABEL_STYLE.padding.right}px ${DEFAULT_LINK_LABEL_STYLE.padding.bottom}px ${DEFAULT_LINK_LABEL_STYLE.padding.left}px;
        background-color: ${colorAttributes2hex(DEFAULT_LINK_LABEL_STYLE.backgroundColor)};
    }
    .graph-view.folder {
        font-family: ${DEFAULT_FOLDER_STYLE.textStyle.textStyle.fontFamily};
        font-size: ${DEFAULT_FOLDER_STYLE.textStyle.textStyle.fontSize}px;
        font-style: ${DEFAULT_FOLDER_STYLE.textStyle.textStyle.fontStyle};
        font-variant: ${DEFAULT_FOLDER_STYLE.textStyle.textStyle.fontVariant};
        font-weight: ${DEFAULT_FOLDER_STYLE.textStyle.textStyle.fontWeight};
        letter-spacing: ${DEFAULT_FOLDER_STYLE.textStyle.textStyle.letterSpacing}px;
        text-align: ${DEFAULT_FOLDER_STYLE.textStyle.align};

        border-radius: ${DEFAULT_FOLDER_STYLE.radius}px;
        border-width: ${DEFAULT_FOLDER_STYLE.borderWidth}px;
        opacity: ${DEFAULT_FOLDER_STYLE.fillOpacity};
        padding: ${DEFAULT_FOLDER_STYLE.padding.top}px ${DEFAULT_FOLDER_STYLE.padding.right}px ${DEFAULT_FOLDER_STYLE.padding.bottom}px ${DEFAULT_FOLDER_STYLE.padding.left}px;
    }`;

    // Then, add custom styling from the snippet
    const snippetName = PluginInstances.settings.cssSnippetFilename;
    if (!PluginInstances.app.customCss.enabledSnippets.has(snippetName)) return;

    const snippet = [...PluginInstances.app.customCss.csscache.entries()].find(p => path.basename(p[0], ".css") === snippetName);
    if (!snippet) return;
    instances.extendedStyleEl.innerHTML = css + "\n" + snippet[1];
}

// ============================ Helper functions ============================ //

function getGraphComputedStyle(instances: GraphInstances, cssClass: string, data: { path?: string, source?: string, target?: string } = {}): CSSStyleDeclaration | undefined {
    if (!instances.extendedStyleEl) return;

    detachCSSDiv(instances);
    const div = instances.extendedStyleEl.ownerDocument.createElement("div", {});
    instances.extendedStyleEl.ownerDocument.body.appendChild(div);
    div.classList.add("graph-view", cssClass);
    div.id = cssDivId;
    if (data.path) div.setAttribute('data-path', data.path);
    if (data.source) div.setAttribute('data-source', data.source);
    if (data.target) div.setAttribute('data-target', data.target);
    div.style.borderStyle = 'solid';
    const style = getComputedStyle(div);
    return style;
}

function detachCSSDiv(instances: GraphInstances): void {
    instances.extendedStyleEl?.ownerDocument.getElementById(cssDivId)?.remove();
}

function getUnitlessValue(valueString: string, fallback: number): number {
    valueString = valueString.toLowerCase();
    let value = fallback;
    value = parseFloat(valueString.substring(0, valueString.length - 2));
    if (isNaN(value)) {
        value = fallback;
    }
    return value;
}

// ====================== Get style for a given element ===================== //

function getTextStyle(instances: GraphInstances, cssClass: string, data: { path?: string, source?: string, target?: string } = {}): CSSTextStyle {
    if (!instances.extendedStyleEl) return DEFAULT_TEXT_STYLE;

    const style = getGraphComputedStyle(instances, cssClass, data);
    if (!style) return DEFAULT_TEXT_STYLE;

    const fontFamily = style.fontFamily;

    const fontSize = getUnitlessValue(style.fontSize, DEFAULT_TEXT_STYLE.fontSize);

    let fontStyle = style.fontStyle.toLowerCase();
    if (!['normal', 'italic', 'oblique'].contains(fontStyle)) {
        fontStyle = DEFAULT_TEXT_STYLE.fontStyle;
    }

    let fontVariant = style.fontVariant.toLowerCase();
    if (!['normal', 'small-caps'].contains(fontVariant)) {
        fontVariant = DEFAULT_TEXT_STYLE.fontVariant;
    }

    let fontWeight = style.fontWeight.toLowerCase();
    if (!['normal', 'bold', 'bolder', 'lighter', '100', '200', '300', '400', '500', '600', '700', '800', '900'].contains(fontWeight)) {
        fontWeight = DEFAULT_TEXT_STYLE.fontWeight;
    }

    const letterSpacing = getUnitlessValue(style.letterSpacing, DEFAULT_TEXT_STYLE.letterSpacing);

    const fill = getGraphComputedStyle(instances, "color-text", data)?.color ?? DEFAULT_TEXT_STYLE.fill;

    const textStyle = {
        fontFamily: fontFamily,
        fontSize: fontSize,
        fontStyle: fontStyle as TextStyleFontStyle,
        fontVariant: fontVariant as TextStyleFontVariant,
        fontWeight: fontWeight as TextStyleFontWeight,
        letterSpacing: letterSpacing,
        fill: fill
    };

    detachCSSDiv(instances);
    return textStyle;
}

export function getNodeTextStyle(instances: GraphInstances, path?: string): CSSTextStyle {
    return getTextStyle(instances, "node-text", { path: path });
}

export function getLinkLabelStyle(instances: GraphInstances, data: { source?: string, target?: string } = {}): CSSLinkLabelStyle {
    const textStyle = getTextStyle(instances, "link-text", data);

    const style = getGraphComputedStyle(instances, "link-text", data);
    if (!style) return DEFAULT_LINK_LABEL_STYLE;

    const radius = getUnitlessValue(style.borderRadius, DEFAULT_LINK_LABEL_STYLE.radius);
    const borderWidth = getUnitlessValue(style.borderWidth, DEFAULT_LINK_LABEL_STYLE.borderWidth);
    const padding = {
        left: getUnitlessValue(style.paddingLeft, DEFAULT_LINK_LABEL_STYLE.padding.left),
        top: getUnitlessValue(style.paddingTop, DEFAULT_LINK_LABEL_STYLE.padding.top),
        right: getUnitlessValue(style.paddingRight, DEFAULT_LINK_LABEL_STYLE.padding.right),
        bottom: getUnitlessValue(style.paddingBottom, DEFAULT_LINK_LABEL_STYLE.padding.bottom),
    }

    return {
        textStyle: textStyle,
        borderWidth: borderWidth,
        padding: padding,
        radius: radius,
        backgroundColor: Color.parseCSS(style.backgroundColor),
        borderColor: Color.parseCSS(style.borderColor),
    }
}

export function getFolderStyle(instances: GraphInstances, path?: string): CSSFolderStyle {
    const textStyle = getTextStyle(instances, "folder", { path });
    const style = getGraphComputedStyle(instances, "folder", { path });
    if (!style) return DEFAULT_FOLDER_STYLE;

    let align = style.textAlign.toLowerCase();
    if (!['left', 'center', 'right'].contains(align)) {
        align = DEFAULT_FOLDER_STYLE.textStyle.align;
    }

    const radius = getUnitlessValue(style.borderRadius, DEFAULT_FOLDER_STYLE.radius);
    const borderWidth = getUnitlessValue(style.borderWidth, DEFAULT_FOLDER_STYLE.borderWidth);
    const padding = {
        left: getUnitlessValue(style.paddingLeft, DEFAULT_FOLDER_STYLE.padding.left),
        top: getUnitlessValue(style.paddingTop, DEFAULT_FOLDER_STYLE.padding.top),
        right: getUnitlessValue(style.paddingRight, DEFAULT_FOLDER_STYLE.padding.right),
        bottom: getUnitlessValue(style.paddingBottom, DEFAULT_FOLDER_STYLE.padding.bottom),
    }

    const opacityString = style.opacity.toLowerCase();
    let fillOpacity = DEFAULT_FOLDER_STYLE.fillOpacity;
    fillOpacity = parseFloat(opacityString.toLowerCase());
    if (isNaN(fillOpacity)) {
        fillOpacity = DEFAULT_FOLDER_STYLE.fillOpacity;
    }
    else {
        fillOpacity = Math.clamp(fillOpacity, 0, 1);
    }

    const strokeOpacity = Math.min(fillOpacity * 15, 1);

    const folderStyle: CSSFolderStyle = {
        textStyle: {
            textStyle,
            align: align as 'left' | 'center' | 'right',
        },
        radius,
        borderWidth,
        fillOpacity,
        strokeOpacity,
        padding
    };

    detachCSSDiv(instances);
    return folderStyle;
}

// ======================== Other exported functions ======================== //

export function isNodeTextStyleDefault(style: CSSTextStyle): boolean {
    return style.fontStyle === 'normal'
        && style.fontVariant === 'normal'
        && style.fontWeight === 'normal'
        && style.letterSpacing === 0;
}

export function getBackgroundColor(renderer: GraphRenderer): Color.Color {
    let bg = window.getComputedStyle(renderer.interactiveEl).backgroundColor;
    let el: Element = renderer.interactiveEl;
    while (bg.startsWith("rgba(") && bg.endsWith(", 0)") && el.parentElement) {
        el = el.parentElement as Element;
        bg = window.getComputedStyle(el).backgroundColor;
    }

    return Color.parseCSS(bg).rgb;
}

export function getPrimaryColor(renderer: GraphRenderer): Color.Color {
    return Color.parseCSS(window.getComputedStyle(renderer.interactiveEl).getPropertyValue('--color-base-100')).rgb;
}

export function colorAttributes2hex(color: GraphColorAttributes): string {
    return Color.formatHEX(color.rgb, color.a);
}

export function getThemeColor(renderer: GraphRenderer, color: string): Color.Color {
    return Color.parseCSS(window.getComputedStyle(renderer.interactiveEl).getPropertyValue('--color-' + color)).rgb;
}

export function getCSSSplitRGB(color: Color.Color): string {
    return `${Color.getRed(color)}, ${Color.getGreen(color)}, ${Color.getBlue(color)}`;
}