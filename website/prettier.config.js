/** Rivant Media house style (@rivantmedia/prettier-config) + Tailwind class sorting. */
/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
	printWidth: 80,
	tabWidth: 4,
	useTabs: true,
	semi: true,
	singleQuote: false,
	quoteProps: "consistent",
	jsxSingleQuote: false,
	trailingComma: "none",
	bracketSpacing: true,
	bracketSameLine: false,
	arrowParens: "always",
	proseWrap: "preserve",
	htmlWhitespaceSensitivity: "css",
	singleAttributePerLine: true,
	plugins: ["prettier-plugin-tailwindcss"],
	tailwindStylesheet: "./src/styles/globals.css"
};

export default config;
