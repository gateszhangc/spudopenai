const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const brandDir = path.join(__dirname, "..", "assets", "brand");

fs.mkdirSync(brandDir, { recursive: true });

const markPath = "M172 132C220 120 312 124 344 194C359 226 355 267 336 290C313 319 272 327 239 339C198 354 168 381 166 427M340 124C292 136 210 161 191 222C180 258 193 295 221 317C252 341 295 338 331 349C376 362 408 391 414 431";

const symbol = `
  <path d="${markPath}" fill="none" stroke="#111111" stroke-width="58" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="169" cy="129" r="25" fill="#111111"/>
  <circle cx="342" cy="125" r="25" fill="#111111"/>
  <circle cx="166" cy="429" r="25" fill="#111111"/>
  <circle cx="414" cy="431" r="25" fill="#111111"/>
`;

const logoMarkSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-labelledby="title desc">
  <title id="title">Spud OpenAI logo mark</title>
  <desc id="desc">A minimal monochrome symbol with two flowing branches and four nodes.</desc>
  <rect width="512" height="512" rx="116" fill="#f6f2e8"/>
  <rect x="26" y="26" width="460" height="460" rx="102" fill="none" stroke="rgba(17,17,17,0.08)" stroke-width="2"/>
  ${symbol}
</svg>
`;

const faviconSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="Spud OpenAI favicon">
  <rect width="512" height="512" rx="116" fill="#111111"/>
  <g transform="translate(0 0)">
    <path d="${markPath}" fill="none" stroke="#f6f2e8" stroke-width="58" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="169" cy="129" r="25" fill="#f6f2e8"/>
    <circle cx="342" cy="125" r="25" fill="#f6f2e8"/>
    <circle cx="166" cy="429" r="25" fill="#f6f2e8"/>
    <circle cx="414" cy="431" r="25" fill="#f6f2e8"/>
  </g>
</svg>
`;

const socialCardSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-labelledby="title desc">
  <title id="title">Spud OpenAI social card</title>
  <desc id="desc">Official site social card for Spud OpenAI.</desc>
  <rect width="1600" height="900" fill="#f5f1e8"/>
  <g opacity="0.5">
    <path d="M0 128H1600" stroke="#141414" stroke-opacity="0.08"/>
    <path d="M0 772H1600" stroke="#141414" stroke-opacity="0.08"/>
    <path d="M120 0V900" stroke="#141414" stroke-opacity="0.08"/>
    <path d="M1480 0V900" stroke="#141414" stroke-opacity="0.08"/>
  </g>
  <g transform="translate(1010 170)">
    <rect width="420" height="420" rx="88" fill="#111111"/>
    <g transform="translate(-2 -2)">
      <path d="${markPath}" fill="none" stroke="#f6f2e8" stroke-width="58" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="169" cy="129" r="25" fill="#f6f2e8"/>
      <circle cx="342" cy="125" r="25" fill="#f6f2e8"/>
      <circle cx="166" cy="429" r="25" fill="#f6f2e8"/>
      <circle cx="414" cy="431" r="25" fill="#f6f2e8"/>
    </g>
  </g>
  <text x="120" y="215" fill="#5c5b56" font-size="28" font-family="Avenir Next, Segoe UI, sans-serif" letter-spacing="6">OFFICIAL SITE</text>
  <text x="120" y="370" fill="#111111" font-size="128" font-family="Avenir Next, Segoe UI, sans-serif" font-weight="600">Spud OpenAI</text>
  <text x="120" y="488" fill="#5c5b56" font-size="42" font-family="Avenir Next, Segoe UI, sans-serif">One calm surface for prompts, evals, and shipping model-aware work.</text>
  <rect x="120" y="612" width="328" height="68" rx="34" fill="#111111"/>
  <text x="169" y="655" fill="#f6f2e8" font-size="30" font-family="Avenir Next, Segoe UI, sans-serif">spudopenai.lol</text>
</svg>
`;

const files = [
  ["logo-mark.svg", logoMarkSvg],
  ["favicon.svg", faviconSvg],
  ["social-card.svg", socialCardSvg]
];

for (const [name, content] of files) {
  fs.writeFileSync(path.join(brandDir, name), content);
}

const rasterize = (input, output, size) => {
  execFileSync("magick", [input, "-resize", size, output], { stdio: "inherit" });
};

rasterize(path.join(brandDir, "favicon.svg"), path.join(brandDir, "favicon.png"), "512x512");
rasterize(path.join(brandDir, "favicon.svg"), path.join(brandDir, "apple-touch-icon.png"), "180x180");
rasterize(path.join(brandDir, "logo-mark.svg"), path.join(brandDir, "logo-mark.png"), "512x512");
rasterize(path.join(brandDir, "social-card.svg"), path.join(brandDir, "social-card.png"), "1600x900");

