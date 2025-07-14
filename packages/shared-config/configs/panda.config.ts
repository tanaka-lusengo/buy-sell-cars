import { defineConfig } from "@pandacss/dev";

interface CreatePandaConfigOptions {
    outdir?: string;
    include?: string[];
}

export function createPandaConfig(options: CreatePandaConfigOptions = {}) {
    const {
        outdir = "styled-system",
        include = [
            "./src/app/**/*.{js,jsx,ts,tsx}",
            "./src/components/**/*.{js,jsx,ts,tsx}",
            "./src/styles/**/*.{js,jsx,ts,tsx}",
            "../../packages/shared/ui/**/*.{js,jsx,ts,tsx}",
            "../../packages/shared/components/**/*.{js,jsx,ts,tsx}",
            "../../packages/shared/styles/**/*.{js,jsx,ts,tsx}",
        ],
    } = options;

    // Import styles dynamically to avoid build-time resolution issues
    const {
        globalCss,
        tokens,
        textStyles,
        breakpoints,
    } = require("~bsc-shared/styles");

    return defineConfig({
        preflight: true,
        include,
        exclude: [],
        globalCss,
        theme: {
            extend: {
                tokens,
                textStyles,
                breakpoints,
            },
        },
        presets: ["@pandacss/preset-base"],
        jsxFramework: "react",
        outdir,
    });
}
