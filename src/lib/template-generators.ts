import { SignatureFormData } from "./schemas";

/* -------------------------------------------------------------------------- */
/*  Shared, email-client-safe building blocks                                  */
/*  (table layouts + inline styles only: no flex/grid, works in Gmail/Outlook) */
/*                                                                            */
/*  Every template reads its colors, font, borders and dividers from `ctx()`,  */
/*  so the Style Configuration panel can customize any design consistently.    */
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

const toHex = (r: number, g: number, b: number) =>
  `#${[r, g, b]
    .map((v) =>
      Math.max(0, Math.min(255, Math.round(v)))
        .toString(16)
        .padStart(2, "0")
    )
    .join("")}`;

/** Mixes a color with white. pct = 0 → original, pct = 1 → white. */
const tint = (hex: string, pct: number) => {
  const [r, g, b] = parseHex(hex);
  return toHex(r + (255 - r) * pct, g + (255 - g) * pct, b + (255 - b) * pct);
};

/** Linear blend between two colors. t = 0 → a, t = 1 → b. */
const blend = (a: string, b: string, t: number) => {
  const [ar, ag, ab] = parseHex(a);
  const [br, bg, bb] = parseHex(b);
  return toHex(ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t);
};

const luminance = (hex: string) => {
  const [r, g, b] = parseHex(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
};

const isHex = (value?: string) =>
  !!value && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.trim());
const pick = (value: string | undefined, fallback: string) =>
  isHex(value) ? (value as string).trim() : fallback;

const fontStack = (family: string) => {
  switch (family) {
    case "Source Sans Pro":
      return "'Source Sans 3','Source Sans Pro',-apple-system,'Segoe UI',Arial,sans-serif";
    case "Georgia":
      return "Georgia,'Times New Roman',Times,serif";
    case "Merriweather":
      return "'Merriweather',Georgia,'Times New Roman',serif";
    case "Arial":
      return "Arial,Helvetica,sans-serif";
    default:
      return `'${family}',-apple-system,'Segoe UI',Arial,sans-serif`;
  }
};

interface CtxOptions {
  /** Default surface color of the template (used to decide light/dark text defaults). */
  bg?: string;
  /** Default font family of the template when the user keeps "Default". */
  font?: string;
}

interface Ctx {
  d: SignatureFormData;
  ff: string;
  accent: string;
  onAccent: string;
  nameColor: string;
  text: string;
  muted: string;
  dark: boolean;
  lineDef: string;
  name: string;
  position: string;
  initial: string;
  img: string;
  circle: boolean;
  weight: string;
  company: string;
  logo: string;
  phoneL: string;
  emailL: string;
  siteLs: string[];
  socials: { platform: string; url: string }[];
  /** Surface color: user override or the template default. */
  bg: (def: string) => string;
  /** CSS border shorthand value: user override (color/width) or template default. */
  bd: (defColor?: string, defWidth?: string) => string;
  /** Divider color: user override or template default. */
  dc: (def: string) => string;
  /** Divider thickness: user override or template default. */
  dw: (def: string) => string;
  /** A soft shade of a color that works on both light and dark surfaces. */
  soft: (pct: number, color?: string) => string;
}

const link = (href: string, label: string, color: string, extra = "") =>
  `<a href="${esc(
    href
  )}" target="_blank" rel="noopener noreferrer" style="color:${color};text-decoration:none;${extra}">${esc(
    label
  )}</a>`;

