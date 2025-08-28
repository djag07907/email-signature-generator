import { SignatureFormData } from "./schemas";

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

export const generateModernTemplate = (data: SignatureFormData): string => {
  const divider = `<div style="height: ${data.dividerWidth}; background: linear-gradient(90deg, ${data.fontColor} 0%, transparent 100%); width: 100%; margin: 8px 0"></div>`;
  
  const websitesHtml = data.websites?.filter(Boolean).map(website => 
    `<div style="margin: 4px 0; color: ${data.fontColor}; display: flex; align-items: center;">
      <img src="https://cdn-icons-png.flaticon.com/128/10453/10453141.png" style="width: 16px; margin-right: 6px;" />
      <a href="${website}" target="_blank" rel="noopener noreferrer" style="color: ${data.fontColor}; text-decoration: none;">
        ${website}
      </a>
    </div>`
  ).join("") || "";

  const socialLinksHtml = data.socialLinks?.filter(link => link.url).map(link =>
    `<a href="${link.url}" target="_blank" rel="noopener noreferrer" style="margin-right: 12px;">
      <img src="${getSocialIconUrl(link.platform)}" style="width: 20px; height: 20px;" />
    </a>`
  ).join("") || "";

  return `
    <table style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; border-collapse: collapse; width: 100%; max-width: 600px;">
      <tr>
        <td style="vertical-align: top; padding-right: 20px; width: 100px;">
          ${data.profileImage ? 
            `<img src="${data.profileImage}" style="width: 80px; height: 80px; object-fit: cover; border-radius: ${data.imgStyle === 'circle' ? '50%' : '8px'}; border: 3px solid ${data.fontColor};" />` :
            `<div style="width: 80px; height: 80px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold;">
              ${data.name ? data.name.charAt(0).toUpperCase() : 'A'}
            </div>`
          }
        </td>
        <td style="vertical-align: top; line-height: 1.4;">
          <div style="font-weight: ${data.fontWeight}; font-size: 20px; color: ${data.fontColor}; margin-bottom: 4px; line-height: 1.2;">
            ${data.name || 'Your Name'}
          </div>
          <div style="font-weight: ${data.fontWeight}; font-size: 14px; color: ${data.fontColor}; margin-bottom: 12px; opacity: 0.8;">
            ${data.position || 'Your Position'}
          </div>
          ${divider}
          <div style="margin: 8px 0; color: ${data.fontColor}; line-height: 1.5;">
            ${websitesHtml}
          </div>
          ${websitesHtml ? divider : ''}
          <div style="margin: 8px 0; color: ${data.fontColor};">
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px; flex-wrap: wrap;">
              <img src="https://cdn-icons-png.flaticon.com/128/3059/3059446.png" style="width: 16px; height: 16px; flex-shrink: 0;" />
              <span style="font-size: 14px; white-space: nowrap;">${data.phone || '+1234567890'}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
              <img src="https://cdn-icons-png.flaticon.com/128/542/542689.png" style="width: 16px; height: 16px; flex-shrink: 0;" />
              <a href="mailto:${data.email || 'email@example.com'}" style="color: ${data.fontColor}; text-decoration: none; font-size: 14px; word-break: break-all;">
                ${data.email || 'email@example.com'}
              </a>
            </div>
          </div>
          ${socialLinksHtml && `<div style="margin-top: 12px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">${socialLinksHtml}</div>`}
        </td>
      </tr>
    </table>
  `;
};

