'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { Tenant } from '@/types';

interface ThemeContextValue {
  tenant: Tenant | null;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({ tenant: null, isLoading: true });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const host = window.location.hostname;
    const parts = host.split('.');
    const subdomain = parts.length > 1 && parts[0] !== 'localhost' ? parts[0] : 'demo';

    const api = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';
    fetch(`${api}/tenants/config?subdomain=${subdomain}`)
      .then((r) => r.json())
      .then((resp) => {
        const t: Tenant = resp?.data ?? resp;
        setTenant(t);
        applyTheme(t);
      })
      .catch(() => {
        // Default theme is handled by globals.css — no action required
      })
      .finally(() => setIsLoading(false));
  }, []);

  return <ThemeContext.Provider value={{ tenant, isLoading }}>{children}</ThemeContext.Provider>;
}

/**
 * Injects a <style id="tenant-theme"> block that overrides CSS variables
 * for both :root (light) and .dark modes.
 *
 * Variables must be raw HSL channels (e.g. "221 83% 53%") to be consistent
 * with globals.css which wraps them as hsl(var(--primary)) etc.
 */
function applyTheme(t: Tenant) {
  if (!t) return;

  let cssText = '';

  /**
   * Selection of foreground color based on WCAG luminance guidelines.
   * Returns a dark slate for light backgrounds and near-white for dark ones.
   */
  const getContrastForeground = (h: number, s: number, l: number) => {
    // For primary/accent colors, we want high contrast.
    // l > 65% is a good threshold for switching to dark text.
    return l > 65 ? '222.2 47.4% 11.2%' : '210 40% 98%';
  };

  /**
   * Safe dark-mode lightness: ensures primary colors stay vibrant but
   * have sufficient contrast against dark backgrounds.
   */
  const getDarkPrimaryLightness = (l: number) => {
    // Aim for 50-70% lightness in dark mode for better visibility.
    return Math.max(50, Math.min(l + 15, 75));
  };

  const hasBranding = t.primary_color || t.secondary_color || t.border_radius;

  if (hasBranding) {
    // Light mode overrides
    cssText += ':root {\n';
    if (t.primary_color) {
      const { h, s, l } = hexToHsl(t.primary_color);
      cssText += `  --primary: ${h} ${s}% ${l}%;\n`;
      cssText += `  --primary-foreground: ${getContrastForeground(h, s, l)};\n`;
      cssText += `  --ring: ${h} ${s}% ${l}%;\n`;
    }
    if (t.secondary_color) {
      const { h, s, l } = hexToHsl(t.secondary_color);
      cssText += `  --secondary: ${h} ${s}% ${l}%;\n`;
      cssText += `  --secondary-foreground: ${getContrastForeground(h, s, l)};\n`;
    }
    if (t.border_radius) {
      cssText += `  --radius: ${t.border_radius};\n`;
    }
    cssText += '}\n';

    // Dark mode overrides
    cssText += '.dark {\n';
    if (t.primary_color) {
      const { h, s, l } = hexToHsl(t.primary_color);
      const darkL = getDarkPrimaryLightness(l);
      cssText += `  --primary: ${h} ${s}% ${darkL}%;\n`;
      cssText += `  --primary-foreground: ${getContrastForeground(h, s, darkL)};\n`;
      cssText += `  --ring: ${h} ${s}% ${darkL}%;\n`;
    }
    if (t.secondary_color) {
      const { h, s, l } = hexToHsl(t.secondary_color);
      const darkL = Math.max(30, Math.min(l, 45)); // Secondary slightly deeper in dark mode
      cssText += `  --secondary: ${h} ${s}% ${darkL}%;\n`;
      cssText += `  --secondary-foreground: ${getContrastForeground(h, s, darkL)};\n`;
    }
    cssText += '}\n';
  }

  let styleEl = document.getElementById('tenant-theme');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'tenant-theme';
    document.head.appendChild(styleEl);
  }
  styleEl.innerHTML = cssText;

  // Font override
  if (t.font_family) {
    document.documentElement.style.setProperty(
      '--font-sans',
      `"${t.font_family}", system-ui, sans-serif`
    );
    const linkId = 'tenant-font';
    let link = document.getElementById(linkId) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(t.font_family)}:wght@400;500;600;700&display=swap`;
  }
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  if (!/^#([0-9A-Fa-f]{3}){1,2}$/.test(hex)) {
    return { h: 221, s: 83, l: 53 };
  }
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16) / 255;
    g = parseInt(hex[2] + hex[2], 16) / 255;
    b = parseInt(hex[3] + hex[3], 16) / 255;
  } else {
    r = parseInt(hex.slice(1, 3), 16) / 255;
    g = parseInt(hex.slice(3, 5), 16) / 255;
    b = parseInt(hex.slice(5, 7), 16) / 255;
  }
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export const useTheme = () => useContext(ThemeContext);