const ctx = (d: SignatureFormData, o: CtxOptions = {}): Ctx => {
  const baseAccent = pick(d.fontColor, "#111827");
  const surface = pick(d.backgroundColor, o.bg || "#ffffff");
  const dark = luminance(surface) < 0.45;
  const accent = dark && luminance(baseAccent) < 0.35 ? "#c9a24a" : baseAccent;
  const text = pick(d.textColor, dark ? "#e5e7eb" : "#374151");
  const muted = pick(d.mutedColor, dark ? "#9ca3af" : "#6b7280");
  const nameColor = pick(d.nameColor, dark && luminance(baseAccent) < 0.35 ? "#ffffff" : accent);
  const family = !d.fontFamily || d.fontFamily === "Default" ? o.font || "Poppins" : d.fontFamily;
  const phone = d.phone || "+1234567890";
  const email = d.email || "email@example.com";
  const borderColor = isHex(d.borderColor) ? (d.borderColor as string).trim() : "";

  return {
    d,
    ff: fontStack(family),
    accent,
    onAccent: luminance(accent) > 0.75 ? "#111827" : "#ffffff",
    nameColor,
    text,
    muted,
    dark,
    lineDef: dark ? "#374151" : "#e5e7eb",
    name: esc(d.name || "Your Name"),
    position: esc(d.position || "Your Position"),
    initial: (d.name || "A").trim().charAt(0).toUpperCase() || "A",
    img: d.profileImage || "",
    circle: d.imgStyle !== "square",
    weight: d.fontWeight === "bolder" ? "800" : d.fontWeight === "bold" ? "700" : "600",
    company: esc(d.companyName || ""),
    logo: d.companyLogo || "",
    phoneL: link(`tel:${phone}`, phone, text),
    emailL: link(`mailto:${email}`, email, text),
    siteLs: (d.websites || []).filter(Boolean).map((s) => link(s, hostOf(s), text)),
    socials: (d.socialLinks || [])
      .filter((l) => l.url)
      .map((l) => ({ platform: l.platform, url: l.url })),
    bg: (def) => (isHex(d.backgroundColor) ? (d.backgroundColor as string).trim() : def),
    bd: (defColor, defWidth = "1px") => {
      const width =
        d.borderWidth || (borderColor ? (defWidth === "0px" ? "1px" : defWidth) : defWidth);
      if (width === "0px" || width === "0") return "0";
      return `${width} solid ${borderColor || defColor || (dark ? "#374151" : "#e5e7eb")}`;
    },
    dc: (def) => (isHex(d.dividerColor) ? (d.dividerColor as string).trim() : def),
    dw: (def) => (d.dividerWidth && /^\d+px$/.test(d.dividerWidth) ? d.dividerWidth : def),
    soft: (pct, color = accent) =>
      dark ? blend(surface, color, (1 - pct) * 0.9) : tint(color, pct),
  };
};

const root = (c: Ctx, inner: string, extra = "") =>
  `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;border-spacing:0;font-family:${c.ff};color:${c.text};font-size:13px;line-height:1.5;${extra}">${inner}</table>`;

/**
 * Plain (card-less) designs get an optional frame so that a custom background
 * and/or border can still be applied to them.
 */
const frame = (c: Ctx, html: string, radius = 12, padding = "16px 20px") => {
  const d = c.d;
  const hasBg = isHex(d.backgroundColor);
  const hasBorder = isHex(d.borderColor) || (!!d.borderWidth && d.borderWidth !== "0px");
  if (!hasBg && !hasBorder) return html;
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;border-spacing:0"><tr><td style="font-family:${
    c.ff
  };${hasBg ? `background:${c.bg("#ffffff")};` : ""}${
    hasBorder ? `border:${c.bd()};` : ""
  }border-radius:${radius}px;padding:${padding}">${html}</td></tr></table>`;
};

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

const nameEl = (c: Ctx, size: number, color = c.nameColor) =>
  `<div style="font-size:${size}px;line-height:1.2;font-weight:${c.weight};color:${color};letter-spacing:-0.2px">${c.name}</div>`;

const rule = (color: string, width = "1px", margin = "10px 0") =>
  `<div style="height:0;border-top:${width} solid ${color};margin:${margin};font-size:0;line-height:0"></div>`;

const dot = (color: string) => `<span style="color:${color};padding:0 7px">&bull;</span>`;

const labelRow = (c: Ctx, label: string, html: string, labelColor = c.accent) =>
  `<tr><td valign="top" style="padding:0 10px 3px 0;width:12px;font-size:10.5px;font-weight:700;letter-spacing:.5px;line-height:19px;color:${labelColor}">${label}</td><td valign="top" style="padding:0 0 3px 0;font-size:13px;line-height:19px;color:${c.text}">${html}</td></tr>`;

const labelRows = (c: Ctx, maxSites = 2) => {
  const sites = c.siteLs.slice(0, maxSites);
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0">${labelRow(
    c,
    "T",
    c.phoneL
  )}${labelRow(c, "E", c.emailL)}${sites.map((s) => labelRow(c, "W", s)).join("")}</table>`;
};

const iconRow = (c: Ctx, icon: string, html: string) =>
  `<tr><td valign="middle" style="padding:0 9px 5px 0;width:14px"><img src="${icon}" width="14" height="14" alt="" style="display:block;border:0;opacity:.8;${
    c.dark ? "filter:invert(1);" : ""
  }"></td><td valign="middle" style="padding:0 0 5px 0;font-size:13px;color:${
    c.text
  }">${html}</td></tr>`;

const siteIconRows = (c: Ctx, maxSites = 2) =>
  c.siteLs
    .slice(0, maxSites)
    .map((s) => iconRow(c, ICONS.web, s))
    .join("");

