import { SignatureFormData } from "./schemas";

/* -------------------------------------------------------------------------- */
/*  Shared, email-client-safe building blocks                                  */
/*  (table layouts + inline styles only: no flex/grid, works in Gmail/Outlook) */
/* -------------------------------------------------------------------------- */

const getSocialIconUrl = (platform: string) => {
  switch (platform) {
    case "LinkedIn":
      return "https://cdn-icons-png.flaticon.com/512/174/174857.png";
    case "GitHub":
      return "https://cdn-icons-png.flaticon.com/512/25/25231.png";
    case "WhatsApp":
      return "https://cdn-icons-png.flaticon.com/512/733/733585.png";
    case "Instagram":
      return "https://cdn-icons-png.flaticon.com/512/174/174855.png";
    case "YouTube":
      return "https://cdn-icons-png.flaticon.com/512/174/174883.png";
    case "Dribbble":
      return "https://cdn-icons-png.flaticon.com/512/5968/5968756.png";
    case "Behance":
      return "https://cdn-icons-png.flaticon.com/512/174/174863.png";
    default:
      return "";
  }
};

const ICONS = {
  phone: "https://cdn-icons-png.flaticon.com/128/3059/3059446.png",
  mail: "https://cdn-icons-png.flaticon.com/128/542/542689.png",
  web: "https://cdn-icons-png.flaticon.com/128/10453/10453141.png",
};

const esc = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const hostOf = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

const parseHex = (hex: string): [number, number, number] => {
  let h = (hex || "").replace("#", "");
  if (h.length === 3)
    h = h
      .split("")
      .map((x) => x + x)
      .join("");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return [0, 0, 0];
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
};

/** Mixes a color with white. pct = 0 → original, pct = 1 → white. */
const tint = (hex: string, pct: number) => {
  const [r, g, b] = parseHex(hex);
  const m = (v: number) =>
    Math.round(v + (255 - v) * pct)
      .toString(16)
      .padStart(2, "0");
  return `#${m(r)}${m(g)}${m(b)}`;
};

const luminance = (hex: string) => {
  const [r, g, b] = parseHex(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
};

interface Ctx {
  d: SignatureFormData;
  ff: string;
  accent: string;
  onAccent: string;
  text: string;
  muted: string;
  line: string;
  lineW: string;
  weight: string;
  name: string;
  position: string;
  initial: string;
  img: string;
  circle: boolean;
  company: string;
  logo: string;
  phoneL: string;
  emailL: string;
  siteLs: string[];
  socials: { platform: string; url: string }[];
}

const link = (href: string, label: string, color: string, extra = "") =>
  `<a href="${esc(
    href
  )}" target="_blank" rel="noopener noreferrer" style="color:${color};text-decoration:none;${extra}">${esc(
    label
  )}</a>`;

const ctx = (d: SignatureFormData): Ctx => {
  const accent = d.fontColor || "#111827";
  const font = d.fontFamily || "Poppins";
  const text = "#374151";
  const phone = d.phone || "+1234567890";
  const email = d.email || "email@example.com";
  const name = esc(d.name || "Your Name");
  return {
    d,
    ff: `'${font}',-apple-system,'Segoe UI',Arial,sans-serif`,
    accent,
    onAccent: luminance(accent) > 0.75 ? "#111827" : "#ffffff",
    text,
    muted: "#6b7280",
    line: d.dividerColor || "#e5e7eb",
    lineW: d.dividerWidth || "1px",
    weight: d.fontWeight === "bolder" ? "800" : d.fontWeight === "bold" ? "700" : "600",
    name,
    position: esc(d.position || "Your Position"),
    initial: (d.name || "A").trim().charAt(0).toUpperCase() || "A",
    img: d.profileImage || "",
    circle: d.imgStyle !== "square",
    company: esc(d.companyName || ""),
    logo: d.companyLogo || "",
    phoneL: link(`tel:${phone}`, phone, text),
    emailL: link(`mailto:${email}`, email, text),
    siteLs: (d.websites || []).filter(Boolean).map((s) => link(s, hostOf(s), text)),
    socials: (d.socialLinks || [])
      .filter((l) => l.url)
      .map((l) => ({ platform: l.platform, url: l.url })),
  };
};

const root = (c: Ctx, inner: string, extra = "") =>
  `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;border-spacing:0;font-family:${c.ff};color:${c.text};font-size:13px;line-height:1.5;${extra}">${inner}</table>`;

const avatar = (c: Ctx, size: number, border = "") => {
  const radius = c.circle ? "50%" : `${Math.round(size * 0.18)}px`;
  if (c.img) {
    return `<img src="${esc(c.img)}" width="${size}" height="${size}" alt="${
      c.name
    }" style="display:block;width:${size}px;height:${size}px;min-width:${size}px;object-fit:cover;border-radius:${radius};border:${
      border || "0"
    }">`;
  }
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td width="${size}" height="${size}" align="center" valign="middle" bgcolor="${
    c.accent
  }" style="width:${size}px;height:${size}px;background:${c.accent};border-radius:${radius};color:${
    c.onAccent
  };font-size:${Math.round(
    size * 0.38
  )}px;font-weight:700;line-height:${size}px;text-align:center;${
    border ? `border:${border};` : ""
  }">${c.initial}</td></tr></table>`;
};

