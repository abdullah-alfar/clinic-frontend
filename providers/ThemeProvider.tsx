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
    // e.g. demo.localhost or demo.clinic.com
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
        // Apply default theme on failure
        applyDefaultTheme();
      })
      .finally(() => setIsLoading(false));
  }, []);

  return <ThemeContext.Provider value={{ tenant, isLoading }}>{children}</ThemeContext.Provider>;
}

function applyTheme(t: Tenant) {
  const root = document.documentElement;
  
  if (t.primary_color) {
    const { h, s, l } = hexToHsl(t.primary_color);
    root.style.setProperty('--primary', `hsl(${h} ${s}% ${l}%)`);
    // Ensure primary-foreground is legible
    root.style.setProperty('--primary-foreground', l > 65 ? 'hsl(222.2 47.4% 11.2%)' : 'hsl(0 0% 100%)');
    root.style.setProperty('--ring', `hsl(${h} ${s}% ${l}%)`);
  }

  if (t.secondary_color) {
    const { h, s, l } = hexToHsl(t.secondary_color);
    root.style.setProperty('--secondary', `hsl(${h} ${s}% ${l}%)`);
    root.style.setProperty('--secondary-foreground', l > 65 ? 'hsl(222.2 47.4% 11.2%)' : 'hsl(0 0% 100%)');
  }

  if (t.border_radius) {
    root.style.setProperty('--radius', t.border_radius);
  }

  if (t.font_family) {
    root.style.setProperty('--font-sans', `"${t.font_family}", system-ui, sans-serif`);
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(t.font_family)}:wght@400;500;600;700&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
}

function applyDefaultTheme() {
  // Let globals.css handle defaults
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
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