const iconRows = (c: Ctx, maxSites = 2) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" border="0">${iconRow(
    c,
    ICONS.phone,
    c.phoneL
  )}${iconRow(c, ICONS.mail, c.emailL)}${siteIconRows(c, maxSites)}</table>`;

const socialBadges = (c: Ctx, size: number, bg: string, max: number) => {
  const list = c.socials.slice(0, max);
  if (!list.length) return "";
  const box = size + 12;
  const badgeBg = c.dark ? "#ffffff" : bg;
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>${list
    .map(
      (l) =>
        `<td style="padding-right:6px"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td width="${box}" height="${box}" align="center" valign="middle" bgcolor="${badgeBg}" style="width:${box}px;height:${box}px;background:${badgeBg};border-radius:50%"><a href="${esc(
          l.url
        )}" target="_blank" rel="noopener noreferrer"><img src="${getSocialIconUrl(
          l.platform
        )}" width="${size}" height="${size}" alt="${esc(
          l.platform
        )}" style="display:block;border:0;margin:0 auto"></a></td></tr></table></td>`
    )
    .join("")}</tr></table>`;
};

/** Plain social icons; on dark surfaces they automatically sit inside light badges so dark icons stay visible. */
const socialIcons = (c: Ctx, size: number, gap: number, max: number) => {
  if (c.dark) return socialBadges(c, Math.max(12, size - 3), "#ffffff", max);
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
  const sites = c.siteLs.slice(0, 2).join(dot(c.lineDef));
  const social = socialIcons(c, 16, 10, 3);
  return frame(
    c,
    root(
      c,
      `<tr>
      <td valign="top" style="padding:0 16px 0 0">${avatar(c, 56)}</td>
      <td valign="top">
        ${nameEl(c, 17)}
        <div style="font-size:12.5px;color:${c.muted};margin-top:2px">${c.position}</div>
        ${rule(c.dc(c.lineDef), c.dw("1px"), "10px 0")}
        <div style="font-size:12.5px">${c.phoneL}${dot(c.lineDef)}${c.emailL}</div>
        ${sites ? `<div style="font-size:12.5px;margin-top:3px">${sites}</div>` : ""}
        ${social ? `<div style="margin-top:10px">${social}</div>` : ""}
      </td>
    </tr>`
    )
  );
};

export const generateClassicLeftImageTemplate = (data: SignatureFormData): string => {
  const c = ctx(data);
  const social = socialIcons(c, 18, 10, 3);
  return frame(
    c,
    root(
      c,
      `<tr>
      <td valign="top" style="padding:0 18px 0 0">${avatar(c, 84)}</td>
      <td valign="top" style="border-left:${c.dw("2px")} solid ${c.dc(
        c.accent
      )};padding:2px 0 2px 18px">
        ${nameEl(c, 19)}
        <div style="font-size:11px;letter-spacing:1.2px;text-transform:uppercase;color:${
          c.muted
        };margin:3px 0 10px">${c.position}</div>
        ${labelRows(c, 2)}
        ${social ? `<div style="margin-top:8px">${social}</div>` : ""}
      </td>
    </tr>`
    )
  );
};

export const generateStackedCenteredTemplate = (data: SignatureFormData): string => {
  const c = ctx(data);
  const sites = c.siteLs.slice(0, 2).join(dot(c.lineDef));
  const social = socialIcons(c, 18, 7, 3);
  const bar = c.dc(c.accent);
  const barH = c.dw("2px");
  return frame(
    c,
    root(
      c,
      `<tr><td align="center" style="padding:0 0 12px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center"><tr><td>${avatar(
          c,
          84,
          `3px solid ${c.soft(0.85)}`
        )}</td></tr></table>
      </td></tr>
      <tr><td align="center">
        ${nameEl(c, 20)}
        <div style="font-size:12.5px;color:${c.muted};margin-top:3px">${c.position}</div>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:12px auto"><tr><td width="36" height="${parseInt(
          barH,
          10
        )}" bgcolor="${bar}" style="width:36px;height:${barH};background:${bar};font-size:0;line-height:0">&nbsp;</td></tr></table>
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
    )
  );
};

export const generateAccentBarTemplate = (data: SignatureFormData): string => {
  const c = ctx(data);
  const sites = c.siteLs.slice(0, 2).join(dot(c.lineDef));
  const social = socialIcons(c, 16, 9, 3);
  const barW = c.dw("4px");
  const bar = c.dc(c.accent);
  return frame(
    c,
    root(
      c,
      `<tr>
      <td width="${parseInt(
        barW,
        10
      )}" bgcolor="${bar}" style="width:${barW};background:${bar};border-radius:4px;font-size:0;line-height:0">&nbsp;</td>
      <td style="padding:2px 0 2px 16px" valign="top">
        ${nameEl(c, 19)}
        <div style="font-size:13px;font-weight:600;color:${c.muted};margin:2px 0 10px">${
        c.position
      }</div>
        <div style="font-size:12.5px;line-height:1.7">${c.phoneL}${dot(c.lineDef)}${c.emailL}</div>
        ${sites ? `<div style="font-size:12.5px;line-height:1.7">${sites}</div>` : ""}
        ${social ? `<div style="margin-top:10px">${social}</div>` : ""}
      </td>
      ${c.img ? `<td valign="top" style="padding-left:20px">${avatar(c, 64)}</td>` : ""}
    </tr>`
    )
  );
};