const nameEl = (c: Ctx, size: number, color = c.accent) =>
  `<div style="font-size:${size}px;line-height:1.2;font-weight:${c.weight};color:${color};letter-spacing:-0.2px">${c.name}</div>`;

const rule = (color: string, width = "1px", margin = "10px 0") =>
  `<div style="height:0;border-top:${width} solid ${color};margin:${margin};font-size:0;line-height:0"></div>`;

const dot = (color: string) => `<span style="color:${color};padding:0 7px">&bull;</span>`;

const labelRow = (c: Ctx, label: string, html: string, labelColor = c.accent) =>
  `<tr><td valign="top" style="padding:0 10px 3px 0;width:12px;font-size:10.5px;font-weight:700;letter-spacing:.5px;line-height:19px;color:${labelColor}">${label}</td><td valign="top" style="padding:0 0 3px 0;font-size:13px;line-height:19px;color:${c.text}">${html}</td></tr>`;

const labelRows = (c: Ctx, maxSites = 2, labelColor = c.accent, textColor?: string) => {
  const t = textColor || c.text;
  const phone = link(`tel:${c.d.phone || "+1234567890"}`, c.d.phone || "+1234567890", t);
  const email = link(
    `mailto:${c.d.email || "email@example.com"}`,
    c.d.email || "email@example.com",
    t
  );
  const sites = (c.d.websites || [])
    .filter(Boolean)
    .slice(0, maxSites)
    .map((s) => link(s, hostOf(s), t));
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0">${labelRow(
    c,
    "T",
    phone,
    labelColor
  )}${labelRow(c, "E", email, labelColor)}${sites
    .map((s) => labelRow(c, "W", s, labelColor))
    .join("")}</table>`;
};

const iconRow = (c: Ctx, icon: string, html: string, invert = false) =>
  `<tr><td valign="middle" style="padding:0 9px 5px 0;width:14px"><img src="${icon}" width="14" height="14" alt="" style="display:block;border:0;opacity:.8;${
    invert ? "filter:invert(1);" : ""
  }"></td><td valign="middle" style="padding:0 0 5px 0;font-size:13px;color:${
    c.text
  }">${html}</td></tr>`;

