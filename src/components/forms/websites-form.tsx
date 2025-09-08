"use client";

import { UseFormReturn } from "react-hook-form";
import { SignatureFormData } from "@/lib/schemas";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Globe } from "lucide-react";

interface WebsitesFormProps {
  form: UseFormReturn<SignatureFormData>;
}

export function WebsitesForm({ form }: WebsitesFormProps) {
  const websites = form.watch("websites") || [];
  
  const addWebsite = () => {
    const currentWebsites = form.getValues("websites") || [];
    form.setValue("websites", [...currentWebsites, ""]);
  };
  
  const removeWebsite = (index: number) => {
    const currentWebsites = form.getValues("websites") || [];
    const newWebsites = currentWebsites.filter((_, i) => i !== index);
    form.setValue("websites", newWebsites);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Websites
          </CardTitle>
          <CardDescription>
            Add your professional websites or portfolios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {websites.length === 0 ? "No websites added" : `${websites.length} website(s) added`}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addWebsite}
              className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Add Website
            </Button>
          </div>
          
          <AnimatePresence>
            <div className="space-y-3">
              {websites.map((website, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-end gap-2"
                >
                  <FormField
                    control={form.control}
                    name={`websites.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        {index === 0 && <FormLabel>Website URL</FormLabel>}
                        <FormControl>
                          <Input
                            placeholder="https://www.yourwebsite.com"
                            {...field}
                            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeWebsite(index)}
                    className="hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>

          {websites.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-muted-foreground"
            >
              <Globe className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No websites added yet</p>
              <p className="text-sm">Click &quot;Add Website&quot; to get started</p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
