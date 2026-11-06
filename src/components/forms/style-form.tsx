"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  SignatureFormData,
  fontFamilies,
  templateTypes,
  corporateTemplateTypes,
} from "@/lib/schemas";
import { getActiveTemplateKey, getStyleFeatures } from "@/lib/template-styles";
import { motion } from "framer-motion";
import { Palette, Type, Minus, PaintBucket, Square, RotateCcw } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface StyleFormProps {
  form: UseFormReturn<SignatureFormData>;
}

type ColorFieldName =
  | "fontColor"
  | "nameColor"
  | "textColor"
  | "mutedColor"
  | "backgroundColor"
  | "borderColor"
  | "dividerColor";

const isHex = (v?: string) => !!v && /^#([0-9a-fA-F]{6})$/.test(v);

/** Color control where an empty value means "use the template's default". */
function ColorField({
  form,
  name,
  label,
  fallback,
  hint,
  required = false,
}: {
  form: UseFormReturn<SignatureFormData>;
  name: ColorFieldName;
  label: string;
  fallback: string;
  hint?: string;
  required?: boolean;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const value = (field.value as string | undefined) || "";
        const swatch = isHex(value) ? value : fallback;
        return (
          <FormItem>
            <div className="flex items-center justify-between gap-2">
              <FormLabel>{label}</FormLabel>
              {!required && !value && (
                <Badge variant="outline" className="text-[10px] font-normal">
                  Template default
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <FormControl>
                <Input
                  type="color"
                  value={swatch}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-12 h-10 p-1 border-2 shrink-0"
                />
              </FormControl>
              <FormControl>
                <Input
                  placeholder={required ? fallback : "Auto"}
                  value={value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="font-mono text-sm min-w-0"
                />
              </FormControl>
              {!required && value && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                  title="Reset to template default"
                  onClick={() => field.onChange("")}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              )}
            </div>
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

function SectionTitle({ icon: Icon, children }: { icon: typeof Type; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-muted-foreground" />
      <h4 className="text-sm font-semibold">{children}</h4>
    </div>
  );
}

const AUTO = "auto";

export function StyleForm({ form }: StyleFormProps) {
  const selectedTemplate = form.watch("selectedTemplate");
  const isCorporate = form.watch("isCorporate");
  const corporateTemplate = form.watch("corporateTemplate");
  const accent = form.watch("fontColor");

  const features = getStyleFeatures({ selectedTemplate, isCorporate, corporateTemplate });
  const activeKey = getActiveTemplateKey({ selectedTemplate, isCorporate, corporateTemplate });
  const activeName =
    isCorporate && corporateTemplate
      ? corporateTemplateTypes[corporateTemplate]?.name
      : templateTypes[selectedTemplate]?.name;

  const resetStyles = () => {
    (
      [
        "nameColor",
        "textColor",
        "mutedColor",
        "backgroundColor",
        "borderColor",
        "borderWidth",
        "dividerColor",
        "dividerWidth",
      ] as const
    ).forEach((key) => form.setValue(key, "", { shouldDirty: true }));
    form.setValue("fontFamily", "Default", { shouldDirty: true });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            Style Configuration
          </CardTitle>
          <CardDescription>
            Showing the options available for <strong>{activeName}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" key={activeKey}>
          {/* Typography */}
          <div className="space-y-4">
            <SectionTitle icon={Type}>Typography</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fontFamily"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Font Family</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || "Default"}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select font" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {fontFamilies.map((family) => (
                          <SelectItem key={family} value={family}>
                            <span style={family === "Default" ? undefined : { fontFamily: family }}>
                              {family === "Default" ? "Template default" : family}
                            </span>
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
                name="fontWeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name Weight</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select weight" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="bold">Bold</SelectItem>
                        <SelectItem value="bolder">Extra bold</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          {/* Colors */}
          <div className="space-y-4">
            <SectionTitle icon={Palette}>Colors</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ColorField
                form={form}
                name="fontColor"
                label="Accent Color"
                fallback="#000000"
                required
                hint={`Paints: ${features.accentHint.toLowerCase()}`}
              />
              <ColorField
                form={form}
                name="nameColor"
                label="Name Color"
                fallback={isHex(accent) ? accent : "#000000"}
                hint="Color of the name"
              />
              <ColorField
                form={form}
                name="textColor"
                label="Contact Text Color"
                fallback="#374151"
                hint="Phone, email and websites"
              />
              <ColorField
                form={form}
                name="mutedColor"
                label="Role / Secondary Text"
                fallback="#6b7280"
                hint="Job title and secondary text"
              />
            </div>
          </div>

          <Separator />

          {/* Surface */}
          <div className="space-y-4">
            <SectionTitle icon={PaintBucket}>Background &amp; Border</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ColorField
                form={form}
                name="backgroundColor"
                label="Background Color"
                fallback="#ffffff"
                hint="Text colors adapt automatically on dark backgrounds"
              />
              <ColorField
                form={form}
                name="borderColor"
                label="Border Color"
                fallback="#e5e7eb"
                hint="Border color adapted to each section of the card"
              />
              <FormField
                control={form.control}
                name="borderWidth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <Square className="w-3.5 h-3.5" /> Border Width
                    </FormLabel>
                    <Select
                      onValueChange={(v) => field.onChange(v === AUTO ? "" : v)}
                      value={field.value ? field.value : AUTO}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={AUTO}>Template default</SelectItem>
                        <SelectItem value="0px">No border</SelectItem>
                        <SelectItem value="1px">1px</SelectItem>
                        <SelectItem value="2px">2px</SelectItem>
                        <SelectItem value="3px">3px</SelectItem>
                        <SelectItem value="4px">4px</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {features.photoShape && (
                <FormField
                  control={form.control}
                  name="imgStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Photo Shape</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || "circle"}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="circle">Circle</SelectItem>
                          <SelectItem value="square">Rounded square</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>

          {/* Divider: only when the selected template has one */}
          {features.divider !== "none" && (
            <>
              <Separator />
              <div className="space-y-4">
                <SectionTitle icon={Minus}>Divider</SectionTitle>
                {features.dividerHint && (
                  <p className="text-xs text-muted-foreground -mt-2">{features.dividerHint}</p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ColorField
                    form={form}
                    name="dividerColor"
                    label="Divider Color"
                    fallback="#e5e7eb"
                  />
                  {features.divider === "full" && (
                    <FormField
                      control={form.control}
                      name="dividerWidth"
                      render={({ field }) => {
                        const value = field.value || "";
                        return (
                          <FormItem>
                            <div className="flex items-center justify-between gap-2">
                              <FormLabel>Divider Thickness</FormLabel>
                              {!value && (
                                <Badge variant="outline" className="text-[10px] font-normal">
                                  Template default
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <FormControl>
                                <Input
                                  type="number"
                                  min="1"
                                  max="10"
                                  placeholder="Auto"
                                  value={value.replace("px", "")}
                                  onChange={(e) =>
                                    field.onChange(e.target.value ? `${e.target.value}px` : "")
                                  }
                                  className="text-sm"
                                />
                              </FormControl>
                              <span className="text-sm text-muted-foreground">px</span>
                              {value && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  title="Reset to template default"
                                  onClick={() => field.onChange("")}
                                >
                                  <RotateCcw className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  )}
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={resetStyles}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to template defaults
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
