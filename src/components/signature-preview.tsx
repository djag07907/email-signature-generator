"use client";

import { SignatureFormData } from "@/lib/schemas";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Copy, Eye, Download } from "lucide-react";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { FieldErrors } from "react-hook-form";
import {
  generateModernTemplate,
  generateClassicTemplate,
  generateMinimalTemplate,
  generateCreativeTemplate,
  generateProfessionalTemplate,
  generateCorporateCleanTemplate,
  generateCorporateBrandedTemplate,
} from "@/lib/template-generators";

interface SignaturePreviewProps {
  data: SignatureFormData;
  formErrors?: FieldErrors<SignatureFormData>;
}

const getSocialIconUrl = (platform: string) => {
  switch (platform) {
    case "LinkedIn":
      return "https://cdn-icons-png.flaticon.com/512/174/174857.png";
    case "GitHub":
      return "https://cdn-icons-png.flaticon.com/512/25/25231.png";
    case "WhatsApp":
      return "https://cdn-icons-png.flaticon.com/512/733/733585.png";
    default:
      return "";
  }
};

export function SignaturePreview({ data, formErrors }: SignaturePreviewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Check if form is valid for copy/download functionality
  const isFormValid = useMemo(() => {
    // Check for basic form errors
    if (formErrors && Object.keys(formErrors).length > 0) {
      return false;
    }
    
    // Check for required fields
    if (!data.name || !data.position || !data.email || !data.phone) {
      return false;
    }
    
    // Check for empty social links (if any social links exist, they must have URLs)
    const hasEmptySocialLinks = data.socialLinks?.some(link => !link.url.trim());
    if (hasEmptySocialLinks) {
      return false;
    }
    
    // Check for empty websites (if any websites exist, they must be valid)
    const hasEmptyWebsites = data.websites?.some(website => website === "");
    if (hasEmptyWebsites) {
      return false;
    }
    
    return true;
  }, [data, formErrors]);

  const generateSignatureHtml = () => {
    // Use corporate template if corporate mode is enabled
    if (data.isCorporate && data.corporateTemplate) {
      switch (data.corporateTemplate) {
        case "corporate-clean":
          return generateCorporateCleanTemplate(data);
        case "corporate-branded":
          return generateCorporateBrandedTemplate(data);
        default:
          return generateCorporateCleanTemplate(data);
      }
    }
    
    // Use base template based on selection
    switch (data.selectedTemplate) {
      case "modern":
        return generateModernTemplate(data);
      case "classic":
        return generateClassicTemplate(data);
      case "minimal":
        return generateMinimalTemplate(data);
      case "creative":
        return generateCreativeTemplate(data);
      case "professional":
        return generateProfessionalTemplate(data);
      default:
        return generateModernTemplate(data);
    }
  };

  const copyToClipboard = async () => {
    setIsLoading(true);
    try {
      const html = generateSignatureHtml();
      const tempElement = document.createElement("div");
      tempElement.innerHTML = html;
      document.body.appendChild(tempElement);
      
      const range = document.createRange();
      range.selectNodeContents(tempElement);
      const selection = window.getSelection();
      
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
      
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
        }),
      ]);
      
      document.body.removeChild(tempElement);
      
      toast({
        title: "Success!",
        description: "Signature copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy signature",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="sticky top-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            Live Preview
          </CardTitle>
          <CardDescription>
            See how your signature will look in emails
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="group p-6 border-2 border-dashed border-muted-foreground/20 rounded-lg bg-gradient-to-br from-background to-muted/30 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
            <div
              dangerouslySetInnerHTML={{ __html: generateSignatureHtml() }}
              className="signature-preview transition-transform duration-200 group-hover:scale-[1.02]"
            />
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            {!isFormValid && (
              <div className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                <p className="font-medium mb-1">⚠️ Please complete the form</p>
                <ul className="text-xs space-y-1 ml-4">
                  {!data.name && <li>• Name is required</li>}
                  {!data.position && <li>• Position is required</li>}
                  {!data.email && <li>• Email is required</li>}
                  {!data.phone && <li>• Phone number is required</li>}
                  {data.socialLinks?.some(link => !link.url.trim()) && <li>• Remove empty social links or add URLs</li>}
                  {data.websites?.some(website => website === "") && <li>• Remove empty websites or add URLs</li>}
                </ul>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={copyToClipboard}
                disabled={isLoading || !isFormValid}
                className="flex-1 flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                {isLoading ? "Copying..." : "Copy Signature"}
              </Button>
              <Button
                variant="outline"
                disabled={!isFormValid}
                className="flex items-center gap-2"
                onClick={() => {
                  const html = generateSignatureHtml();
                  const blob = new Blob([html], { type: 'text/html' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'email-signature.html';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground space-y-1">
            <p>💡 <strong>Tip:</strong> After copying, paste directly into your email client's signature settings.</p>
            <p>📧 Works with Gmail, Outlook, Apple Mail, and most email clients.</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
