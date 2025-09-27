import { defineConfig, globalIgnores } from "eslint/config";
import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import i18Next from "eslint-plugin-i18next";
import stylistic from "@stylistic/eslint-plugin";
import regexp from "eslint-plugin-regexp";
import reactHooksExtra from "eslint-plugin-react-hooks-extra";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([globalIgnores([
    "node_modules",
    ".pnp",
    "**/.pnp.js",
    "coverage",
    "build",
    "src/declarations/voxengine.d.ts",
    "**/.DS_Store",
    "**/.env.local",
    "**/.env.development.local",
    "**/.env.test.local",
    "**/.env.production.local",
    "**/npm-debug.log*",
    "**/yarn-debug.log*",
    "**/yarn-error.log*",
    "**/.idea",
    "**/.vscode",
]), {
    extends: fixupConfigRules(compat.extends(
        "react-app",
        "plugin:i18next/recommended",
        "plugin:@tanstack/eslint-plugin-query/recommended",
        "plugin:storybook/recommended",
        "plugin:regexp/recommended",
    )),

    plugins: {
        i18next: fixupPluginRules(i18Next),
        "@stylistic": stylistic,
        regexp: fixupPluginRules(regexp),
        "react-hooks-extra": reactHooksExtra,
        "@typescript-eslint": fixupPluginRules(tsPlugin),
    },

    languageOptions: {
        parser: tsParser,
    },

    rules: {
        "no-redeclare": 0,

        "line-comment-position": ["warn", {
            position: "above",
        }],

        "padding-line-between-statements": ["warn", {
            blankLine: "always",
            prev: "*",
            next: ["return", "if", "do", "while", "for", "switch", "try", "with"],
        }, {
            blankLine: "always",
            prev: ["if", "do", "while", "for", "switch", "try", "with"],
            next: "*",
        }, {
            blankLine: "any",
            prev: ["const", "let", "var"],
            next: ["if", "do", "while", "for", "switch", "try", "with"],
        }],

        "react/button-has-type": 1,

        "react/function-component-definition": [1, {
            namedComponents: "arrow-function",
        }],

        "i18next/no-literal-string": [1, {
            markupOnly: true,
            ignoreAttribute: ["aria-label"],
        }],

        "react-hooks-extra/no-direct-set-state-in-use-effect": "warn",

        "@typescript-eslint/no-unused-vars": [
            "error",
            {
                args: "all",
                argsIgnorePattern: "^_",
                caughtErrors: "all",
                caughtErrorsIgnorePattern: "^e",
                destructuredArrayIgnorePattern: "^_",
                varsIgnorePattern: "^_",
                ignoreRestSiblings: true
            }
        ]
    },
}]);
