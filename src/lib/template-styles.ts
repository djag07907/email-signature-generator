import { SignatureFormData } from "./schemas";

/**
 * Describes which style controls are meaningful for each template so the
 * Style Configuration panel only shows what the selected design can change.
 */
export interface StyleFeatures {
  /** "none": no divider element · "color": only the color applies · "full": color + thickness */
  divider: "none" | "color" | "full";
  /** Short description of what the divider is in this template. */
  dividerHint?: string;
  /** Whether the template renders a profile photo whose shape can be changed. */
  photoShape: boolean;
  /** Whether the template uses the company logo / name (corporate designs). */
  company: boolean;
  /** Plain-language note on what the accent color paints in this template. */
  accentHint: string;
}

const f = (
  accentHint: string,
  divider: StyleFeatures["divider"],
  dividerHint?: string,
  extra: Partial<StyleFeatures> = {}
): StyleFeatures => ({
  divider,
  dividerHint,
  photoShape: true,
  company: false,
  accentHint,
  ...extra,
});

export const styleFeaturesByTemplate: Record<string, StyleFeatures> = {
  "minimalist-white": f("Name and photo initial", "full", "Line under the role"),
  "classic-left-image": f(
    "Name, divider and photo initial",
    "full",
    "Vertical line beside the details"
  ),
  "stacked-centered": f("Name, short bar and photo initial", "full", "Short bar under the role"),
  "accent-bar": f("Name and side bar", "full", "Vertical bar on the left"),
  "compact-line": f("Name", "color", "Separator between name and role", { photoShape: false }),
  "soft-card": f("Name, tinted card and labels", "none"),
  "two-column": f("Name and labels", "full", "Line between the two columns"),
  "underline-accent": f("Name and underline", "full", "Thick line under the header"),
  "monogram-tile": f("Name and monogram tile", "none", undefined, { photoShape: false }),
  "serif-classic": f("Name and photo initial", "full", "Rules above and below"),
  modern: f("Name, photo ring and divider", "full", "Gradient divider under the role"),
  creative: f("Header banner and chips", "full", "Dashed line above social icons"),
  professional: f("Sidebar, name and divider", "full", "Line under the role"),
  "executive-dark": f("Highlights, labels and top line", "full", "Top edge line of the card"),
  "gradient-edge": f("Name and top gradient edge", "full", "Gradient strip on top of the card"),
  "pill-header": f("Name, role pill and photo ring", "full", "Line under the header"),
  "midnight-split": f("Panel highlights", "full", "Line above social icons"),
  "duo-tone": f("Name, tinted panel and base line", "full", "Base line under the card"),
  "corporate-clean": f(
    "Company name, side bar and labels",
    "full",
    "Line under the company header",
    { company: true }
  ),
  "corporate-branded": f("Banner, name and footer", "none", undefined, { company: true }),
  "corporate-split": f("Company name and labels", "full", "Line between company and person", {
    company: true,
  }),
  "corporate-executive": f("Footer bar and name", "full", "Line under the role", { company: true }),
  "corporate-stacked": f(
    "Top border, company name and labels",
    "full",
    "Short bar under the logo",
    { company: true }
  ),
  "corporate-card": f("Company name and divider", "full", "Line under the header", {
    company: true,
  }),
};

export const getActiveTemplateKey = (
  data: Pick<SignatureFormData, "isCorporate" | "corporateTemplate" | "selectedTemplate">
) => (data.isCorporate && data.corporateTemplate ? data.corporateTemplate : data.selectedTemplate);

export const getStyleFeatures = (
  data: Pick<SignatureFormData, "isCorporate" | "corporateTemplate" | "selectedTemplate">
): StyleFeatures =>
  styleFeaturesByTemplate[getActiveTemplateKey(data)] ?? f("Name and accents", "full");