const iconRows = (c: Ctx, maxSites = 2, textColor?: string, invert = false) => {
  const t = textColor || c.text;
  const phone = link(`tel:${c.d.phone || "+1234567890"}`, c.d.phone || "+1234567890", t);
  const email = link(
    `mailto:${c.d.email || "email@example.com"}`,
    c.d.email || "email@example.com",
    t
  );
  const sites = (c.d.websites || [])
    .filter(Boolean)
    .slice(0, maxSites)
    .map((s) => link(s, hostOf(s), t));
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0">${iconRow(
    c,
    ICONS.phone,
    phone,
    invert
  )}${iconRow(c, ICONS.mail, email, invert)}${sites
    .map((s) => iconRow(c, ICONS.web, s, invert))
    .join("")}</table>`;
};

const socialIcons = (c: Ctx, size: number, gap: number, max: number) => {
  const list = c.socials.slice(0, max);
  if (!list.length) return "";
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>${list
    .map(
      (l) =>
        `<td style="padding-right:${gap}px"><a href="${esc(
          l.url
        )}" target="_blank" rel="noopener noreferrer"><img src="${getSocialIconUrl(
          l.platform
        )}" width="${size}" height="${size}" alt="${esc(
          l.platform
        )}" style="display:block;border:0"></a></td>`
    )
    .join("")}</tr></table>`;
};

const socialBadges = (c: Ctx, size: number, bg: string, max: number) => {
  const list = c.socials.slice(0, max);
  if (!list.length) return "";
  const box = size + 12;
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>${list
    .map(
      (l) =>
        `<td style="padding-right:6px"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td width="${box}" height="${box}" align="center" valign="middle" bgcolor="${bg}" style="width:${box}px;height:${box}px;background:${bg};border-radius:50%"><a href="${esc(
          l.url
        )}" target="_blank" rel="noopener noreferrer"><img src="${getSocialIconUrl(
          l.platform
        )}" width="${size}" height="${size}" alt="${esc(
          l.platform
        )}" style="display:block;border:0;margin:0 auto"></a></td></tr></table></td>`
    )
    .join("")}</tr></table>`;
};

const companyMark = (c: Ctx, color: string, height = 36) =>
  c.logo
    ? `<img src="${esc(c.logo)}" height="${height}" alt="${
        c.company || "Company"
      }" style="display:block;height:${height}px;width:auto;max-width:170px;border:0">`
    : `<span style="font-size:${Math.round(
        height * 0.5
      )}px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:${color};line-height:1.2">${
        c.company || "Company Name"
      }</span>`;

/* -------------------------------------------------------------------------- */
/*  FREE TEMPLATES                                                             */
/* -------------------------------------------------------------------------- */

export const generateMinimalistWhiteTemplate = (data: SignatureFormData): string => {
  const c = ctx(data);
  const sites = c.siteLs.slice(0, 2).join(dot(c.line));
  const social = socialIcons(c, 16, 10, 3);
  return root(
    c,
    `<tr>
      <td valign="top" style="padding:0 16px 0 0">${avatar(c, 56)}</td>
      <td valign="top">
        ${nameEl(c, 17)}
        <div style="font-size:12.5px;color:${c.muted};margin-top:2px">${c.position}</div>
        ${rule(c.line, c.lineW, "10px 0")}
        <div style="font-size:12.5px">${c.phoneL}${dot(c.line)}${c.emailL}</div>
        ${sites ? `<div style="font-size:12.5px;margin-top:3px">${sites}</div>` : ""}
        ${social ? `<div style="margin-top:10px">${social}</div>` : ""}
      </td>
    </tr>`
  );
};

export const generateClassicLeftImageTemplate = (data: SignatureFormData): string => {
  const c = ctx(data);
  const social = socialIcons(c, 18, 10, 3);
  return root(
    c,
    `<tr>
      <td valign="top" style="padding:0 18px 0 0">${avatar(c, 84)}</td>
      <td valign="top" style="border-left:2px solid ${c.accent};padding:2px 0 2px 18px">
        ${nameEl(c, 19)}
        <div style="font-size:11px;letter-spacing:1.2px;text-transform:uppercase;color:${
          c.muted
        };margin:3px 0 10px">${c.position}</div>
        ${labelRows(c, 2)}
        ${social ? `<div style="margin-top:8px">${social}</div>` : ""}
      </td>
    </tr>`
  );
};