export const generateCompactLineTemplate = (data: SignatureFormData): string => {
  const c = ctx(data);
  const bits = [c.phoneL, c.emailL, ...c.siteLs.slice(0, 1)].join(dot(c.lineDef));
  const social = socialIcons(c, 14, 8, 3);
  return frame(
    c,
    root(
      c,
      `<tr><td style="padding:0">
        <span style="font-size:14px;font-weight:${c.weight};color:${c.nameColor}">${c.name}</span>
        <span style="color:${c.dc(c.lineDef)};padding:0 8px">|</span>
        <span style="font-size:13px;color:${c.muted}">${c.position}</span>
      </td></tr>
      <tr><td style="padding:3px 0 0;font-size:12.5px">${bits}</td></tr>
      ${social ? `<tr><td style="padding:8px 0 0">${social}</td></tr>` : ""}`
    ),
    10,
    "12px 16px"
  );
};

export const generateSoftCardTemplate = (data: SignatureFormData): string => {
  const c = ctx(data);
  const cardBg = c.bg(c.soft(0.95));
  const social = socialIcons(c, 17, 9, 3);
  return root(
    c,
    `<tr><td style="background:${cardBg};border:${c.bd(
      c.soft(0.86)
    )};border-radius:14px;padding:16px 20px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
          <td valign="middle" style="padding:0 16px 0 0">${avatar(
            c,
            68,
            `3px solid ${c.dark ? c.soft(0.7) : "#ffffff"}`
          )}</td>
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

const tile = (c: Ctx, size: number) => {
  if (c.img) {
    return `<img src="${esc(c.img)}" width="${size}" height="${size}" alt="${
      c.name
    }" style="display:block;width:${size}px;height:${size}px;min-width:${size}px;object-fit:cover;border-radius:16px;border:0">`;
  }
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td width="${size}" height="${size}" align="center" valign="middle" bgcolor="${
    c.accent
  }" style="width:${size}px;height:${size}px;background:${c.accent};border-radius:16px;color:${
    c.onAccent
  };font-size:${Math.round(
    size * 0.44
  )}px;font-weight:700;line-height:${size}px;text-align:center;letter-spacing:-1px">${
    c.initial
  }</td></tr></table>`;
};

export const generateTwoColumnTemplate = (data: SignatureFormData): string => {
  const c = ctx(data);
  const social = socialIcons(c, 16, 9, 3);
  return frame(
    c,
    root(
      c,
      `<tr>
      <td valign="top" style="padding:2px 24px 2px 0;border-right:${c.dw("1px")} solid ${c.dc(
        c.lineDef
      )}">
        ${c.img ? `<div style="margin-bottom:10px">${avatar(c, 52)}</div>` : ""}
        ${nameEl(c, 19)}
        <div style="font-size:12.5px;color:${c.muted};margin-top:3px">${c.position}</div>
        ${social ? `<div style="margin-top:12px">${social}</div>` : ""}
      </td>
      <td valign="middle" style="padding:2px 0 2px 24px">${labelRows(c, 2)}</td>
    </tr>`
    )
  );
};

export const generateUnderlineAccentTemplate = (data: SignatureFormData): string => {
  const c = ctx(data);
  const sites = c.siteLs.slice(0, 2).join(dot(c.lineDef));
  const social = socialIcons(c, 16, 9, 3);
  return frame(
    c,
    root(
      c,
      `<tr>
      <td valign="middle" style="padding:0 24px 12px 0">
        ${nameEl(c, 21)}
        <div style="font-size:12px;font-weight:600;letter-spacing:1.4px;text-transform:uppercase;color:${
          c.muted
        };margin-top:4px">${c.position}</div>
      </td>
      <td valign="middle" align="right" style="padding:0 0 12px">${avatar(c, 58)}</td>
    </tr>
    <tr><td colspan="2" style="border-top:${c.dw("3px")} solid ${c.dc(c.accent)};padding-top:11px">
      <div style="font-size:12.5px">${c.phoneL}${dot(c.lineDef)}${c.emailL}</div>
      ${sites ? `<div style="font-size:12.5px;margin-top:2px">${sites}</div>` : ""}
      ${social ? `<div style="margin-top:10px">${social}</div>` : ""}
    </td></tr>`
    )
  );
};

export const generateMonogramTileTemplate = (data: SignatureFormData): string => {
  const c = ctx(data);
  const sites = c.siteLs.slice(0, 2).join(dot(c.lineDef));
  const social = socialIcons(c, 16, 9, 3);
  return frame(
    c,
    root(
      c,
      `<tr>
      <td valign="top" style="padding:0 16px 0 0">${tile(c, 66)}</td>
      <td valign="middle">
        ${nameEl(c, 18)}
        <div style="font-size:12.5px;color:${c.muted};margin:2px 0 8px">${c.position}</div>
        <div style="font-size:12.5px;line-height:1.7">${c.phoneL}${dot(c.lineDef)}${c.emailL}</div>
        ${sites ? `<div style="font-size:12.5px;line-height:1.7">${sites}</div>` : ""}
        ${social ? `<div style="margin-top:8px">${social}</div>` : ""}
      </td>
    </tr>`
    )
  );
};

export const generateSerifClassicTemplate = (data: SignatureFormData): string => {
  const c = ctx(data, { font: "Georgia" });
  const sites = c.siteLs.slice(0, 2).join(dot(c.lineDef));
  const social = socialIcons(c, 15, 9, 3);
  const line = `${c.dw("1px")} solid ${c.dc(c.lineDef)}`;
  return frame(
    c,
    root(
      c,
      `<tr><td style="border-top:${line};border-bottom:${line};padding:14px 2px">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
        <td valign="middle">
          <div style="font-size:22px;line-height:1.2;font-weight:${
            data.fontWeight === "normal" ? "normal" : c.weight
          };color:${c.nameColor};letter-spacing:.3px">${c.name}</div>
          <div style="font-size:14px;font-style:italic;color:${c.muted};margin:3px 0 10px">${
        c.position
      }</div>
          <div style="font-size:12px;letter-spacing:.3px">${c.phoneL}${dot(c.lineDef)}${
        c.emailL
      }</div>
          ${
            sites
              ? `<div style="font-size:12px;margin-top:2px;letter-spacing:.3px">${sites}</div>`
              : ""
          }
          ${social ? `<div style="margin-top:10px">${social}</div>` : ""}
        </td>
        ${
          c.img
            ? `<td valign="middle" align="right" style="padding-left:20px">${avatar(c, 72)}</td>`
            : ""
        }
      </tr></table>
    </td></tr>`
    )
  );
};

/* -------------------------------------------------------------------------- */
/*  PREMIUM TEMPLATES                                                          */
/* -------------------------------------------------------------------------- */

export const generateModernTemplate = (data: SignatureFormData): string => {
  const c = ctx(data);
  const social = socialIcons(c, 20, 10, 6);
  const div = c.dc(c.accent);
  const divH = c.dw("2px");
  return frame(
    c,
    root(
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
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td height="${parseInt(
          divH,
          10
        )}" bgcolor="${div}" style="height:${divH};font-size:0;line-height:0;background:${div};background-image:linear-gradient(90deg,${div},${c.soft(
        0.9,
        div
      )})">&nbsp;</td></tr></table>
        <div style="height:12px;font-size:0;line-height:0">&nbsp;</div>
        ${iconRows(c, 2)}
        ${social ? `<div style="margin-top:8px">${social}</div>` : ""}
      </td>
    </tr>`
    )
  );
};

