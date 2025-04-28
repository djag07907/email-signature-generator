"use client";

import { useSignature } from "@/components/context/signature-context";
import Button from "@/components/ui/button";
import Card, { CardContent } from "@/components/ui/card";
import Input from "@/components/ui/input";
import Label from "@/components/ui/label";
import SkeletonEmailSignature from "@/components/ui/skeleton";
import Image from "next/image";
import { useEffect, useCallback } from "react";

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
  const getDefaultSignatureHtml = () => {
    return `
      <table style="font-family: Arial, sans-serif; color: #333;">
        <tr>
          <td style="padding-right: 16px;">
            <img src="/images/user.png" style="max-width: 80px; max-height: 80px; object-fit: cover; border-radius: 50%;" />
          </td>
          <td>
            <div style="font-weight: normal; font-size: 16px; color: #000000;">John Doe</div>
            <div style="font-weight: normal; font-size: 14px; color: #000000;">IT Manager</div>
            <div style="height: 1px; background-color: #ccc; width: 100%; margin: 6px 0"></div>
            <div style="margin: 6px 0; color: #000000;">
              <div style="margin: 6px 0; display: flex; align-items: center;">
                <img src="/images/internet.png" style="width: 16px; margin-right: 4px;" />
                <a href="#" style="color: #000000; text-decoration: none;">Website URL</a>
              </div>
            </div>
            <div style="height: 1px; background-color: #ccc; width: 100%; margin: 6px 0"></div>
            <div style="margin: 6px 0; color: #000000; display: flex; align-items: center; gap: 6px">
              <img src="/images/phone-call.png" style="width: 16px;" />
              <span>+50499999999</span>
              <img src="/images/email.png" style="width: 16px; margin-left:10px;" />
              <a href="mailto:email@example.com" style="color: #000000; text-decoration: none;">email@example.com</a>
            </div>
            <div style="margin-top: 6px; display: flex; gap: 12px;">
              <a href="#" target="_blank" rel="noopener noreferrer">
                <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" style="width: 20px;" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" style="width: 20px;" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" style="width: 20px;" />
              </a>
            </div>
          </td>
        </tr>
      </table>
    `;
  };
  const updateSignatureHtml = useCallback(() => {
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
    const websitesHtml = websites
      .filter(Boolean)
      .map(
        (website) =>
          `<div style="margin: 6px 0; color: ${fontColor}; display: flex; align-items: center;">
            <img src="/images/internet.png" style="width: 16px; margin-right: 4px;" />
            <a href="${website}" target="_blank" rel="noopener noreferrer" style="color: ${fontColor}; text-decoration: none;">
              ${website}
            </a>
          </div>`
      )
      .join("");
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
            <div style="margin: 6px 0; color: ${fontColor};">
              ${websitesHtml}
            </div>
            ${divider}
            <div style="margin: 6px 0; color: ${fontColor}; display: flex; align-items: center; gap: 6px">
              <img src="/images/phone-call.png" style="width: 16px;" />
              <span>${phone}</span>
               <img src="/images/email.png" style="width: 16px; margin-left:10px;" />
              <a href="mailto:${email}" style="color: ${fontColor}; text-decoration: none;">${email}</a>
            </div>
            <div style="margin-top: 6px; display: flex; gap: 12px;">
              ${Object.entries(socialIcons)
                .map(([key, value]) =>
                  socialLinks.some(
                    (social) => social.platform === key && social.url
                  )
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
  }, [
    dividerWidth,
    dividerColor,
    imgSrc,
    imgStyle,
    fontWeight,
    fontColor,
    name,
    position,
    phone,
    websites,
    email,
    socialLinks,
    setSignatureHtml,
  ]);
  useEffect(() => {
    if (signatureHtml) {
      updateSignatureHtml();
    } else {
      setSignatureHtml(getDefaultSignatureHtml());
    }
  }, [
    name,
    position,
    phone,
    websites,
    email,
    socialLinks,
    imgSrc,
    dividerColor,
    dividerWidth,
    fontColor,
    fontWeight,
    updateSignatureHtml,
  ]);
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
  const clearInputs = () => {
    setName("");
    setPosition("");
    setPhone("");
    setWebsites([""]);
    setEmail("");
    setSocialLinks([]);
    setImgSrc(null);
    setDividerColor("#ccc");
    setDividerWidth("1");
    setFontColor("#000000");
    setFontWeight("normal");
    setSignatureHtml("");
  };
  const getSocialUrl = (platform: string) => {
    if (platform === "WhatsApp") {
      const sanitizedPhone = phone.replace(/\D/g, "");
      return `https://api.whatsapp.com/send/?phone=${sanitizedPhone}&text&type=phone_number&app_absent=0`;
    }
    return (
      socialLinks.find((social) => social.platform === platform)?.url || ""
    );
  };

  const copyToClipboard = async () => {
    try {
      const tempElement = document.createElement("div");
      tempElement.innerHTML = signatureHtml;
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
          "text/html": new Blob([tempElement.innerHTML], { type: "text/html" }),
        }),
      ]);
      document.body.removeChild(tempElement);
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
  const validateName = (value: string) => /^[a-zA-Z\s]*$/.test(value);
  const validatePosition = (value: string) => /^[a-zA-Z\s]*$/.test(value);
  const validatePhone = (value: string) => /^[0-9+]*$/.test(value);

  return (
    <div className="flex p-6 max-w-5xl mx-auto">
      <div className="w-4/6 pr-4">
        <Card>
          <CardContent>
            <Button onClick={clearInputs} className="mb-4 text-red-500">
              Clear
            </Button>
            <div className="m-2 p-4 border border-gray-300 rounded">
              <Label>Personal Information</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Your Name</Label>
                  <Input
                    placeholder="Enter your name"
                    value={name}
                    onChange={(element) => {
                      const value = element.target.value;
                      if (validateName(value) || value === "") {
                        setName(value);
                      }
                    }}
                    className="m-2 p-1 rounded-[10px]"
                  />
                </div>
                <div>
                  <Label>Position</Label>
                  <Input
                    placeholder="Enter your position"
                    value={position}
                    onChange={(element) => {
                      const value = element.target.value;
                      if (validatePosition(value) || value === "") {
                        setPosition(value);
                      }
                    }}
                    className="m-2 p-1 rounded-[10px]"
                  />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(element) => {
                      const value = element.target.value;
                      if (validatePhone(value) || value === "") {
                        setPhone(value);

                        const sanitizedPhone = value.replace(/\D/g, "");
                        const whatsappUrl = `https://api.whatsapp.com/send/?phone=${sanitizedPhone}&text&type=phone_number&app_absent=0`;

                        const newSocialLinks = [...socialLinks];
                        const index = newSocialLinks.findIndex(
                          (social) => social.platform === "WhatsApp"
                        );

                        if (index > -1) {
                          newSocialLinks[index].url = whatsappUrl;
                        } else {
                          newSocialLinks.push({
                            platform: "WhatsApp",
                            url: whatsappUrl,
                          });
                        }

                        setSocialLinks(newSocialLinks);
                      }
                    }}
                    className="m-2 p-1 rounded-[10px]"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    placeholder="Enter your email"
                    value={email}
                    onChange={(element) => {
                      const value = element.target.value;
                      setEmail(value);
                    }}
                    className="m-2 p-1 rounded-[10px]"
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
                  }}
                  className="ml-2 text-blue-700"
                >
                  + Add
                </Button>
              </div>
              <div className="flex flex-col">
                {websites.map((website, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <Input
                      placeholder="Website URL"
                      value={website}
                      onChange={(element) => {
                        const value = element.target.value;
                        const newWebsites = [...websites];
                        newWebsites[index] = value;
                        setWebsites(newWebsites);
                      }}
                      className="m-2 p-1 rounded-[10px]"
                    />
                    <Button
                      onClick={() => {
                        const newWebsites = websites.filter(
                          (_, i) => i !== index
                        );
                        setWebsites(newWebsites);
                      }}
                      className="ml-2 text-amber-700"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
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
                  }}
                  className="w-16 mr-5"
                />
                <Label>Divider Width</Label>
                <Input
                  type="number"
                  value={dividerWidth.replace("px", "")}
                  onChange={(element) => {
                    const value = element.target.value;
                    if (!isNaN(Number(value)) && value !== "") {
                      setDividerWidth(`${value}px`);
                    }
                  }}
                  className="w-20 m-2 p-1 rounded-[10px] border border-gray-400"
                />
                <span className="ml-2 text-gray-500">px</span>
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
                    }}
                    className="border border-gray-400 rounded-md p-2"
                  >
                    <option value="normal" className="text-black">
                      Normal
                    </option>
                    <option value="bold" className="text-black">
                      Bold
                    </option>
                    <option value="bolder" className="text-black">
                      Bolder
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div className="m-2 p-4 border border-gray-300 rounded">
              <Label>Social Links</Label>
              <div className="flex flex-col m-2 p-1">
                {["LinkedIn", "GitHub"].map((platform) => (
                  <div key={platform} className="flex items-center mb-2">
                    <Image
                      src={getSocialIconUrl(platform)}
                      alt={platform}
                      width={20}
                      height={20}
                      className="mr-2"
                    />
                    <Input
                      type="text"
                      placeholder={`${platform} URL`}
                      value={getSocialUrl(platform)}
                      onChange={(element) => {
                        const value = element.target.value;
                        const sanitizedValue =
                          platform === "WhatsApp"
                            ? value.replace(/\D/g, "")
                            : value;
                        const newSocialLinks = [...socialLinks];
                        const index = newSocialLinks.findIndex(
                          (social) => social.platform === platform
                        );
                        if (index > -1) {
                          newSocialLinks[index].url = sanitizedValue;
                        } else {
                          newSocialLinks.push({
                            platform: platform as SocialLink["platform"],
                            url: sanitizedValue,
                          });
                        }
                        setSocialLinks(newSocialLinks);
                      }}
                      className="flex-1 m-0 p-1 rounded-[10px]"
                    />
                  </div>
                ))}
                <div className="flex items-center mb-2">
                  <Image
                    src={getSocialIconUrl("WhatsApp")}
                    alt="WhatsApp"
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  <Input
                    type="text"
                    value={`WhatsApp link to: ${phone} generated...`}
                    readOnly
                    className="flex-1 m-0 p-1 rounded-[10px] bg-gray-100 cursor-not-allowed"
                  />
                </div>
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
              {signatureHtml ? (
                <div
                  className="border rounded p-2"
                  dangerouslySetInnerHTML={{ __html: signatureHtml }}
                />
              ) : (
                <SkeletonEmailSignature />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
