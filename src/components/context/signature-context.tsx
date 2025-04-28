"use client";

import React, { createContext, useContext, useState } from "react";

interface SocialLink {
  platform: "LinkedIn" | "GitHub" | "WhatsApp";
  url: string;
}
interface SignatureContextType {
  name: string;
  position: string;
  phone: string;
  websites: string[];
  email: string;
  socialLinks: SocialLink[];
  imgSrc: string | null;
  imgStyle: "circle" | "square";
  dividerColor: string;
  dividerWidth: string;
  fontColor: string;
  fontWeight: string;
  signatureHtml: string;
  setSignatureHtml: (html: string) => void;
  setName: (name: string) => void;
  setPosition: (position: string) => void;
  setPhone: (phone: string) => void;
  setWebsites: (websites: string[]) => void;
  setEmail: (email: string) => void;
  setSocialLinks: (socialLinks: SocialLink[]) => void;
  setImgSrc: (imgSrc: string | null) => void;
  setDividerColor: (color: string) => void;
  setDividerWidth: (width: string) => void;
  setFontColor: (color: string) => void;
  setFontWeight: (weight: string) => void;
}
const SignatureContext = createContext<SignatureContextType | undefined>(
  undefined
);
export const SignatureProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [phone, setPhone] = useState("");
  const [websites, setWebsites] = useState<string[]>([""]);
  const [email, setEmail] = useState("");
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [imgStyle] = useState<"circle" | "square">("circle");
  const [dividerColor, setDividerColor] = useState("#ccc");
  const [dividerWidth, setDividerWidth] = useState("1px");
  const [fontColor, setFontColor] = useState("#000000");
  const [fontWeight, setFontWeight] = useState("normal");
  const [signatureHtml, setSignatureHtml] = useState("");
  return (
    <SignatureContext.Provider
      value={{
        name,
        position,
        phone,
        websites,
        email,
        socialLinks,
        imgSrc,
        imgStyle,
        dividerColor,
        dividerWidth,
        fontColor,
        fontWeight,
        signatureHtml,
        setSignatureHtml,
        setName,
        setPosition,
        setPhone,
        setWebsites,
        setEmail,
        setSocialLinks,
        setImgSrc,
        setDividerColor,
        setDividerWidth,
        setFontColor,
        setFontWeight,
      }}
    >
      {children}
    </SignatureContext.Provider>
  );
};
export const useSignature = () => {
  const context = useContext(SignatureContext);
  if (!context) {
    throw new Error("useSignature must be used within a SignatureProvider");
  }
  return context;
};
