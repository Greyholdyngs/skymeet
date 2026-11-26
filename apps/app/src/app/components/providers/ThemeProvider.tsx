"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { getUserProfile } from "@/app/lib/user/user-service";
import type { UserPreferences } from "@/app/types/user";

type Appearance = UserPreferences["appearance"];

interface ThemeContextValue {
    appearance: Appearance;
    setAppearance: (appearance: Appearance) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
    children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [appearance, setAppearanceState] = useState<Appearance>("dark");

    const applyTheme = useCallback((value: Appearance) => {
        const resolvedTheme = value === "system" ? window.matchMedia("(prefers-color-scheme: light)").matches
                                                ? "light" : "dark" : value;

        document.documentElement.dataset.theme = resolvedTheme;
    }, []);

    const setAppearance = useCallback((value: Appearance) => {
        setAppearanceState(value);
        applyTheme(value);
    }, [applyTheme]);

    useEffect(() => {
        let active = true;

        const loadAppearance = async () => {
            try {
                const profile = await getUserProfile();

                if (active) {
                    setAppearance(profile.preferences.appearance);
                }
            } catch {
                if (active) {
                    applyTheme("dark");
                }
            }
        };

        void loadAppearance();

        return () => {
            active = false;
        };
    }, [applyTheme, setAppearance]);

    useEffect(() => {
        if (appearance !== "system") return;

        const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");

        const handleChange = () => applyTheme("system");

        mediaQuery.addEventListener("change", handleChange);

        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [appearance, applyTheme]);

    return (
        <ThemeContext.Provider value={{ appearance, setAppearance }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider");
    }

    return context;
}