export const generateCreativeTemplate = (data: SignatureFormData): string => {
  const c = ctx(data);
  const pill = (html: string) =>
    `<span style="display:inline-block;background:${c.soft(0.93)};border:1px solid ${c.soft(
      0.82
    )};border-radius:20px;padding:4px 12px;margin:0 6px 6px 0;font-size:12px">${html}</span>`;
  const pills = [pill(c.phoneL), pill(c.emailL), ...c.siteLs.slice(0, 2).map(pill)].join("");
  const social = socialIcons(c, 20, 10, 6);
  const bodyBorder = c.bd(c.soft(0.8));
  return root(
    c,
    `<tr><td style="background:${c.accent};border-radius:16px 16px 0 0;padding:18px 22px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
          <td valign="middle">
            <div style="font-size:23px;line-height:1.15;font-weight:${
              c.weight === "600" ? "700" : c.weight
            };color:${isHex(data.nameColor) ? c.nameColor : c.onAccent};letter-spacing:-0.3px">${
      c.name
    }</div>
            <div style="font-size:13px;color:${
              isHex(data.mutedColor) ? c.muted : c.onAccent
            };opacity:${isHex(data.mutedColor) ? 1 : 0.85};margin-top:4px">${c.position}</div>
          </td>
          <td valign="middle" align="right" style="padding-left:20px">${avatar(
            c,
            72,
            `3px solid ${c.onAccent}`
          )}</td>
        </tr></table>
      </td></tr>
      <tr><td style="background:${c.bg(
        "#ffffff"
      )};border:${bodyBorder};border-top:0;border-radius:0 0 16px 16px;padding:16px 22px 12px">
        <div>${pills}</div>
        ${
          social
            ? `<div style="margin-top:6px;padding-top:12px;border-top:${c.dw("1px")} dashed ${c.dc(
                c.soft(0.75)
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
      <td valign="top" style="background:${c.bg(
        "#ffffff"
      )};border:${c.bd()};border-left:0;border-radius:0 10px 10px 0;padding:18px 24px 14px">
        ${nameEl(c, 20)}
        <div style="font-size:11.5px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:${
          c.muted
        };margin:4px 0 0">${c.position}</div>
        ${rule(c.dc(c.accent), c.dw("2px"), "12px 0 12px")}
        ${iconRows(c, 2)}
        ${social ? `<div style="margin-top:6px">${social}</div>` : ""}
      </td>
    </tr>`
  );
};

export const generateExecutiveDarkTemplate = (data: SignatureFormData): string => {
  const c = ctx(data, { bg: "#111827" });
  const social = socialIcons(c, 17, 6, 6);
  const position = isHex(data.mutedColor) ? c.muted : c.accent;
  const row = (label: string, html: string) =>
    `<tr><td valign="top" style="padding:0 12px 4px 0;width:12px;font-size:10.5px;font-weight:700;letter-spacing:.5px;line-height:19px;color:${c.accent}">${label}</td><td valign="top" style="padding:0 0 4px;font-size:13px;line-height:19px;color:${c.text}">${html}</td></tr>`;
  return root(
    c,
    `<tr><td style="background:${c.bg("#111827")};border:${c.bd(
      "#1f2937",
      "0px"
    )};border-top:${c.dw("3px")} solid ${c.dc(c.accent)};border-radius:14px;padding:22px 26px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
          <td valign="middle" style="padding:0 22px 0 0">${avatar(
            c,
            80,
            `2px solid ${c.accent}`
          )}</td>
          <td valign="middle">
            <div style="font-size:21px;line-height:1.2;font-weight:${c.weight};color:${
      c.nameColor
    };letter-spacing:-0.2px">${c.name}</div>
            <div style="font-size:11.5px;font-weight:600;letter-spacing:1.6px;text-transform:uppercase;color:${position};margin:4px 0 12px">${
      c.position
    }</div>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              ${row("T", c.phoneL)}
              ${row("E", c.emailL)}
              ${c.siteLs
                .slice(0, 2)
                .map((s) => row("W", s))
                .join("")}
            </table>
            ${social ? `<div style="margin-top:10px">${social}</div>` : ""}
          </td>
        </tr></table>
      </td></tr>`
  );
};

export const generateGradientEdgeTemplate = (data: SignatureFormData): string => {
  const c = ctx(data);
  const social = socialIcons(c, 20, 10, 6);
  const edge = c.dc(c.accent);
  const edgeH = c.dw("6px");
  const left = `<table role="presentation" cellpadding="0" cellspacing="0" border="0">${iconRow(
    c,
    ICONS.phone,
    c.phoneL
  )}${iconRow(c, ICONS.mail, c.emailL)}</table>`;
  const sites = siteIconRows(c, 2);
  return root(
    c,
    `<tr><td height="${parseInt(
      edgeH,
      10
    )}" bgcolor="${edge}" style="height:${edgeH};font-size:0;line-height:0;background:${edge};background-image:linear-gradient(90deg,${edge},${c.soft(
      0.8,
      edge
    )});border-radius:10px 10px 0 0">&nbsp;</td></tr>
     <tr><td style="background:${c.bg(
       "#ffffff"
     )};border:${c.bd()};border-top:0;border-radius:0 0 10px 10px;padding:20px 24px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
          <td valign="top" style="padding:0 20px 0 0">${avatar(c, 80)}</td>
          <td valign="top">
            ${nameEl(c, 22)}
            <div style="font-size:12px;font-weight:600;letter-spacing:1.4px;text-transform:uppercase;color:${
              c.muted
            };margin:4px 0 12px">${c.position}</div>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
              <td valign="top" style="padding-right:26px">${left}</td>
              ${
                sites
                  ? `<td valign="top"><table role="presentation" cellpadding="0" cellspacing="0" border="0">${sites}</table></td>`
                  : ""
              }
            </tr></table>
            ${social ? `<div style="margin-top:8px">${social}</div>` : ""}
          </td>
        </tr></table>
     </td></tr>`
  );
};

export const generatePillHeaderTemplate = (data: SignatureFormData): string => {
  const c = ctx(data);
  const social = socialBadges(c, 14, c.soft(0.9), 6);
  return root(
    c,
    `<tr><td style="background:${c.bg("#ffffff")};border:${c.bd(
      c.soft(0.8)
    )};border-radius:14px;padding:20px 24px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
          <td valign="middle" style="padding:0 18px 0 0">${avatar(
            c,
            76,
            `3px solid ${c.soft(0.85)}`
          )}</td>
          <td valign="middle">
            ${nameEl(c, 22)}
            <div style="margin-top:7px"><span style="display:inline-block;background:${
              c.accent
            };color:${
      c.onAccent
    };border-radius:20px;padding:3px 12px;font-size:10.5px;font-weight:700;letter-spacing:1.3px;text-transform:uppercase">${
      c.position
    }</span></div>
          </td>
        </tr></table>
        ${rule(c.dc(c.soft(0.8)), c.dw("1px"), "16px 0 12px")}
        ${iconRows(c, 2)}
        ${social ? `<div style="margin-top:8px">${social}</div>` : ""}
     </td></tr>`
  );
};

export const generateMidnightSplitTemplate = (data: SignatureFormData): string => {
  // Left panel is the (default dark) identity surface; the right panel keeps its own light surface.
  const left = ctx(data, { bg: "#0f172a" });
  const right = ctx({ ...data, backgroundColor: "" });
  const social = socialIcons(right, 18, 10, 6);
  const position = isHex(data.mutedColor) ? left.muted : left.accent;
  return root(
    left,
    `<tr>
      <td valign="middle" align="center" style="background:${left.bg(
        "#0f172a"
      )};border-radius:14px 0 0 14px;padding:22px 24px;width:150px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center"><tr><td>${avatar(
          left,
          80,
          `2px solid ${left.accent}`
        )}</td></tr></table>
        <div style="font-size:17px;line-height:1.25;font-weight:${left.weight};color:${
      left.nameColor
    };margin-top:12px;text-align:center">${left.name}</div>
        <div style="font-size:10.5px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${position};margin-top:5px;text-align:center">${
      left.position
    }</div>
      </td>
      <td valign="middle" style="background:#ffffff;border:${right.bd()};border-left:0;border-radius:0 14px 14px 0;padding:20px 26px">
        ${iconRows(right, 2)}
        ${
          social
            ? `<div style="margin-top:8px;padding-top:12px;border-top:${right.dw(
                "1px"
              )} solid ${right.dc(right.lineDef)}">${social}</div>`
            : ""
        }
      </td>
    </tr>`
  );
};

export const generateDuoToneTemplate = (data: SignatureFormData): string => {
  const c = ctx(data);
  const social = socialIcons(c, 18, 10, 6);
  const base = `${c.dw("3px")} solid ${c.dc(c.accent)}`;
  return root(
    c,
    `<tr>
      <td valign="middle" style="background:${c.bg(
        c.soft(0.93)
      )};border-bottom:${base};border-radius:12px 0 0 12px;padding:22px 26px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td>${avatar(
          c,
          60
        )}</td></tr></table>
        <div style="margin-top:12px">${nameEl(c, 20)}</div>
        <div style="font-size:12px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:${
          c.muted
        };margin-top:4px">${c.position}</div>
      </td>
      <td valign="middle" style="background:${c.bg("#ffffff")};border:${c.bd(
      c.soft(0.85)
    )};border-left:0;border-bottom:${base};border-radius:0 12px 12px 0;padding:22px 26px">
        ${labelRows(c, 2)}
        ${social ? `<div style="margin-top:10px">${social}</div>` : ""}
      </td>
    </tr>`
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
    `<tr><td style="background:${c.bg("#ffffff")};border:${c.bd()};border-left:4px solid ${
      c.accent
    };border-radius:6px;padding:16px 22px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
          <td valign="middle">${companyMark(c, c.nameColor, 34)}</td>
        </tr></table>
        ${rule(c.dc(c.lineDef), c.dw("1px"), "12px 0 14px")}
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
  const sites = c.siteLs.slice(0, 2).join(dot(c.lineDef));
  const social = socialIcons(c, 17, 9, 6);
  const edge = c.bd(c.soft(0.75));
  return root(
    c,
    `<tr><td style="background:${
      c.accent
    };border-radius:10px 10px 0 0;padding:14px 22px">${companyMark(c, c.onAccent, 34)}</td></tr>
      <tr><td style="background:${c.bg(
        "#ffffff"
      )};border-left:${edge};border-right:${edge};padding:18px 22px">
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
      <tr><td style="background:${c.bg(
        c.soft(0.94)
      )};border:${edge};border-top:0;border-radius:0 0 10px 10px;padding:10px 22px">
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
  return frame(
    c,
    root(
      c,
      `<tr>
      <td valign="middle" align="left" style="padding:4px 24px 4px 0;border-right:${c.dw(
        "1px"
      )} solid ${c.dc(c.lineDef)};min-width:130px">
        ${companyMark(c, c.nameColor, 40)}
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
    )
  );
};

