import { z } from "zod";

export const socialPlatforms = ["LinkedIn", "GitHub", "WhatsApp"] as const;

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
  selectedTemplate: z.enum(["modern", "classic", "minimal", "creative", "professional"]),
  isCorporate: z.boolean(),
  corporateTemplate: z.enum(["corporate-clean", "corporate-branded"]).optional(),
});

export const styleSchema = z.object({
  dividerColor: z.string(),
  dividerWidth: z.string(),
  fontColor: z.string(),
  fontWeight: z.enum(["normal", "bold", "bolder"]),
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
  modern: {
    name: "Modern",
    description: "Clean and contemporary design with gradients",
    preview: "modern-preview"
  },
  classic: {
    name: "Classic",
    description: "Traditional professional layout",
    preview: "classic-preview"
  },
  minimal: {
    name: "Minimal",
    description: "Simple and elegant design",
    preview: "minimal-preview"
  },
  creative: {
    name: "Creative",
    description: "Bold and artistic layout",
    preview: "creative-preview"
  },
  professional: {
    name: "Professional",
    description: "Formal business style",
    preview: "professional-preview"
  }
} as const;

export const corporateTemplateTypes = {
  "corporate-clean": {
    name: "Corporate Clean",
    description: "Clean corporate design with company branding",
    preview: "corporate-clean-preview"
  },
  "corporate-branded": {
    name: "Corporate Branded",
    description: "Prominent company logo with brand colors",
    preview: "corporate-branded-preview"
  }
} as const;