export const generateStackedCenteredTemplate = (data: SignatureFormData): string => {
  const c = ctx(data);
  const sites = c.siteLs.slice(0, 2).join(dot(c.line));
  const social = socialIcons(c, 18, 7, 3);
  return root(
    c,
    `<tr><td align="center" style="padding:0 0 12px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center"><tr><td>${avatar(
          c,
          84,
          `3px solid ${tint(c.accent, 0.85)}`
        )}</td></tr></table>
      </td></tr>
      <tr><td align="center">
        ${nameEl(c, 20)}
        <div style="font-size:12.5px;color:${c.muted};margin-top:3px">${c.position}</div>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:12px auto"><tr><td width="36" height="2" bgcolor="${
          c.accent
        }" style="width:36px;height:2px;background:${
      c.accent
    };font-size:0;line-height:0">&nbsp;</td></tr></table>
        <div style="font-size:12.5px">${c.phoneL}</div>
        <div style="font-size:12.5px">${c.emailL}</div>
        ${sites ? `<div style="font-size:12.5px">${sites}</div>` : ""}
        ${
          social
            ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin-top:12px"><tr><td>${social}</td></tr></table>`
            : ""
        }
      </td></tr>`,
    "text-align:center;"
  );
};

export const generateAccentBarTemplate = (data: SignatureFormData): string => {
  const c = ctx(data);
  const sites = c.siteLs.slice(0, 2).join(dot(c.line));
  const social = socialIcons(c, 16, 9, 3);
  return root(
    c,
    `<tr>
      <td width="4" bgcolor="${c.accent}" style="width:4px;background:${
      c.accent
    };border-radius:4px;font-size:0;line-height:0">&nbsp;</td>
      <td style="padding:2px 0 2px 16px" valign="top">
        ${nameEl(c, 19)}
        <div style="font-size:13px;font-weight:600;color:${c.muted};margin:2px 0 10px">${
      c.position
    }</div>
        <div style="font-size:12.5px;line-height:1.7">${c.phoneL}${dot(c.line)}${c.emailL}</div>
        ${sites ? `<div style="font-size:12.5px;line-height:1.7">${sites}</div>` : ""}
        ${social ? `<div style="margin-top:10px">${social}</div>` : ""}
      </td>
      ${c.img ? `<td valign="top" style="padding-left:20px">${avatar(c, 64)}</td>` : ""}
    </tr>`
  );
};

export const generateCompactLineTemplate = (data: SignatureFormData): string => {
  const c = ctx(data);
  const bits = [c.phoneL, c.emailL, ...c.siteLs.slice(0, 1)].join(dot(c.line));
  const social = socialIcons(c, 14, 8, 3);
  return root(
    c,
    `<tr><td style="padding:0">
        <span style="font-size:14px;font-weight:${c.weight};color:${c.accent}">${c.name}</span>
        <span style="color:${c.line};padding:0 8px">|</span>
        <span style="font-size:13px;color:${c.muted}">${c.position}</span>
      </td></tr>
      <tr><td style="padding:3px 0 0;font-size:12.5px">${bits}</td></tr>
      ${social ? `<tr><td style="padding:8px 0 0">${social}</td></tr>` : ""}`
  );
};

export const generateSoftCardTemplate = (data: SignatureFormData): string => {
  const c = ctx(data);
  const social = socialIcons(c, 17, 9, 3);
  return root(
    c,
    `<tr><td style="background:${tint(c.accent, 0.95)};border:1px solid ${tint(
      c.accent,
      0.86
    )};border-radius:14px;padding:16px 20px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
          <td valign="middle" style="padding:0 16px 0 0">${avatar(c, 68, "3px solid #ffffff")}</td>
          <td valign="middle">
            ${nameEl(c, 18)}
            <div style="font-size:12.5px;color:${c.muted};margin:2px 0 8px">${c.position}</div>
            ${labelRows(c, 1)}
            ${social ? `<div style="margin-top:6px">${social}</div>` : ""}
          </td>
        </tr></table>
      </td></tr>`
  );
};

/* -------------------------------------------------------------------------- */
/*  PREMIUM TEMPLATES                                                          */
/* -------------------------------------------------------------------------- */

export const generateModernTemplate = (data: SignatureFormData): string => {
  const c = ctx(data);
  const social = socialIcons(c, 20, 10, 6);
  return root(
    c,
    `<tr>
      <td valign="top" style="padding:0 20px 0 0">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:3px;border:2px solid ${
          c.accent
        };border-radius:${c.circle ? "50%" : "18px"}">${avatar(c, 84)}</td></tr></table>
      </td>
      <td valign="top">
        ${nameEl(c, 22)}
        <div style="font-size:12px;font-weight:600;letter-spacing:1.4px;text-transform:uppercase;color:${
          c.muted
        };margin:4px 0 12px">${c.position}</div>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td height="2" bgcolor="${
          c.accent
        }" style="height:2px;font-size:0;line-height:0;background:${
      c.accent
    };background-image:linear-gradient(90deg,${c.accent},${tint(
      c.accent,
      0.9
    )})">&nbsp;</td></tr></table>
        <div style="height:12px;font-size:0;line-height:0">&nbsp;</div>
        ${iconRows(c, 2)}
        ${social ? `<div style="margin-top:8px">${social}</div>` : ""}
      </td>
    </tr>`
  );
};

export const generateCreativeTemplate = (data: SignatureFormData): string => {
  const c = ctx(data);
  const pill = (html: string) =>
    `<span style="display:inline-block;background:${tint(c.accent, 0.93)};border:1px solid ${tint(
      c.accent,
      0.82
    )};border-radius:20px;padding:4px 12px;margin:0 6px 6px 0;font-size:12px">${html}</span>`;
  const pills = [pill(c.phoneL), pill(c.emailL), ...c.siteLs.slice(0, 2).map(pill)].join("");
  const social = socialIcons(c, 20, 10, 6);
  return root(
    c,
    `<tr><td style="background:${c.accent};border-radius:16px 16px 0 0;padding:18px 22px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
          <td valign="middle">
            <div style="font-size:23px;line-height:1.15;font-weight:${
              c.weight === "600" ? "700" : c.weight
            };color:${c.onAccent};letter-spacing:-0.3px">${c.name}</div>
            <div style="font-size:13px;color:${c.onAccent};opacity:.85;margin-top:4px">${
      c.position
    }</div>
          </td>
          <td valign="middle" align="right" style="padding-left:20px">${avatar(
            c,
            72,
            `3px solid ${c.onAccent}`
          )}</td>
        </tr></table>
      </td></tr>
      <tr><td style="background:#ffffff;border:1px solid ${tint(
        c.accent,
        0.8
      )};border-top:0;border-radius:0 0 16px 16px;padding:16px 22px 12px">
        <div>${pills}</div>
        ${
          social
            ? `<div style="margin-top:6px;padding-top:12px;border-top:1px dashed ${tint(
                c.accent,
                0.75
              )}">${social}</div>`
            : ""
        }
      </td></tr>`
  );
};

export const generateProfessionalTemplate = (data: SignatureFormData): string => {
  const c = ctx(data);
  const social = socialIcons(c, 18, 10, 6);
  return root(
    c,
    `<tr>
      <td valign="middle" align="center" style="background:${
        c.accent
      };border-radius:10px 0 0 10px;padding:22px 20px;width:96px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center"><tr><td>${avatar(
          c,
          84,
          `3px solid ${c.onAccent}`
        )}</td></tr></table>
      </td>
      <td valign="top" style="background:#ffffff;border:1px solid #e5e7eb;border-left:0;border-radius:0 10px 10px 0;padding:18px 24px 14px">
        ${nameEl(c, 20)}
        <div style="font-size:11.5px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:${
          c.muted
        };margin:4px 0 0">${c.position}</div>
        ${rule(c.accent, "2px", "12px 0 12px")}
        ${iconRows(c, 2)}
        ${social ? `<div style="margin-top:6px">${social}</div>` : ""}
      </td>
    </tr>`
  );
};

export const generateExecutiveDarkTemplate = (data: SignatureFormData): string => {
  const c = ctx(data);
  const hi = luminance(c.accent) < 0.3 ? "#c9a24a" : c.accent;
  const social = socialBadges(c, 14, "#ffffff", 6);
  const sites = (data.websites || [])
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => link(s, hostOf(s), "#e5e7eb"));
  const row = (label: string, html: string) =>
    `<tr><td valign="top" style="padding:0 12px 4px 0;width:12px;font-size:10.5px;font-weight:700;letter-spacing:.5px;line-height:19px;color:${hi}">${label}</td><td valign="top" style="padding:0 0 4px;font-size:13px;line-height:19px;color:#e5e7eb">${html}</td></tr>`;
  return root(
    c,
    `<tr><td style="background:#111827;border-radius:14px;padding:22px 26px;border-top:3px solid ${hi}">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
          <td valign="middle" style="padding:0 22px 0 0">${avatar(c, 80, `2px solid ${hi}`)}</td>
          <td valign="middle">
            <div style="font-size:21px;line-height:1.2;font-weight:${
              c.weight
            };color:#ffffff;letter-spacing:-0.2px">${c.name}</div>
            <div style="font-size:11.5px;font-weight:600;letter-spacing:1.6px;text-transform:uppercase;color:${hi};margin:4px 0 12px">${
      c.position
    }</div>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              ${row(
                "T",
                link(`tel:${data.phone || "+1234567890"}`, data.phone || "+1234567890", "#e5e7eb")
              )}
              ${row(
                "E",
                link(
                  `mailto:${data.email || "email@example.com"}`,
                  data.email || "email@example.com",
                  "#e5e7eb"
                )
              )}
              ${sites.map((s) => row("W", s)).join("")}
            </table>
            ${social ? `<div style="margin-top:10px">${social}</div>` : ""}
          </td>
        </tr></table>
      </td></tr>`
  );
};

/* -------------------------------------------------------------------------- */
/*  CORPORATE TEMPLATES                                                        */
/* -------------------------------------------------------------------------- */

export const generateCorporateCleanTemplate = (data: SignatureFormData): string => {
  const c = ctx(data);
  const social = socialIcons(c, 17, 9, 6);
  return root(
    c,
    `<tr><td style="background:#ffffff;border:1px solid #e5e7eb;border-left:4px solid ${
      c.accent
    };border-radius:6px;padding:16px 22px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
          <td valign="middle">${companyMark(c, c.accent, 34)}</td>
        </tr></table>
        ${rule(c.line, c.lineW, "12px 0 14px")}
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
          <td valign="top" style="padding:0 16px 0 0">${avatar(c, 68)}</td>
          <td valign="top">
            ${nameEl(c, 18)}
            <div style="font-size:12.5px;color:${c.muted};margin:2px 0 8px">${c.position}</div>
            ${labelRows(c, 2)}
            ${social ? `<div style="margin-top:6px">${social}</div>` : ""}
          </td>
        </tr></table>
      </td></tr>`
  );
};

export const generateCorporateBrandedTemplate = (data: SignatureFormData): string => {
  const c = ctx(data);
  const sites = c.siteLs.slice(0, 2).join(dot(c.line));
  const social = socialIcons(c, 17, 9, 6);
  return root(
    c,
    `<tr><td style="background:${
      c.accent
    };border-radius:10px 10px 0 0;padding:14px 22px">${companyMark(c, c.onAccent, 34)}</td></tr>
      <tr><td style="background:#ffffff;border-left:1px solid ${tint(
        c.accent,
        0.75
      )};border-right:1px solid ${tint(c.accent, 0.75)};padding:18px 22px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
          <td valign="top" style="padding:0 18px 0 0">${avatar(c, 78)}</td>
          <td valign="top">
            ${nameEl(c, 20)}
            <div style="font-size:11.5px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:${
              c.muted
            };margin:3px 0 10px">${c.position}</div>
            ${labelRows(c, 0)}
          </td>
        </tr></table>
      </td></tr>
      <tr><td style="background:${tint(c.accent, 0.94)};border:1px solid ${tint(
      c.accent,
      0.75
    )};border-top:0;border-radius:0 0 10px 10px;padding:10px 22px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
          <td valign="middle" style="font-size:12.5px">${
            sites || `<span style="color:${c.muted}">${c.company || "Company Name"}</span>`
          }</td>
          <td valign="middle" align="right">${social}</td>
        </tr></table>
      </td></tr>`
  );
};

export const generateCorporateSplitTemplate = (data: SignatureFormData): string => {
  const c = ctx(data);
  const sites = c.siteLs
    .slice(0, 2)
    .map((s) => `<div style="font-size:12px;margin-top:3px">${s}</div>`)
    .join("");
  const social = socialIcons(c, 17, 9, 6);
  return root(
    c,
    `<tr>
      <td valign="middle" align="left" style="padding:4px 24px 4px 0;border-right:${
        c.lineW === "0px" ? "1px" : c.lineW
      } solid ${c.line};min-width:130px">
        ${companyMark(c, c.accent, 40)}
        ${sites ? `<div style="margin-top:10px">${sites}</div>` : ""}
      </td>
      <td valign="top" style="padding:4px 0 4px 24px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
          ${c.img ? `<td valign="top" style="padding:0 14px 0 0">${avatar(c, 58)}</td>` : ""}
          <td valign="top">
            ${nameEl(c, 18)}
            <div style="font-size:12.5px;color:${c.muted};margin:2px 0 8px">${c.position}</div>
            ${labelRows(c, 0)}
            ${social ? `<div style="margin-top:6px">${social}</div>` : ""}
          </td>
        </tr></table>
      </td>
    </tr>`
  );
};

export const generateCorporateExecutiveTemplate = (data: SignatureFormData): string => {
  const c = ctx(data);
  const social = socialBadges(c, 14, "#ffffff", 6);
  const sites = c.siteLs.slice(0, 2).join(dot(c.line));
  return root(
    c,
    `<tr><td style="background:#ffffff;border:1px solid #e5e7eb;border-bottom:0;border-radius:10px 10px 0 0;padding:20px 24px 16px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
          <td valign="top" style="padding:0 20px 0 0">${avatar(c, 76)}</td>
          <td valign="top">
            ${nameEl(c, 21)}
            <div style="font-size:11.5px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${
              c.muted
            };margin:3px 0 0">${c.position}</div>
            ${rule(c.line, c.lineW, "11px 0")}
            <div style="font-size:12.5px;line-height:1.7">${c.phoneL}${dot(c.line)}${c.emailL}</div>
            ${sites ? `<div style="font-size:12.5px;line-height:1.7">${sites}</div>` : ""}
          </td>
        </tr></table>
      </td></tr>
      <tr><td style="background:${c.accent};border-radius:0 0 10px 10px;padding:11px 24px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
          <td valign="middle">${companyMark(c, c.onAccent, 26)}</td>
          <td valign="middle" align="right">${social}</td>
        </tr></table>
      </td></tr>`
  );
};
