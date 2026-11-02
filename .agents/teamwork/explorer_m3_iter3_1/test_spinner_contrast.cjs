const { oklchToRgb, relativeLuminance, contrastRatio, blend } = (() => {
  function oklchToRgb(L, C, H_deg, alpha = 1) {
    const H_rad = (H_deg * Math.PI) / 180;
    const a = C * Math.cos(H_rad);
    const b = C * Math.sin(H_rad);

    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

    const l = l_ * l_ * l_;
    const m = m_ * m_ * m_;
    const s = s_ * s_ * s_;

    const r_lin = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    const g_lin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    const b_lin = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

    const clamp01 = (v) => Math.max(0, Math.min(1, v));
    const r_lin_c = clamp01(r_lin);
    const g_lin_c = clamp01(g_lin);
    const b_lin_c = clamp01(b_lin);

    const gamma = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);

    return {
      rLin: r_lin_c,
      gLin: g_lin_c,
      bLin: b_lin_c,
      r: Math.round(clamp01(gamma(r_lin_c)) * 255),
      g: Math.round(clamp01(gamma(g_lin_c)) * 255),
      b: Math.round(clamp01(gamma(b_lin_c)) * 255),
      a: alpha
    };
  }

  function relativeLuminance(rgb) {
    return 0.2126 * rgb.rLin + 0.7152 * rgb.gLin + 0.0722 * rgb.bLin;
  }

  function contrastRatio(rgb1, rgb2) {
    const lum1 = relativeLuminance(rgb1);
    const lum2 = relativeLuminance(rgb2);
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  function blend(fg, bg, alpha) {
    const rLin = fg.rLin * alpha + bg.rLin * (1 - alpha);
    const gLin = fg.gLin * alpha + bg.gLin * (1 - alpha);
    const bLin = fg.bLin * alpha + bg.bLin * (1 - alpha);
    return {
      rLin,
      gLin,
      bLin,
      r: Math.round(rLin * 255),
      g: Math.round(gLin * 255),
      b: Math.round(bLin * 255),
      a: 1
    };
  }

  return { oklchToRgb, relativeLuminance, contrastRatio, blend };
})();

// Light tokens from index.css
const light = {
  card: oklchToRgb(1, 0, 0),
  border: oklchToRgb(0.922, 0, 0),
  primary: oklchToRgb(0.527, 0.154, 150.069),
  success: oklchToRgb(0.627, 0.194, 149.214),
  brand: oklchToRgb(0.627, 0.194, 149.214),
  sidebarPrimary: oklchToRgb(0.627, 0.194, 149.214)
};

// Dark tokens from index.css
const darkCard = oklchToRgb(0.205, 0, 0);
const dark = {
  card: darkCard,
  border: blend(oklchToRgb(1, 0, 0), darkCard, 0.10), // oklch(1 0 0 / 10%) on card
  primary: oklchToRgb(0.448, 0.119, 151.328),
  success: oklchToRgb(0.69, 0.17, 150),
  brand: oklchToRgb(0.65, 0.18, 149.2),
  sidebarPrimary: oklchToRgb(0.723, 0.219, 149.579)
};

console.log('--- RELATIVE LUMINANCE ---');
console.log('Light Card:', relativeLuminance(light.card).toFixed(5));
console.log('Light Border:', relativeLuminance(light.border).toFixed(5));
console.log('Light Primary:', relativeLuminance(light.primary).toFixed(5));
console.log('Light Success:', relativeLuminance(light.success).toFixed(5));
console.log('Light Brand:', relativeLuminance(light.brand).toFixed(5));

console.log('\nDark Card:', relativeLuminance(dark.card).toFixed(5));
console.log('Dark Border:', relativeLuminance(dark.border).toFixed(5));
console.log('Dark Primary:', relativeLuminance(dark.primary).toFixed(5));
console.log('Dark Success:', relativeLuminance(dark.success).toFixed(5));
console.log('Dark Brand:', relativeLuminance(dark.brand).toFixed(5));
console.log('Dark SidebarPrimary:', relativeLuminance(dark.sidebarPrimary).toFixed(5));

console.log('\n--- CONTRAST RATIOS AGAINST CARD ---');
console.log('Light Mode:');
console.log('  primary vs card:', contrastRatio(light.primary, light.card).toFixed(2) + ':1');
console.log('  success vs card:', contrastRatio(light.success, light.card).toFixed(2) + ':1');
console.log('  brand vs card:', contrastRatio(light.brand, light.card).toFixed(2) + ':1');

console.log('Dark Mode:');
console.log('  primary vs card:', contrastRatio(dark.primary, dark.card).toFixed(2) + ':1');
console.log('  success vs card:', contrastRatio(dark.success, dark.card).toFixed(2) + ':1');
console.log('  brand vs card:', contrastRatio(dark.brand, dark.card).toFixed(2) + ':1');
console.log('  sidebarPrimary vs card:', contrastRatio(dark.sidebarPrimary, dark.card).toFixed(2) + ':1');

console.log('\n--- CONTRAST RATIOS AGAINST CIRCULAR TRACK (BORDER) ---');
console.log('Light Mode:');
console.log('  primary vs border:', contrastRatio(light.primary, light.border).toFixed(2) + ':1');
console.log('  success vs border:', contrastRatio(light.success, light.border).toFixed(2) + ':1');
console.log('  brand vs border:', contrastRatio(light.brand, light.border).toFixed(2) + ':1');

console.log('Dark Mode:');
console.log('  primary vs border:', contrastRatio(dark.primary, dark.border).toFixed(2) + ':1');
console.log('  success vs border:', contrastRatio(dark.success, dark.border).toFixed(2) + ':1');
console.log('  brand vs border:', contrastRatio(dark.brand, dark.border).toFixed(2) + ':1');
console.log('  sidebarPrimary vs border:', contrastRatio(dark.sidebarPrimary, dark.border).toFixed(2) + ':1');
