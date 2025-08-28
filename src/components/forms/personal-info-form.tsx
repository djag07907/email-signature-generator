"use client";

import { UseFormReturn } from "react-hook-form";
import { SignatureFormData } from "@/lib/schemas";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Upload, X, User } from "lucide-react";
import { useState, useEffect } from "react";

interface PersonalInfoFormProps {
  form: UseFormReturn<SignatureFormData>;
}

export function PersonalInfoForm({ form }: PersonalInfoFormProps) {
  const [imagePreview, setImagePreview] = useState<string>("");

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        form.setValue("profileImage", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview("");
    form.setValue("profileImage", "");
  };

  // Watch for phone number changes and auto-update WhatsApp link
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "phone" && value.phone) {
        const sanitizedPhone = value.phone.replace(/\D/g, "");
        if (sanitizedPhone) {
          const whatsappUrl = `https://api.whatsapp.com/send/?phone=${sanitizedPhone}&text&type=phone_number&app_absent=0`;
          
          const currentSocialLinks = form.getValues("socialLinks") || [];
          const whatsappIndex = currentSocialLinks.findIndex(
            (link) => link.platform === "WhatsApp"
          );
          
          if (whatsappIndex > -1) {
            // Update existing WhatsApp link
            const updatedLinks = [...currentSocialLinks];
            updatedLinks[whatsappIndex] = { platform: "WhatsApp", url: whatsappUrl };
            form.setValue("socialLinks", updatedLinks);
          } else {
            // Add new WhatsApp link
            form.setValue("socialLinks", [
              ...currentSocialLinks,
              { platform: "WhatsApp", url: whatsappUrl }
            ]);
          }
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
          <CardDescription>
            Enter your basic contact information for the signature
          </CardDescription>
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
                            onClick={() => document.getElementById('image-upload')?.click()}
                            className="flex items-center gap-2"
                          >
                            <Upload className="w-4 h-4" />
                            {imagePreview || field.value ? 'Change Image' : 'Upload Image'}
                          </Button>
                          <p className="text-xs text-muted-foreground">
                            Recommended: Square image, max 2MB
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
        </CardContent>
      </Card>
    </motion.div>
  );
}
