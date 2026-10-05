/** The official soft-minimal logo family (public/brand) and how the site previews each file. */
export interface BrandAsset {
  id: string;
  name: string;
  file: string;
  /** What the preview shows: the mark, the mark with the wordmark under it, or the wordmark alone. */
  kind: "monogram" | "full" | "wordmark";
  /** Raster preview of the mark (full and monogram only). */
  preview?: string;
  /** Background the asset is designed for. */
  surface: "light" | "dark";
  /** Ink of the wordmark in the preview. */
  ink: "ink" | "white";
  use: { en: string; it: string };
}

export const BRAND_ASSETS: BrandAsset[] = [
  {
    id: "monogram",
    name: "Monogram",
    file: "/brand/ab-soft-minimal-monogram.svg",
    kind: "monogram",
    preview: "/brand/ab-monogram.webp",
    surface: "light",
    ink: "ink",
    use: { en: "Primary mark. Navbar, avatars, favicon, hero.", it: "Marchio principale. Navbar, avatar, favicon, hero." },
  },
  {
    id: "full",
    name: "Full logo",
    file: "/brand/ab-soft-minimal-full.svg",
    kind: "full",
    preview: "/brand/ab-monogram.webp",
    surface: "light",
    ink: "ink",
    use: { en: "Hero, brand page, case study covers, presentations.", it: "Hero, pagina brand, copertine, presentazioni." },
  },
  {
    id: "wordmark",
    name: "Wordmark",
    file: "/brand/ab-soft-minimal-wordmark.svg",
    kind: "wordmark",
    surface: "light",
    ink: "ink",
    use: { en: "Footer, email signature, narrow layouts.", it: "Footer, firma email, layout stretti." },
  },
  {
    id: "monogram-black",
    name: "Monogram — Black",
    file: "/brand/ab-soft-minimal-monogram-black.svg",
    kind: "monogram",
    preview: "/brand/ab-monogram-black.webp",
    surface: "light",
    ink: "ink",
    use: { en: "White backgrounds, print, CVs, documentation.", it: "Sfondi bianchi, stampa, CV, documentazione." },
  },
  {
    id: "full-black",
    name: "Full logo — Black",
    file: "/brand/ab-soft-minimal-full-black.svg",
    kind: "full",
    preview: "/brand/ab-monogram-black.webp",
    surface: "light",
    ink: "ink",
    use: { en: "Formal documents, résumés, PDF exports.", it: "Documenti formali, curriculum, PDF." },
  },
  {
    id: "wordmark-black",
    name: "Wordmark — Black",
    file: "/brand/ab-soft-minimal-wordmark-black.svg",
    kind: "wordmark",
    surface: "light",
    ink: "ink",
    use: { en: "A purely typographic signature.", it: "Una firma solo tipografica." },
  },
  {
    id: "monogram-white",
    name: "Monogram — White",
    file: "/brand/ab-soft-minimal-monogram-white.svg",
    kind: "monogram",
    preview: "/brand/ab-monogram-white.webp",
    surface: "dark",
    ink: "white",
    use: { en: "Dark backgrounds, overlays, video.", it: "Sfondi scuri, overlay, video." },
  },
  {
    id: "full-white",
    name: "Full logo — White",
    file: "/brand/ab-soft-minimal-full-white.svg",
    kind: "full",
    preview: "/brand/ab-monogram-white.webp",
    surface: "dark",
    ink: "white",
    use: { en: "Dark heroes, dark footers, banners.", it: "Hero scuri, footer scuri, banner." },
  },
  {
    id: "wordmark-white",
    name: "Wordmark — White",
    file: "/brand/ab-soft-minimal-wordmark-white.svg",
    kind: "wordmark",
    surface: "dark",
    ink: "white",
    use: { en: "Minimal dark layouts.", it: "Layout scuri minimali." },
  },
];

export const LOGO_SVG = "/brand/ab-soft-minimal-monogram-black.svg";
export const WORDMARK_SVG = "/brand/ab-soft-minimal-wordmark-black.svg";

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