export const generateClassicTemplate = (data: SignatureFormData): string => {
  const divider = `<div style="height: ${data.dividerWidth}; background-color: ${data.dividerColor}; width: 100%; margin: 8px 0"></div>`;
  
  const websitesHtml = data.websites?.filter(Boolean).map(website => 
    `<div style="margin: 4px 0; color: ${data.fontColor};">
      🌐 <a href="${website}" target="_blank" rel="noopener noreferrer" style="color: ${data.fontColor}; text-decoration: underline; margin-left: 8px;">
        ${website}
      </a>
    </div>`
  ).join("") || "";

  const socialLinksHtml = data.socialLinks?.filter(link => link.url).map(link =>
    `<a href="${link.url}" target="_blank" rel="noopener noreferrer" style="margin-right: 8px;">
      <img src="${getSocialIconUrl(link.platform)}" style="width: 18px; height: 18px;" />
    </a>`
  ).join("") || "";

  return `
    <table style="font-family: 'Times New Roman', serif; color: #333; border-collapse: collapse; width: 100%; max-width: 600px; border: 1px solid #ddd;">
      <tr>
        <td style="vertical-align: top; padding: 15px; text-align: center; border-right: 1px solid #ddd; width: 120px;">
          ${data.profileImage ? 
            `<img src="${data.profileImage}" style="width: 80px; height: 80px; object-fit: cover; border-radius: ${data.imgStyle === 'circle' ? '50%' : '4px'}; border: 2px solid #ddd;" />` :
            `<div style="width: 80px; height: 80px; background-color: #f5f5f5; border: 2px solid #ddd; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #666; font-size: 24px; font-weight: bold; margin: 0 auto;">
              ${data.name ? data.name.charAt(0).toUpperCase() : 'A'}
            </div>`
          }
        </td>
        <td style="vertical-align: top; padding: 15px; line-height: 1.6;">
          <div style="font-weight: ${data.fontWeight}; font-size: 18px; color: ${data.fontColor}; margin-bottom: 4px;">
            ${data.name || 'Your Name'}
          </div>
          <div style="font-style: italic; font-size: 14px; color: ${data.fontColor}; margin-bottom: 12px;">
            ${data.position || 'Your Position'}
          </div>
          ${divider}
          <div style="margin: 8px 0; color: ${data.fontColor};">
            ${websitesHtml}
          </div>
          ${websitesHtml ? divider : ''}
          <div style="margin: 8px 0; color: ${data.fontColor}; font-size: 14px;">
            <div style="margin-bottom: 4px;">📞 ${data.phone || '+1234567890'}</div>
            <div style="margin-bottom: 8px;">
              ✉️ <a href="mailto:${data.email || 'email@example.com'}" style="color: ${data.fontColor}; text-decoration: underline;">
                ${data.email || 'email@example.com'}
              </a>
            </div>
          </div>
          ${socialLinksHtml && `<div style="margin-top: 12px; border-top: 1px solid #ddd; padding-top: 8px;">${socialLinksHtml}</div>`}
        </td>
      </tr>
    </table>
  `;
};

export const generateMinimalTemplate = (data: SignatureFormData): string => {
  const websitesHtml = data.websites?.filter(Boolean).map(website => 
    `<a href="${website}" target="_blank" rel="noopener noreferrer" style="color: ${data.fontColor}; text-decoration: none; margin-right: 12px; font-size: 13px;">
      ${website.replace(/https?:\/\//, '')}
    </a>`
  ).join("") || "";

  const socialLinksHtml = data.socialLinks?.filter(link => link.url).map(link =>
    `<a href="${link.url}" target="_blank" rel="noopener noreferrer" style="margin-left: 8px;">
      <img src="${getSocialIconUrl(link.platform)}" style="width: 16px; height: 16px; opacity: 0.7;" />
    </a>`
  ).join("") || "";

  return `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; color: ${data.fontColor}; line-height: 1.4; max-width: 500px;">
      <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 12px;">
        ${data.profileImage ? 
          `<img src="${data.profileImage}" style="width: 60px; height: 60px; object-fit: cover; border-radius: ${data.imgStyle === 'circle' ? '50%' : '6px'};" />` :
          `<div style="width: 60px; height: 60px; background-color: ${data.fontColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold;">
            ${data.name ? data.name.charAt(0).toUpperCase() : 'A'}
          </div>`
        }
        <div>
          <div style="font-weight: ${data.fontWeight}; font-size: 18px; margin-bottom: 2px;">
            ${data.name || 'Your Name'}
          </div>
          <div style="font-size: 14px; opacity: 0.8;">
            ${data.position || 'Your Position'}
          </div>
        </div>
      </div>
      
      <div style="font-size: 13px; line-height: 1.5;">
        <div style="margin-bottom: 2px;">
          <a href="tel:${data.phone}" style="color: ${data.fontColor}; text-decoration: none;">${data.phone || '+1234567890'}</a>
          <span style="margin: 0 8px; opacity: 0.5;">•</span>
          <a href="mailto:${data.email || 'email@example.com'}" style="color: ${data.fontColor}; text-decoration: none;">
            ${data.email || 'email@example.com'}
          </a>
        </div>
        ${websitesHtml && `<div style="margin-top: 4px;">${websitesHtml}</div>`}
        ${socialLinksHtml && `<div style="margin-top: 8px; display: flex; align-items: center;"><span style="font-size: 12px; opacity: 0.6;">Connect:</span>${socialLinksHtml}</div>`}
      </div>
    </div>
  `;
};

