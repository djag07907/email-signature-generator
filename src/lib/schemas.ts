import { z } from "zod";

export const socialPlatforms = ["LinkedIn", "GitHub", "WhatsApp", "Instagram", "YouTube", "Dribbble", "Behance"] as const;

export const personalInfoSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .regex(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces"),
  position: z.string()
    .min(1, "Position is required")
    .regex(/^[a-zA-Z\s]*$/, "Position can only contain letters and spaces"),
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phone: z.string()
    .min(1, "Phone number is required")
    .regex(/^[0-9+]*$/, "Phone number can only contain numbers and +"),
  whatsappManual: z.string().optional(),
  usePhoneForWhatsapp: z.boolean().default(true),
  profileImage: z.string().optional(),
  companyName: z.string().optional(),
  companyLogo: z.string().optional(),
});

export const websiteSchema = z.object({
  websites: z.array(z.string().url("Please enter a valid URL")).optional(),
});

export const socialLinkSchema = z.object({
  platform: z.enum(socialPlatforms),
  url: z.string().url("Please enter a valid URL"),
});

export const socialLinksSchema = z.object({
  socialLinks: z.array(socialLinkSchema).optional(),
});

export const templateSchema = z.object({
  selectedTemplate: z.enum([
    "minimalist-white", "classic-left-image", "stacked-centered", "accent-bar", "compact-line", "soft-card",
    "modern", "creative", "professional", "executive-dark",
  ]),
  isCorporate: z.boolean(),
  corporateTemplate: z.enum(["corporate-clean", "corporate-branded", "corporate-split", "corporate-executive"]).optional(),
});

export const styleSchema = z.object({
  dividerColor: z.string(),
  dividerWidth: z.string(),
  fontColor: z.string(),
  fontWeight: z.enum(["normal", "bold", "bolder"]),
  fontFamily: z.enum(["Poppins", "Inter", "Roboto", "Open Sans", "Source Sans Pro"]).default("Poppins"),
  imgStyle: z.enum(["circle", "square"]).optional(),
});

export const signatureFormSchema = personalInfoSchema
  .merge(websiteSchema)
  .merge(socialLinksSchema)
  .merge(templateSchema)
  .merge(styleSchema);

export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type Website = z.infer<typeof websiteSchema>;
export type SocialLink = z.infer<typeof socialLinkSchema>;
export type SocialLinks = z.infer<typeof socialLinksSchema>;
export type TemplateConfig = z.infer<typeof templateSchema>;
export type StyleConfig = z.infer<typeof styleSchema>;
export type SignatureFormData = z.infer<typeof signatureFormSchema>;

// Template definitions
export const templateTypes = {
  "minimalist-white": {
    name: "Minimalist White",
    description: "Clean, text-first layout with a small photo accent",
    preview: "minimalist-white-preview",
    isFree: true,
    maxSocialLinks: 3
  },
  "classic-left-image": {
    name: "Classic Left-Image",
    description: "Photo on the left, details on the right behind an accent line",
    preview: "classic-left-image-preview",
    isFree: true,
    maxSocialLinks: 3
  },
  "stacked-centered": {
    name: "Stacked Centered",
    description: "Photo on top with centered, balanced information below",
    preview: "stacked-centered-preview",
    isFree: true,
    maxSocialLinks: 3
  },
  "accent-bar": {
    name: "Accent Bar",
    description: "Bold vertical accent bar with crisp typographic hierarchy",
    preview: "accent-bar-preview",
    isFree: true,
    maxSocialLinks: 3
  },
  "compact-line": {
    name: "Compact Line",
    description: "Ultra-slim two-line signature, ideal for quick replies",
    preview: "compact-line-preview",
    isFree: true,
    maxSocialLinks: 3
  },
  "soft-card": {
    name: "Soft Card",
    description: "Tinted rounded card with photo and tidy contact rows",
    preview: "soft-card-preview",
    isFree: true,
    maxSocialLinks: 3
  },
  modern: {
    name: "Modern",
    description: "Photo ring, gradient divider and icon-led contact details",
    preview: "modern-preview",
    isFree: false,
    maxSocialLinks: 6
  },
  creative: {
    name: "Creative",
    description: "Bold color header with photo and pill-style contact chips",
    preview: "creative-preview",
    isFree: false,
    maxSocialLinks: 6
  },
  professional: {
    name: "Professional",
    description: "Brand-color sidebar with photo and structured details",
    preview: "professional-preview",
    isFree: false,
    maxSocialLinks: 6
  },
  "executive-dark": {
    name: "Executive Dark",
    description: "Elegant dark card with accent highlights for a premium feel",
    preview: "executive-dark-preview",
    isFree: false,
    maxSocialLinks: 6
  }
} as const;

export const corporateTemplateTypes = {
  "corporate-clean": {
    name: "Corporate Clean",
    description: "Company header with logo, then a clean personal block",
    preview: "corporate-clean-preview"
  },
  "corporate-branded": {
    name: "Corporate Branded",
    description: "Full brand-color banner with logo and footer links",
    preview: "corporate-branded-preview"
  },
  "corporate-split": {
    name: "Corporate Split",
    description: "Two columns: company identity left, your details right",
    preview: "corporate-split-preview"
  },
  "corporate-executive": {
    name: "Corporate Executive",
    description: "Executive layout with a branded footer bar and social badges",
    preview: "corporate-executive-preview"
  }
} as const;
