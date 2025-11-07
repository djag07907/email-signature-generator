"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { SignatureFormData } from "@/lib/schemas";
import { motion } from "framer-motion";
import { Upload, X, User, Building2, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

interface PersonalInfoFormProps {
  form: UseFormReturn<SignatureFormData>;
}

export function PersonalInfoForm({ form }: PersonalInfoFormProps) {
  const [imagePreview, setImagePreview] = useState<string>("");
  const [logoPreview, setLogoPreview] = useState<string>("");
  const isCorporate = form.watch("isCorporate");
  const usePhoneForWhatsapp = form.watch("usePhoneForWhatsapp");

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (50KB max recommended for email signatures)
      if (file.size > 50 * 1024) {
        // Compress the image
        const reader = new FileReader();
        reader.onloadend = () => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            // Set canvas size (max 150x150 for signatures)
            const maxSize = 150;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > maxSize) {
                height *= maxSize / width;
                width = maxSize;
              }
            } else {
              if (height > maxSize) {
                width *= maxSize / height;
                height = maxSize;
              }
            }

            canvas.width = width;
            canvas.height = height;
            ctx?.drawImage(img, 0, 0, width, height);

            // Compress to 0.7 quality JPEG
            const compressedResult = canvas.toDataURL("image/jpeg", 0.7);
            setImagePreview(compressedResult);
            form.setValue("profileImage", compressedResult);
          };
          img.src = reader.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        // File is small enough, use as-is
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setImagePreview(result);
          form.setValue("profileImage", result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeImage = () => {
    setImagePreview("");
    form.setValue("profileImage", "");
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (50KB max recommended for email signatures)
      if (file.size > 50 * 1024) {
        // Compress the image
        const reader = new FileReader();
        reader.onloadend = () => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            // Set canvas size (max 150x150 for logos)
            const maxSize = 150;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > maxSize) {
                height *= maxSize / width;
                width = maxSize;
              }
            } else {
              if (height > maxSize) {
                width *= maxSize / height;
                height = maxSize;
              }
            }

            canvas.width = width;
            canvas.height = height;
            ctx?.drawImage(img, 0, 0, width, height);

            // Compress to 0.7 quality JPEG
            const compressedResult = canvas.toDataURL("image/jpeg", 0.7);
            setLogoPreview(compressedResult);
            form.setValue("companyLogo", compressedResult);
          };
          img.src = reader.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        // File is small enough, use as-is
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setLogoPreview(result);
          form.setValue("companyLogo", result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeLogo = () => {
    setLogoPreview("");
    form.setValue("companyLogo", "");
  };

  // Watch for phone number changes and WhatsApp settings
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (
        (name === "phone" || name === "usePhoneForWhatsapp" || name === "whatsappManual") &&
        value.phone
      ) {
        const currentSocialLinks = form.getValues("socialLinks") || [];
        const whatsappIndex = currentSocialLinks.findIndex((link) => link.platform === "WhatsApp");

        let whatsappUrl = "";

        if (value.usePhoneForWhatsapp) {
          const sanitizedPhone = value.phone.replace(/\D/g, "");
          if (sanitizedPhone) {
            whatsappUrl = `https://api.whatsapp.com/send/?phone=${sanitizedPhone}&text&type=phone_number&app_absent=0`;
          }
        } else {
          const sanitizedManualPhone = (value.whatsappManual || "").replace(/\D/g, "");
          if (sanitizedManualPhone) {
            whatsappUrl = `https://api.whatsapp.com/send/?phone=${sanitizedManualPhone}&text&type=phone_number&app_absent=0`;
          }
        }

        if (whatsappUrl) {
          if (whatsappIndex > -1) {
            // Update existing WhatsApp link
            const updatedLinks = [...currentSocialLinks];
            updatedLinks[whatsappIndex] = { platform: "WhatsApp", url: whatsappUrl };
            form.setValue("socialLinks", updatedLinks);
          } else {
            // Add new WhatsApp link
            form.setValue("socialLinks", [
              ...currentSocialLinks,
              { platform: "WhatsApp", url: whatsappUrl },
            ]);
          }
        } else if (whatsappIndex > -1) {
          // Remove WhatsApp link if no valid number
          const updatedLinks = [...currentSocialLinks];
          updatedLinks.splice(whatsappIndex, 1);
          form.setValue("socialLinks", updatedLinks);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-primary">👤</span>
            Personal Information
          </CardTitle>
          <CardDescription>Enter your basic contact information for the signature</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your full name"
                      {...field}
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position/Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Senior Developer"
                      {...field}
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your.email@company.com"
                      {...field}
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+1234567890"
                      {...field}
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* WhatsApp Configuration Section */}
          <div className="space-y-4 border-t pt-4">
            <h4 className="font-semibold flex items-center gap-2 text-primary">
              <MessageCircle className="w-4 h-4" />
              WhatsApp Configuration
            </h4>

            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
              <div className="space-y-1">
                <FormField
                  control={form.control}
                  name="usePhoneForWhatsapp"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormLabel className="flex items-center gap-2 font-medium">
                        Use phone number for WhatsApp
                      </FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <p className="text-sm text-muted-foreground">
                  {usePhoneForWhatsapp
                    ? "WhatsApp will use the phone number above"
                    : "Enter a different phone number for WhatsApp"}
                </p>
              </div>
              {usePhoneForWhatsapp && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  Auto-generated
                </Badge>
              )}
            </div>

            {!usePhoneForWhatsapp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FormField
                  control={form.control}
                  name="whatsappManual"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="+1234567890"
                          {...field}
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-muted-foreground">
                        This number will be used specifically for WhatsApp links
                      </p>
                    </FormItem>
                  )}
                />
              </motion.div>
            )}
          </div>

          {/* Profile Image Upload Section */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="profileImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Profile Picture
                  </FormLabel>
                  <div className="flex items-center gap-4">
                    {imagePreview || field.value ? (
                      <div className="relative group">
                        <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-muted">
                          <img
                            src={imagePreview || field.value}
                            alt="Profile preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={removeImage}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/30">
                        <User className="w-8 h-8 text-muted-foreground/50" />
                      </div>
                    )}
                    <div className="flex-1">
                      <FormControl>
                        <div className="space-y-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById("image-upload")?.click()}
                            className="flex items-center gap-2"
                          >
                            <Upload className="w-4 h-4" />
                            {imagePreview || field.value ? "Change Image" : "Upload Image"}
                          </Button>
                          <p className="text-xs text-muted-foreground">
                            Images will be automatically compressed for email compatibility
                          </p>
                        </div>
                      </FormControl>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Corporate Information Section - Only show in corporate mode */}
          {isCorporate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 border-t pt-4"
            >
              <h4 className="font-semibold flex items-center gap-2 text-primary">
                <Building2 className="w-4 h-4" />
                Company Information
              </h4>

              {/* Company Name */}
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your company name"
                        {...field}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Company Logo Upload */}
              <FormField
                control={form.control}
                name="companyLogo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Company Logo
                    </FormLabel>
                    <div className="flex items-center gap-4">
                      {logoPreview || field.value ? (
                        <div className="relative group">
                          <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-muted bg-white p-2">
                            <img
                              src={logoPreview || field.value}
                              alt="Company logo preview"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={removeLogo}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/30">
                          <Building2 className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                      )}
                      <div className="flex-1">
                        <FormControl>
                          <div className="space-y-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleLogoUpload}
                              className="hidden"
                              id="logo-upload"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById("logo-upload")?.click()}
                              className="flex items-center gap-2"
                            >
                              <Upload className="w-4 h-4" />
                              {logoPreview || field.value ? "Change Logo" : "Upload Logo"}
                            </Button>
                            <p className="text-xs text-muted-foreground">
                              Images will be automatically compressed for email compatibility
                            </p>
                          </div>
                        </FormControl>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