export const generateCreativeTemplate = (data: SignatureFormData): string => {
  const websitesHtml = data.websites?.filter(Boolean).map(website => 
    `<div style="margin: 6px 0; color: ${data.fontColor}; display: flex; align-items: center; background: linear-gradient(45deg, ${data.fontColor}20, transparent); padding: 4px 8px; border-radius: 12px; border-left: 3px solid ${data.fontColor};">
      <span style="margin-right: 6px;">🔗</span>
      <a href="${website}" target="_blank" rel="noopener noreferrer" style="color: ${data.fontColor}; text-decoration: none; font-weight: 500;">
        ${website.replace(/https?:\/\//, '')}
      </a>
    </div>`
  ).join("") || "";

  const socialLinksHtml = data.socialLinks?.filter(link => link.url).map(link =>
    `<a href="${link.url}" target="_blank" rel="noopener noreferrer" style="margin-right: 12px; transform: scale(1); transition: transform 0.2s;">
      <img src="${getSocialIconUrl(link.platform)}" style="width: 22px; height: 22px; filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.1));" />
    </a>`
  ).join("") || "";

  return `
    <div style="font-family: 'SF Pro Display', -apple-system, sans-serif; background: linear-gradient(135deg, ${data.fontColor}05, ${data.fontColor}15); border-radius: 16px; padding: 20px; max-width: 550px; border: 1px solid ${data.fontColor}20;">
      <div style="display: flex; align-items: flex-start; gap: 20px;">
        <div style="flex-shrink: 0;">
          ${data.profileImage ? 
            `<img src="${data.profileImage}" style="width: 80px; height: 80px; object-fit: cover; border-radius: ${data.imgStyle === 'circle' ? '50%' : '16px'}; border: 3px solid ${data.fontColor}30; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));" />` :
            `<div style="width: 80px; height: 80px; background: linear-gradient(135deg, ${data.fontColor}, ${data.fontColor}80); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; font-weight: bold; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));">
              ${data.name ? data.name.charAt(0).toUpperCase() : 'A'}
            </div>`
          }
        </div>
        
        <div style="flex: 1;">
          <div style="font-weight: ${data.fontWeight}; font-size: 22px; color: ${data.fontColor}; margin-bottom: 6px; background: linear-gradient(45deg, ${data.fontColor}, ${data.fontColor}80); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            ${data.name || 'Your Name'}
          </div>
          <div style="font-size: 14px; color: ${data.fontColor}; margin-bottom: 16px; opacity: 0.8; font-weight: 500;">
            ${data.position || 'Your Position'}
          </div>
          
          <div style="margin: 12px 0;">
            ${websitesHtml}
          </div>
          
          <div style="display: flex; flex-wrap: wrap; gap: 12px; margin: 12px 0; font-size: 14px; color: ${data.fontColor};">
            <div style="display: flex; align-items: center; background: ${data.fontColor}10; padding: 6px 12px; border-radius: 20px;">
              <span style="margin-right: 6px;">📱</span>
              <a href="tel:${data.phone}" style="color: ${data.fontColor}; text-decoration: none; font-weight: 500;">${data.phone || '+1234567890'}</a>
            </div>
            <div style="display: flex; align-items: center; background: ${data.fontColor}10; padding: 6px 12px; border-radius: 20px;">
              <span style="margin-right: 6px;">✉️</span>
              <a href="mailto:${data.email || 'email@example.com'}" style="color: ${data.fontColor}; text-decoration: none; font-weight: 500;">
                ${data.email || 'email@example.com'}
              </a>
            </div>
          </div>
          
          ${socialLinksHtml && `<div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid ${data.fontColor}20; display: flex; align-items: center;">${socialLinksHtml}</div>`}
        </div>
      </div>
    </div>
  `;
};

export const generateProfessionalTemplate = (data: SignatureFormData): string => {
  const websitesHtml = data.websites?.filter(Boolean).map(website => 
    `<tr>
      <td style="padding: 2px 0; font-size: 13px; color: ${data.fontColor};">
        <img src="https://cdn-icons-png.flaticon.com/128/10453/10453141.png" style="width: 14px; margin-right: 8px; vertical-align: middle;" />
        <a href="${website}" target="_blank" rel="noopener noreferrer" style="color: ${data.fontColor}; text-decoration: none;">
          ${website}
        </a>
      </td>
    </tr>`
  ).join("") || "";

  const socialLinksHtml = data.socialLinks?.filter(link => link.url).map(link =>
    `<a href="${link.url}" target="_blank" rel="noopener noreferrer" style="margin-right: 10px;">
      <img src="${getSocialIconUrl(link.platform)}" style="width: 18px; height: 18px;" />
    </a>`
  ).join("") || "";

  return `
    <table style="font-family: 'Segoe UI', Arial, sans-serif; border-collapse: collapse; width: 100%; max-width: 600px; background: #fafafa; border: 1px solid #e0e0e0;">
      <tr>
        <td style="background: ${data.fontColor}; color: white; padding: 15px; text-align: center; vertical-align: middle; width: 120px;">
          ${data.profileImage ? 
            `<img src="${data.profileImage}" style="width: 80px; height: 80px; object-fit: cover; border-radius: ${data.imgStyle === 'circle' ? '50%' : '8px'}; border: 3px solid white;" />` :
            `<div style="width: 80px; height: 80px; background: white; color: ${data.fontColor}; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: bold; margin: 0 auto;">
              ${data.name ? data.name.charAt(0).toUpperCase() : 'A'}
            </div>`
          }
        </td>
        <td style="padding: 20px; vertical-align: top; background: white;">
          <table style="width: 100%;">
            <tr>
              <td style="font-weight: ${data.fontWeight}; font-size: 20px; color: ${data.fontColor}; padding-bottom: 4px;">
                ${data.name || 'Your Name'}
              </td>
            </tr>
            <tr>
              <td style="font-size: 14px; color: ${data.fontColor}; opacity: 0.8; padding-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;">
                ${data.position || 'Your Position'}
              </td>
            </tr>
            <tr>
              <td style="border-top: 2px solid ${data.fontColor}; padding-top: 12px;">
                <table style="width: 100%;">
                  ${websitesHtml}
                  <tr>
                    <td style="padding: 4px 0; font-size: 13px; color: ${data.fontColor};">
                      <img src="https://cdn-icons-png.flaticon.com/128/3059/3059446.png" style="width: 14px; margin-right: 8px; vertical-align: middle;" />
                      <a href="tel:${data.phone}" style="color: ${data.fontColor}; text-decoration: none;">${data.phone || '+1234567890'}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; font-size: 13px; color: ${data.fontColor};">
                      <img src="https://cdn-icons-png.flaticon.com/128/542/542689.png" style="width: 14px; margin-right: 8px; vertical-align: middle;" />
                      <a href="mailto:${data.email || 'email@example.com'}" style="color: ${data.fontColor}; text-decoration: none;">
                        ${data.email || 'email@example.com'}
                      </a>
                    </td>
                  </tr>
                  ${socialLinksHtml && `<tr><td style="padding-top: 10px;">${socialLinksHtml}</td></tr>`}
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
};

