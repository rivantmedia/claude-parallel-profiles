import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkSmartypants from "remark-smartypants";
import { Code, ExternalLabel } from "~/components/primitives";
import styles from "./ReleaseNotes.module.css";

/*
 * Each Markdown element mapped to the site's prose (see ReleaseNotes.module.css
 * for the rhythm between them). `node` is react-markdown's syntax tree node,
 * dropped so it never reaches the DOM.
 */
const components: Components = {
	// A release's own heading is the page's h2, so its sections ("Added",
	// "Changed", "Fixed") are h3: small tracked labels over a hairline.
	h1: ({ node: _node, children, ...props }) => (
		<h3
			className={styles.label}
			{...props}
		>
			<span>{children}</span>
		</h3>
	),
	h2: ({ node: _node, children, ...props }) => (
		<h3
			className={styles.label}
			{...props}
		>
			<span>{children}</span>
		</h3>
	),
	h3: ({ node: _node, children, ...props }) => (
		<h3
			className={styles.label}
			{...props}
		>
			<span>{children}</span>
		</h3>
	),
	h4: ({ node: _node, ...props }) => (
		<h4
			className={styles.minor}
			{...props}
		/>
	),
	a: ({ node: _node, href = "", children, ...props }) => {
		const external = /^https?:\/\//.test(href);
		return (
			<a
				href={href}
				{...(external
					? { target: "_blank", rel: "noopener noreferrer" }
					: {})}
				{...props}
			>
				{external ? (
					<ExternalLabel>{children}</ExternalLabel>
				) : (
					children
				)}
			</a>
		);
	},
	// Inline code is the site's graphite chip. A fenced block keeps its
	// language class and is styled by the <pre> around it.
	code: ({ node: _node, className, children }) =>
		className?.startsWith("language-") ? (
			<code className={className}>{children}</code>
		) : (
			<Code>{children}</Code>
		),
	table: ({ node: _node, ...props }) => (
		<div className={styles.table}>
			<table {...props} />
		</div>
	)
};

/**
 * A release's notes, rendered on the server from CHANGELOG.md's Markdown.
 * Straight quotes and apostrophes in the prose become typographic ones, as
 * everywhere else on the site; inline and fenced code keep theirs.
 */
export function ReleaseNotes({ markdown }: { markdown: string }) {
	return (
		<div className={styles.prose}>
			<Markdown
				remarkPlugins={[remarkGfm, remarkSmartypants]}
				components={components}
			>
				{markdown}
			</Markdown>
		</div>
	);
}