export const generateCorporateExecutiveTemplate = (data: SignatureFormData): string => {
  const c = ctx(data);
  const social = socialBadges(c, 14, "#ffffff", 6);
  const sites = c.siteLs.slice(0, 2).join(dot(c.lineDef));
  return root(
    c,
    `<tr><td style="background:${c.bg(
      "#ffffff"
    )};border:${c.bd()};border-bottom:0;border-radius:10px 10px 0 0;padding:20px 24px 16px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
          <td valign="top" style="padding:0 20px 0 0">${avatar(c, 76)}</td>
          <td valign="top">
            ${nameEl(c, 21)}
            <div style="font-size:11.5px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${
              c.muted
            };margin:3px 0 0">${c.position}</div>
            ${rule(c.dc(c.lineDef), c.dw("1px"), "11px 0")}
            <div style="font-size:12.5px;line-height:1.7">${c.phoneL}${dot(c.lineDef)}${
      c.emailL
    }</div>
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

export const generateCorporateStackedTemplate = (data: SignatureFormData): string => {
  const c = ctx(data);
  const sites = c.siteLs.slice(0, 2).join(dot(c.lineDef));
  const social = socialIcons(c, 17, 8, 6);
  const center = (html: string) =>
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center"><tr><td>${html}</td></tr></table>`;
  const barColor = c.dc(c.lineDef);
  const barH = c.dw("2px");
  return root(
    c,
    `<tr><td align="center" style="background:${c.bg(
      "#ffffff"
    )};border:${c.bd()};border-top:4px solid ${
      c.accent
    };border-radius:8px;padding:22px 32px;text-align:center">
        ${center(companyMark(c, c.nameColor, 38))}
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:14px auto"><tr><td width="40" height="${parseInt(
          barH,
          10
        )}" bgcolor="${barColor}" style="width:40px;height:${barH};background:${barColor};font-size:0;line-height:0">&nbsp;</td></tr></table>
        ${c.img ? `<div style="margin-bottom:10px">${center(avatar(c, 64))}</div>` : ""}
        ${nameEl(c, 19)}
        <div style="font-size:11.5px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${
          c.muted
        };margin:3px 0 10px">${c.position}</div>
        <div style="font-size:12.5px">${c.phoneL}${dot(c.lineDef)}${c.emailL}</div>
        ${sites ? `<div style="font-size:12.5px;margin-top:2px">${sites}</div>` : ""}
        ${social ? `<div style="margin-top:12px">${center(social)}</div>` : ""}
     </td></tr>`,
    "text-align:center;"
  );
};

export const generateCorporateCardTemplate = (data: SignatureFormData): string => {
  const c = ctx(data);
  const social = socialIcons(c, 17, 9, 6);
  const sites = siteIconRows(c, 2);
  return root(
    c,
    `<tr><td style="background:${c.bg(
      "#ffffff"
    )};border:${c.bd()};border-bottom:0;border-radius:10px 10px 0 0;padding:20px 24px 16px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
          <td valign="middle" style="padding-right:18px">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
              <td valign="middle" style="padding:0 14px 0 0">${avatar(c, 62)}</td>
              <td valign="middle">${nameEl(c, 19)}<div style="font-size:12.5px;color:${
      c.muted
    };margin-top:3px">${c.position}</div></td>
            </tr></table>
          </td>
          <td valign="middle" align="right">${companyMark(c, c.nameColor, 34)}</td>
        </tr></table>
        ${rule(c.dc(c.accent), c.dw("2px"), "14px 0 12px")}
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
          <td valign="top" style="padding-right:28px"><table role="presentation" cellpadding="0" cellspacing="0" border="0">${iconRow(
            c,
            ICONS.phone,
            c.phoneL
          )}${iconRow(c, ICONS.mail, c.emailL)}</table></td>
          ${
            sites
              ? `<td valign="top"><table role="presentation" cellpadding="0" cellspacing="0" border="0">${sites}</table></td>`
              : ""
          }
        </tr></table>
      </td></tr>
      <tr><td style="background:${c.bg(c.soft(0.94))};border:${c.bd(
      c.soft(0.8)
    )};border-radius:0 0 10px 10px;padding:10px 24px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
          <td valign="middle" style="font-size:11px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:${
            c.muted
          }">${c.company || "Company Name"}</td>
          <td valign="middle" align="right">${social}</td>
        </tr></table>
      </td></tr>`
  );
};
