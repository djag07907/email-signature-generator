"use client";

import { UseFormReturn, useFieldArray } from "react-hook-form";
import { SignatureFormData, socialPlatforms } from "@/lib/schemas";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Share2, Linkedin, Github, MessageCircle, Instagram, Youtube, Palette, Dribbble } from "lucide-react";

interface SocialLinksFormProps {
  form: UseFormReturn<SignatureFormData>;
}

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case "LinkedIn":
      return <Linkedin className="w-4 h-4" />;
    case "GitHub":
      return <Github className="w-4 h-4" />;
    case "WhatsApp":
      return <MessageCircle className="w-4 h-4" />;
    case "Instagram":
      return <Instagram className="w-4 h-4" />;
    case "YouTube":
      return <Youtube className="w-4 h-4" />;
    case "Dribbble":
      return <Dribbble className="w-4 h-4" />;
    case "Behance":
      return <Palette className="w-4 h-4" />;
    default:
      return <Share2 className="w-4 h-4" />;
  }
};

const getPlatformPlaceholder = (platform: string) => {
  switch (platform) {
    case "LinkedIn":
      return "https://linkedin.com/in/yourprofile";
    case "GitHub":
      return "https://github.com/yourusername";
    case "WhatsApp":
      return "https://wa.me/1234567890";
    case "Instagram":
      return "https://instagram.com/yourusername";
    case "YouTube":
      return "https://youtube.com/@yourchannel";
    case "Dribbble":
      return "https://dribbble.com/yourusername";
    case "Behance":
      return "https://behance.net/yourusername";
    default:
      return "https://";
  }
};

export function SocialLinksForm({ form }: SocialLinksFormProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "socialLinks",
  });

  const addSocialLink = () => {
    append({ platform: "LinkedIn", url: "" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-primary" />
            Social Links
          </CardTitle>
          <CardDescription>
            Add your professional social media profiles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {fields.length === 0 ? "No social links added" : `${fields.length} social link(s) added`}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSocialLink}
              className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Social Link
            </Button>
          </div>
          
          <AnimatePresence>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 border rounded-lg bg-card/50"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-3">
                      <FormField
                        control={form.control}
                        name={`socialLinks.${index}.platform`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              {getPlatformIcon(field.value)}
                              Platform
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a platform" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {socialPlatforms.map((platform) => (
                                  <SelectItem key={platform} value={platform}>
                                    <div className="flex items-center gap-2">
                                      {getPlatformIcon(platform)}
                                      {platform}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`socialLinks.${index}.url`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>URL</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={getPlatformPlaceholder(
                                  form.getValues(`socialLinks.${index}.platform`)
                                )}
                                {...field}
                                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => remove(index)}
                      className="hover:bg-destructive hover:text-destructive-foreground transition-colors mt-6"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>

          {fields.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-muted-foreground"
            >
              <Share2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No social links added yet</p>
              <p className="text-sm">Click &quot;Add Social Link&quot; to get started</p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
