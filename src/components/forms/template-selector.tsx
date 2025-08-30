"use client";

import { UseFormReturn } from "react-hook-form";
import { SignatureFormData, templateTypes, corporateTemplateTypes } from "@/lib/schemas";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Building2, Crown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplateSelectorProps {
  form: UseFormReturn<SignatureFormData>;
}

export function TemplateSelector({ form }: TemplateSelectorProps) {
  const selectedTemplate = form.watch("selectedTemplate");
  const isCorporate = form.watch("isCorporate");
  const corporateTemplate = form.watch("corporateTemplate");

  const handleTemplateSelect = (template: string) => {
    form.setValue("selectedTemplate", template as SignatureFormData["selectedTemplate"]);
  };

  const handleCorporateTemplateSelect = (template: string) => {
    form.setValue("corporateTemplate", template as SignatureFormData["corporateTemplate"]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            Signature Templates
          </CardTitle>
          <CardDescription>
            Choose from our professionally designed templates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Corporate Mode Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <FormField
                control={form.control}
                name="isCorporate"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormLabel className="flex items-center gap-2 font-medium">
                      <Building2 className="w-4 h-4" />
                      Corporate Mode
                    </FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className="text-sm text-muted-foreground">
                Enable corporate templates with company branding
              </p>
            </div>
            {isCorporate && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Crown className="w-3 h-3" />
                Corporate
              </Badge>
            )}
          </div>

          {/* Free Templates */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-green-600">Free Templates</h4>
              <Badge variant="secondary" className="bg-green-100 text-green-700">3 Free</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(templateTypes)
                .filter(([, template]) => template.isFree)
                .map(([key, template]) => (
                <motion.div
                  key={key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleTemplateSelect(key)}
                    className={cn(
                      "h-auto p-4 flex flex-col items-start gap-3 w-full transition-all duration-200 min-h-[140px]",
                      selectedTemplate === key && !isCorporate
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-center justify-between w-full">
                      <h5 className="font-medium text-left leading-tight">{template.name}</h5>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">Free</Badge>
                        {selectedTemplate === key && !isCorporate && (
                          <Badge className="text-xs">Selected</Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground text-left line-clamp-2 flex-1">
                      {template.description}
                    </p>
                    <div className="w-full h-12 bg-gradient-to-br from-green-50 via-green-25 to-background border rounded text-xs flex items-center justify-center">
                      <Sparkles className="w-4 h-4 opacity-50 text-green-600" />
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Premium Templates */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold">Premium Templates</h4>
              <Badge variant="secondary">3 Premium</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(templateTypes)
                .filter(([, template]) => !template.isFree)
                .map(([key, template]) => (
                <motion.div
                  key={key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleTemplateSelect(key)}
                    className={cn(
                      "h-auto p-4 flex flex-col items-start gap-3 w-full transition-all duration-200 min-h-[140px]",
                      selectedTemplate === key && !isCorporate
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-center justify-between w-full">
                      <h5 className="font-medium text-left leading-tight">{template.name}</h5>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">Premium</Badge>
                        {selectedTemplate === key && !isCorporate && (
                          <Badge className="text-xs">Selected</Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground text-left line-clamp-2 flex-1">
                      {template.description}
                    </p>
                    <div className="w-full h-12 bg-gradient-to-br from-amber-50 via-amber-25 to-background border rounded text-xs flex items-center justify-center">
                      <Crown className="w-4 h-4 opacity-50 text-amber-600" />
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Corporate Templates */}
          <AnimatePresence>
            {isCorporate && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Corporate Templates
                  </h4>
                  <Badge variant="secondary">Premium</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(corporateTemplateTypes).map(([key, template]) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleCorporateTemplateSelect(key)}
                        className={cn(
                          "h-auto p-4 flex flex-col items-start gap-2 w-full transition-all duration-200",
                          corporateTemplate === key
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                            : "hover:border-primary/50"
                        )}
                      >
                        <div className="flex items-center justify-between w-full">
                          <h5 className="font-medium">{template.name}</h5>
                          {corporateTemplate === key && (
                            <Badge className="text-xs">Selected</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground text-left">
                          {template.description}
                        </p>
                        <div className="w-full h-16 bg-gradient-to-br from-blue-50 via-slate-50 to-gray-100 border rounded text-xs flex items-center justify-center">
                          <Building2 className="w-4 h-4 opacity-50" />
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Template Info */}
          <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
            <p>
              <strong>💡 Tip:</strong> Corporate templates include company logo integration and 
              professional branding options. Switch between modes to see all available templates.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
