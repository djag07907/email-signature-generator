"use client";

import { useSignature } from "@/components/context/signature-context";
import Button from "@/components/ui/button";
import Card, { CardContent } from "@/components/ui/card";
import Input from "@/components/ui/input";
import Label from "@/components/ui/label";
import Image from "next/image";

interface SocialLink {
  platform: "LinkedIn" | "GitHub" | "WhatsApp";
  url: string;
}
export default function EmailSignatureGenerator() {
  const {
    name,
    setName,
    position,
    setPosition,
    phone,
    setPhone,
    websites,
    setWebsites,
    email,
    setEmail,
    socialLinks,
    setSocialLinks,
    imgSrc,
    setImgSrc,
    imgStyle,
    dividerColor,
    setDividerColor,
    dividerWidth,
    setDividerWidth,
    fontColor,
    setFontColor,
    fontWeight,
    setFontWeight,
    signatureHtml,
    setSignatureHtml,
  } = useSignature();
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
                ? `<img src="${imgSrc}" style="max-width: 80px; max-height: 80px; object-fit: cover; ${
                    imgStyle === "circle" ? "border-radius: 50%;" : ""
                  }" />`
                : ""
            }
          </td>
          <td>
            <div style="font-weight: ${fontWeight}; font-size: 16px; color: ${fontColor};">${name}</div>
            <div style="font-weight: ${fontWeight}; font-size: 14px; color: ${fontColor};">${position}</div>
            ${divider}
            <div style="margin: 6px 0; color: ${fontColor};">${phone}  ${websites
      .filter(Boolean)
      .join(" ")}</div>
            ${divider}
            <div style="margin: 6px 0; color: ${fontColor};">${email}</div>
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
  return (
    <div className="flex p-6 max-w-5xl mx-auto">
      <div className="w-4/6 pr-4">
        <Card>
          <CardContent>
            <div className="m-2 p-4 border border-gray-300 rounded">
              <Label>Personal Information</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Your Name</Label>
                  <Input
                    placeholder="Enter your name"
                    value={name}
                    onChange={(element) => {
                      setName(element.target.value);
                      updateSignatureHtml();
                    }}
                    className="m-2 p-1"
                  />
                </div>
                <div>
                  <Label>Position</Label>
                  <Input
                    placeholder="Enter your position"
                    value={position}
                    onChange={(element) => {
                      setPosition(element.target.value);
                      updateSignatureHtml();
                    }}
                    className="m-2 p-1"
                  />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(element) => {
                      setPhone(element.target.value);
                      updateSignatureHtml();
                    }}
                    className="m-2 p-1"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    placeholder="Enter your email"
                    value={email}
                    onChange={(element) => {
                      setEmail(element.target.value);
                      updateSignatureHtml();
                    }}
                    className="m-2 p-1"
                  />
                </div>
              </div>
            </div>
            <div className="m-2 p-4 border border-gray-300 rounded">
              <Label>Websites</Label>
              <div className="flex justify-between items-center mb-2">
                <Button
                  onClick={() => {
                    setWebsites([...websites, ""]);
                    updateSignatureHtml();
                  }}
                  className="ml-2 text-blue-700"
                >
                  + Add
                </Button>
              </div>
              {websites.map((website, index) => (
                <div key={index} className="flex items-center mb-2">
                  <Input
                    placeholder="Website URL"
                    value={website}
                    onChange={(element) => {
                      const newWebsites = [...websites];
                      newWebsites[index] = element.target.value;
                      setWebsites(newWebsites);
                      updateSignatureHtml();
                    }}
                    className="m-2 p-1"
                  />
                  <Button
                    onClick={() => {
                      const newWebsites = websites.filter(
                        (_, i) => i !== index
                      );
                      setWebsites(newWebsites);
                      updateSignatureHtml();
                    }}
                    className="ml-2 text-amber-700"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
            <div className="m-2 p-4 border border-gray-300 rounded">
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
                  className="w-16 mr-5"
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
            </div>
            <div className="m-2 p-4 border border-gray-300 rounded">
              <Label>Text Styles</Label>
              <div className="grid grid-cols-2 items-center m-2 p-1">
                <div>
                  <Label>Font Color</Label>
                  <Input
                    type="color"
                    value={fontColor}
                    onChange={(element) => {
                      setFontColor(element.target.value);
                      updateSignatureHtml();
                    }}
                    className="w-16"
                  />
                </div>
                <div>
                  <Label>Font Weight</Label>
                  <select
                    value={fontWeight}
                    onChange={(element) => {
                      setFontWeight(element.target.value);
                      updateSignatureHtml();
                    }}
                    className="border border-gray-400 rounded-md p-2"
                  >
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                    <option value="bolder">Bolder</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="m-2 p-4 border border-gray-300 rounded">
              <Label>Social Links</Label>
              <div className="flex flex-col m-2 p-1">
                {["LinkedIn", "GitHub", "WhatsApp"].map((platform) => (
                  <div key={platform} className="flex items-center mb-2">
                    <Image
                      src={getSocialIconUrl(platform)}
                      alt={platform}
                      width={20}
                      height={20}
                      className="mr-2"
                    />
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
                        updateSignatureHtml();
                      }}
                      className="flex-1 m-0 p-1"
                    />
                  </div>
                ))}
              </div>
            </div>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mb-4 mt-4 w-full"
            />
            <Button
              onClick={copyToClipboard}
              className="w-full mb-2 bg-green-500 text-white"
            >
              Copy Signature
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="w-3/4 pl-4">
        <Card>
          <CardContent>
            <div className="m-4">
              <Label>Live Preview</Label>
              <div
                className="border rounded p-2"
                dangerouslySetInnerHTML={{ __html: signatureHtml }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
