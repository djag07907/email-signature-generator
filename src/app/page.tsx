"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signatureFormSchema, SignatureFormData } from "@/lib/schemas";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PersonalInfoForm } from "@/components/forms/personal-info-form";
import { WebsitesForm } from "@/components/forms/websites-form";
import { SocialLinksForm } from "@/components/forms/social-links-form";
import { StyleForm } from "@/components/forms/style-form";
import { SignaturePreview } from "@/components/signature-preview";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";
import { RotateCcw, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function EmailSignatureGenerator() {
  const form = useForm<SignatureFormData>({
    resolver: zodResolver(signatureFormSchema),
    defaultValues: {
      name: "",
      position: "",
      email: "",
      phone: "",
      profileImage: "",
      websites: [],
      socialLinks: [],
      fontColor: "#000000",
      fontWeight: "normal",
      dividerColor: "#cccccc",
      dividerWidth: "1px",
      imgStyle: "circle",
    },
    mode: "onChange",
  });

  const onSubmit = (data: SignatureFormData) => {
    console.log("Form data:", data);
  };

  const resetForm = () => {
    form.reset();
  };

  const watchedData = form.watch();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Mail className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Email Signature Generator
                </h1>
                <p className="text-sm text-muted-foreground">
                  Create professional email signatures in seconds
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={resetForm}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Forms Column */}
              <div className="space-y-6">
                <PersonalInfoForm form={form} />
                <WebsitesForm form={form} />
                <SocialLinksForm form={form} />
                <StyleForm form={form} />
              </div>
              
              {/* Preview Column - Now has equal width */}
              <div>
                <SignaturePreview data={watchedData} formErrors={form.formState.errors} />
              </div>
            </div>
          </form>
        </Form>
      </div>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="border-t bg-muted/30"
      >
        <div className="container mx-auto px-4 py-8">
          <Separator className="mb-6" />
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Built with Next.js, shadcn/ui, and Tailwind CSS
            </p>
            <p className="text-xs text-muted-foreground">
              Generate professional email signatures that work across all email clients
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
