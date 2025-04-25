"use client";

import Button from "@/components/ui/button";
import Card, { CardContent } from "@/components/ui/card";
import Input from "@/components/ui/input";
import Label from "@/components/ui/label";
import { useState } from "react";

interface SocialLink {
  platform: "LinkedIn" | "GitHub" | "WhatsApp" | "Custom";
  url: string;
}
export default function EmailSignatureGenerator() {
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
  const [signatureHtml, setSignatureHtml] = useState("");
  // Handle input changes and update signature HTML in real-time
  const updateSignatureHtml = () => {
    const divider = `<div style="height: ${dividerWidth}; background-color: ${dividerColor}; width: 100%; margin: 6px 0"></div>`;
    const socialIcons = {
      LinkedIn: `<a href="${getSocialUrl(
        "LinkedIn"
      )}" target="_blank" rel="noopener noreferrer"><img src='https://cdn-icons-png.flaticon.com/512/174/174857.png' style='width: 20px; ${
        imgStyle === "circle" ? "border-radius: 50%;" : ""
      }' /></a>`,
      GitHub: `<a href="${getSocialUrl(
        "GitHub"
      )}" target="_blank" rel="noopener noreferrer"><img src='https://cdn-icons-png.flaticon.com/512/25/25231.png' style='width: 20px; ${
        imgStyle === "circle" ? "border-radius: 50%;" : ""
      }' /></a>`,
      WhatsApp: `<a href="${getSocialUrl(
        "WhatsApp"
      )}" target="_blank" rel="noopener noreferrer"><img src='https://cdn-icons-png.flaticon.com/512/733/733585.png' style='width: 20px; ${
        imgStyle === "circle" ? "border-radius: 50%;" : ""
      }' /></a>`,
    };
    const html = `
      <table style="font-family: Arial, sans-serif; color: #333;">
        <tr>
          <td style="padding-right: 16px;">
            ${
              imgSrc
                ? `<img src="${imgSrc}" style="width: 80px; height: 80px; object-fit: cover; ${
                    imgStyle === "circle" ? "border-radius: 50%;" : ""
                  }" />`
                : ""
            }
          </td>
          <td>
            <div style="font-weight: bold; font-size: 16px; color: #333;">${name}</div>
            <div style="font-weight: 600; font-size: 14px; color: #333;">${position}</div>
            ${divider}
            <div style="margin: 6px 0; color: #333;">${phone} | ${websites
      .filter(Boolean)
      .join(" ")}</div>
            ${divider}
            <div style="margin: 6px 0; color: #333;">${email}</div>
            <div style="margin-top: 6px; display: flex; gap: 8px;">
              ${Object.entries(socialIcons)
                .map(([key, value]) =>
                  socialLinks.some((social) => social.platform === key)
                    ? value
                    : ""
                )
                .join(" ")}
            </div>
          </td>
        </tr>
      </table>
    `;
    setSignatureHtml(html);
  };
  const handleImageUpload = (element: React.ChangeEvent<HTMLInputElement>) => {
    const file = element.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgSrc(reader.result as string);
        updateSignatureHtml();
      };
      reader.readAsDataURL(file);
    }
  };
  const getSocialUrl = (platform: string) =>
    socialLinks.find((social) => social.platform === platform)?.url || "";
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(signatureHtml);
      alert("Signature copied to clipboard!");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      alert("Failed to copy signature!");
    }
  };
  return (
    <div className="flex p-6 max-w-5xl mx-auto">
      <div className="w-1/3 pr-4">
        <Card>
          <CardContent>
            <Label>Personal Information</Label>
            <Input
              placeholder="Your Name"
              value={name}
              onChange={(element) => {
                setName(element.target.value);
                updateSignatureHtml();
              }}
              className="m-2 p-1"
            />
            <Input
              placeholder="Position"
              value={position}
              onChange={(element) => {
                setPosition(element.target.value);
                updateSignatureHtml();
              }}
              className="m-2 p-1"
            />
            <Input
              placeholder="Phone Number"
              value={phone}
              onChange={(element) => {
                setPhone(element.target.value);
                updateSignatureHtml();
              }}
              className="m-2 p-1"
            />
            <Input
              placeholder="Email"
              value={email}
              onChange={(element) => {
                setEmail(element.target.value);
                updateSignatureHtml();
              }}
              className="m-2 p-1"
            />
            <div className="m-2 p-4 border border-gray-300 rounded">
              <Label>Websites</Label>
              <div className="flex items-center mb-2">
                <Button
                  onClick={() => {
                    setWebsites([...websites, ""]);
                    updateSignatureHtml();
                  }}
                >
                  +
                </Button>
              </div>
              {websites.map((website, index) => (
                <Input
                  key={index}
                  placeholder="Website URL"
                  value={website}
                  onChange={(element) => {
                    const newWebsites = [...websites];
                    newWebsites[index] = element.target.value;
                    setWebsites(newWebsites);
                    updateSignatureHtml();
                  }}
                  className="mb-2 p-1"
                />
              ))}
            </div>
            <Label>Styles</Label>
            <div className="flex items-center m-2 p-1">
              <Label>Divider Color</Label>
              <Input
                type="color"
                value={dividerColor}
                onChange={(element) => {
                  setDividerColor(element.target.value);
                  updateSignatureHtml();
                }}
                className="w-16 mr-2"
              />
              <Label>Divider Width</Label>
              <Input
                type="text"
                value={dividerWidth}
                onChange={(element) => {
                  setDividerWidth(element.target.value);
                  updateSignatureHtml();
                }}
                className="w-20 m-2 p-1"
              />
            </div>
            <Label>Social Links</Label>
            <div className="flex flex-col m-2 p-1">
              {["LinkedIn", "GitHub", "WhatsApp", "Custom"].map((platform) => (
                <div key={platform} className="flex items-center mb-2">
                  <Input
                    type="url"
                    placeholder={`${platform} URL`}
                    value={getSocialUrl(platform)}
                    onChange={(element) => {
                      const newSocialLinks = [...socialLinks];
                      const index = newSocialLinks.findIndex(
                        (social) => social.platform === platform
                      );
                      if (index > -1) {
                        newSocialLinks[index].url = element.target.value;
                      } else {
                        newSocialLinks.push({
                          platform: platform as SocialLink["platform"],
                          url: element.target.value,
                        });
                      }
                      setSocialLinks(newSocialLinks);
                      updateSignatureHtml(); // Update signature on change
                    }}
                    className="flex-1 m-0 p-1"
                  />
                </div>
              ))}
            </div>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mb-4 mt-4"
            />
            <Button
              onClick={copyToClipboard}
              className="w-full mb-2 bg-green-500 text-white" // Changed to green background
            >
              Copy Signature
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="w-2/3 pl-4">
        <Card>
          <CardContent>
            <div className="m-4">
              <Label>Live Preview</Label>
              <div
                className="border rounded p-4"
                dangerouslySetInnerHTML={{ __html: signatureHtml }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
