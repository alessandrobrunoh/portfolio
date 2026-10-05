/** The official ab. logo family (public/logos) plus the light previews the site shows for each. */
export interface BrandAsset {
  id: string;
  name: string;
  file: string;
  preview: string;
  /** Background the asset is designed for. */
  surface: "dark" | "light";
  use: { en: string; it: string };
}

export const BRAND_ASSETS: BrandAsset[] = [
  {
    id: "monogram-metallic",
    name: "Monogram — Metallic",
    file: "/logos/ab-monogram-metallic.svg",
    preview: "/brand/ab-monogram-metallic.webp",
    surface: "dark",
    use: { en: "Primary mark. Hero, avatars, navigation.", it: "Marchio principale. Hero, avatar, navigazione." },
  },
  {
    id: "logo-metallic-full",
    name: "Logo — Metallic",
    file: "/logos/ab-logo-metallic-full.svg",
    preview: "/brand/ab-logo-metallic-full.webp",
    surface: "dark",
    use: { en: "Formal identity. Covers, title slides, brand pages.", it: "Identità formale. Copertine, slide, pagine brand." },
  },
  {
    id: "monogram-white",
    name: "Monogram — White",
    file: "/logos/ab-monogram-white.svg",
    preview: "/brand/ab-monogram-white.webp",
    surface: "dark",
    use: { en: "Flat mark for dark UI, video and overlays.", it: "Marchio piatto per UI scure, video e overlay." },
  },
  {
    id: "logo-white-full",
    name: "Logo — White",
    file: "/logos/ab-logo-white-full.svg",
    preview: "/brand/ab-logo-white-full.webp",
    surface: "dark",
    use: { en: "Dark footers, presentations, banners.", it: "Footer scuri, presentazioni, banner." },
  },
  {
    id: "monogram-black",
    name: "Monogram — Black",
    file: "/logos/ab-monogram-black.svg",
    preview: "/brand/ab-monogram-black.webp",
    surface: "light",
    use: { en: "Light backgrounds, print, favicon, watermarks.", it: "Sfondi chiari, stampa, favicon, filigrane." },
  },
  {
    id: "logo-black-full",
    name: "Logo — Black",
    file: "/logos/ab-logo-black-full.svg",
    preview: "/brand/ab-logo-black-full.webp",
    surface: "light",
    use: { en: "CV, PDFs, letterheads, documents.", it: "CV, PDF, carta intestata, documenti." },
  },
];

export const LOGO_SVG = "/logos/ab-monogram-metallic.svg";
export const WORDMARK_SVG = "/logos/ab-logo-metallic-full.svg";

/**
 * Copies an SVG file's markup to the clipboard. The fetch happens inside a ClipboardItem promise
 * so the user activation from the click is still valid when the text arrives (Safari needs this).
 */
export async function copySvg(url: string): Promise<void> {
  const text = fetch(url).then((response) => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.text();
  });
  if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
    const blob = text.then((svg) => new Blob([svg], { type: "text/plain" }));
    await navigator.clipboard.write([new ClipboardItem({ "text/plain": blob })]);
    return;
  }
  await navigator.clipboard.writeText(await text);
}

export async function copyText(value: string): Promise<void> {
  await navigator.clipboard.writeText(value);
}
