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
  .merge(styleSchema);

export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type Website = z.infer<typeof websiteSchema>;
export type SocialLink = z.infer<typeof socialLinkSchema>;
export type SocialLinks = z.infer<typeof socialLinksSchema>;
export type StyleConfig = z.infer<typeof styleSchema>;
export type SignatureFormData = z.infer<typeof signatureFormSchema>;
