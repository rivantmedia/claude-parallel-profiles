const LAYERS = 5;

/**
 * Progressive blur at a viewport edge: stacked backdrop-blur layers, each
 * masked to a band and twice as strong as the last, so the blur builds toward
 * the edge instead of stopping at a hard line. Fixed and pointer-events-none;
 * styled by `.progressive-blur` in globals.css.
 */
export function ProgressiveBlur({ side }: { side: "top" | "bottom" }) {
	// Masks run from the inner boundary (0%) out to the screen edge (100%).
	const toward = side === "top" ? "to top" : "to bottom";
	const step = 100 / (LAYERS + 1);

	return (
		<div
			aria-hidden="true"
			data-side={side}
			className="progressive-blur"
		>
			{Array.from({ length: LAYERS }, (_, layer) => {
				const start = layer * step;
				const full = (layer + 1) * step;
				const last = layer === LAYERS - 1;
				// Each band fades back out so layers don't pile up; the strongest
				// one holds all the way to the edge.
				const hold = last ? 100 : (layer + 2) * step;
				const end = last ? 100 : Math.min(100, (layer + 3) * step);
				return (
					<span
						key={layer}
						style={
							{
								"--b": `${0.75 * 2 ** layer}px`,
								"--mask": `linear-gradient(${toward}, transparent ${start}%, #000 ${full}%, #000 ${hold}%, transparent ${end}%)`
							} as React.CSSProperties
						}
					/>
				);
			})}
		</div>
	);
}
