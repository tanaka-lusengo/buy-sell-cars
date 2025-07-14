import path from "path";
import { defineConfig } from "vitest/config";

interface CreateVitestConfigOptions {
    projectRoot: string;
}

export function createVitestConfig(options: CreateVitestConfigOptions) {
    const { projectRoot } = options;

    return defineConfig({
        test: {
            environment: "jsdom",
            setupFiles: ["./src/test/setup.ts"],
            globals: true,
        },
        resolve: {
            alias: {
                "@": path.resolve(projectRoot, "."),
                "~bsc-shared": path.resolve(
                    projectRoot,
                    "../../packages/shared",
                ),
            },
        },
    });
}