// Corporate Templates
export const generateCorporateCleanTemplate = (data: SignatureFormData): string => {
  const companyInfo = data.isCorporate ? `
    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #e0e0e0;">
      ${data.companyLogo ? 
        `<img src="${data.companyLogo}" style="width: 40px; height: 40px; object-fit: contain;" />` :
        `<div style="width: 40px; height: 40px; background: ${data.fontColor}; color: white; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold;">
          ${data.companyName ? data.companyName.charAt(0).toUpperCase() : 'C'}
        </div>`
      }
      <div style="font-weight: 600; font-size: 16px; color: ${data.fontColor};">
        ${data.companyName || 'Company Name'}
      </div>
    </div>
  ` : '';

  const websitesHtml = data.websites?.filter(Boolean).map(website => 
    `<div style="margin: 4px 0; font-size: 13px;">
      <a href="${website}" target="_blank" rel="noopener noreferrer" style="color: ${data.fontColor}; text-decoration: none;">
        ${website}
      </a>
    </div>`
  ).join("") || "";

  const socialLinksHtml = data.socialLinks?.filter(link => link.url).map(link =>
    `<a href="${link.url}" target="_blank" rel="noopener noreferrer" style="margin-right: 8px;">
      <img src="${getSocialIconUrl(link.platform)}" style="width: 16px; height: 16px;" />
    </a>`
  ).join("") || "";

  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; color: ${data.fontColor}; max-width: 500px; background: #f9f9f9; padding: 20px; border-left: 4px solid ${data.fontColor};">
      ${companyInfo}
      <div style="display: flex; align-items: center; gap: 16px;">
        ${data.profileImage ? 
          `<img src="${data.profileImage}" style="width: 70px; height: 70px; object-fit: cover; border-radius: ${data.imgStyle === 'circle' ? '50%' : '8px'};" />` :
          `<div style="width: 70px; height: 70px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold;">
            ${data.name ? data.name.charAt(0).toUpperCase() : 'A'}
          </div>`
        }
        <div style="flex: 1;">
          <div style="font-weight: ${data.fontWeight}; font-size: 18px; margin-bottom: 4px;">
            ${data.name || 'Your Name'}
          </div>
          <div style="font-size: 14px; color: ${data.fontColor}; opacity: 0.8; margin-bottom: 8px;">
            ${data.position || 'Your Position'}
          </div>
          <div style="font-size: 13px; line-height: 1.4;">
            <div>📞 ${data.phone || '+1234567890'}</div>
            <div>✉️ ${data.email || 'email@example.com'}</div>
            ${websitesHtml}
          </div>
          ${socialLinksHtml && `<div style="margin-top: 8px;">${socialLinksHtml}</div>`}
        </div>
      </div>
    </div>
  `;
};

export const generateCorporateBrandedTemplate = (data: SignatureFormData): string => {
  const companySection = data.isCorporate ? `
    <tr>
      <td style="background: ${data.fontColor}; padding: 15px; text-align: center;">
        ${data.companyLogo ? 
          `<img src="${data.companyLogo}" style="max-width: 120px; max-height: 60px; object-fit: contain;" />` :
          `<div style="color: white; font-size: 24px; font-weight: bold;">
            ${data.companyName || 'COMPANY NAME'}
          </div>`
        }
      </td>
    </tr>
  ` : '';

  const websitesHtml = data.websites?.filter(Boolean).map(website => 
    `<div style="margin: 4px 0; font-size: 13px;">
      <img src="https://cdn-icons-png.flaticon.com/128/10453/10453141.png" style="width: 12px; margin-right: 6px; opacity: 0.7;" />
      <a href="${website}" target="_blank" rel="noopener noreferrer" style="color: ${data.fontColor}; text-decoration: none;">
        ${website}
      </a>
    </div>`
  ).join("") || "";

  const socialLinksHtml = data.socialLinks?.filter(link => link.url).map(link =>
    `<a href="${link.url}" target="_blank" rel="noopener noreferrer" style="margin-right: 8px; opacity: 0.8;">
      <img src="${getSocialIconUrl(link.platform)}" style="width: 18px; height: 18px;" />
    </a>`
  ).join("") || "";

  return `
    <table style="font-family: 'Segoe UI', Arial, sans-serif; border-collapse: collapse; width: 100%; max-width: 600px; border: 2px solid ${data.fontColor};">
      ${companySection}
      <tr>
        <td style="padding: 20px; background: white;">
          <table style="width: 100%;">
            <tr>
              <td style="vertical-align: top; width: 100px; padding-right: 20px;">
                ${data.profileImage ? 
                  `<img src="${data.profileImage}" style="width: 80px; height: 80px; object-fit: cover; border-radius: ${data.imgStyle === 'circle' ? '50%' : '8px'}; border: 2px solid ${data.fontColor};" />` :
                  `<div style="width: 80px; height: 80px; background: ${data.fontColor}; color: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: bold;">
                    ${data.name ? data.name.charAt(0).toUpperCase() : 'A'}
                  </div>`
                }
              </td>
              <td style="vertical-align: top;">
                <div style="font-weight: ${data.fontWeight}; font-size: 20px; color: ${data.fontColor}; margin-bottom: 6px;">
                  ${data.name || 'Your Name'}
                </div>
                <div style="font-size: 14px; color: ${data.fontColor}; opacity: 0.8; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                  ${data.position || 'Your Position'}
                </div>
                <div style="font-size: 13px; color: ${data.fontColor}; line-height: 1.6;">
                  <div style="margin-bottom: 4px;">
                    <img src="https://cdn-icons-png.flaticon.com/128/3059/3059446.png" style="width: 12px; margin-right: 8px; opacity: 0.7;" />
                    ${data.phone || '+1234567890'}
                  </div>
                  <div style="margin-bottom: 8px;">
                    <img src="https://cdn-icons-png.flaticon.com/128/542/542689.png" style="width: 12px; margin-right: 8px; opacity: 0.7;" />
                    ${data.email || 'email@example.com'}
                  </div>
                  ${websitesHtml}
                </div>
                ${socialLinksHtml && `<div style="margin-top: 12px; border-top: 1px solid ${data.fontColor}30; padding-top: 8px;">${socialLinksHtml}</div>`}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
};
