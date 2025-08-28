"use client";

import { UseFormReturn } from "react-hook-form";
import { SignatureFormData } from "@/lib/schemas";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Palette, Type, Minus } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface StyleFormProps {
  form: UseFormReturn<SignatureFormData>;
}

export function StyleForm({ form }: StyleFormProps) {
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
            Customize the appearance of your email signature
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Typography Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-muted-foreground" />
              <h4 className="text-sm font-semibold">Typography</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fontColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Text Color</FormLabel>
                    <div className="flex items-center gap-3">
                      <FormControl>
                        <Input
                          type="color"
                          {...field}
                          className="w-16 h-10 p-1 border-2"
                        />
                      </FormControl>
                      <div className="flex-1">
                        <FormControl>
                          <Input
                            placeholder="#000000"
                            {...field}
                            className="font-mono text-sm"
                          />
                        </FormControl>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fontWeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Font Weight</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select font weight" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="normal">
                          <span className="font-normal">Normal</span>
                        </SelectItem>
                        <SelectItem value="bold">
                          <span className="font-bold">Bold</span>
                        </SelectItem>
                        <SelectItem value="bolder">
                          <span className="font-black">Bolder</span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          {/* Divider Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Minus className="w-4 h-4 text-muted-foreground" />
              <h4 className="text-sm font-semibold">Dividers</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dividerColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Divider Color</FormLabel>
                    <div className="flex items-center gap-3">
                      <FormControl>
                        <Input
                          type="color"
                          {...field}
                          className="w-16 h-10 p-1 border-2"
                        />
                      </FormControl>
                      <div className="flex-1">
                        <FormControl>
                          <Input
                            placeholder="#cccccc"
                            {...field}
                            className="font-mono text-sm"
                          />
                        </FormControl>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dividerWidth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Divider Width</FormLabel>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          {...field}
                          onChange={(e) => field.onChange(`${e.target.value}px`)}
                          value={field.value.replace('px', '')}
                          className="text-sm"
                        />
                      </FormControl>
                      <span className="text-sm text-muted-foreground">px</span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Preview Section */}
          <div className="p-4 border rounded-lg bg-muted/50">
            <div className="text-sm font-medium mb-2">Style Preview</div>
            <div className="space-y-2">
              <div 
                style={{ 
                  color: form.watch("fontColor"),
                  fontWeight: form.watch("fontWeight")
                }}
                className="text-lg"
              >
                Your Name Here
              </div>
              <div 
                style={{ 
                  height: form.watch("dividerWidth"),
                  backgroundColor: form.watch("dividerColor"),
                  width: "100%"
                }}
              />
              <div 
                style={{ 
                  color: form.watch("fontColor"),
                  fontWeight: form.watch("fontWeight")
                }}
                className="text-sm"
              >
                your.position@company.com
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
