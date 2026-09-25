/**
 * Marks an element [data-engaged] while a mouse is really moving over it.
 * Content slides under a resting pointer whenever the page scrolls, and the
 * browser reports that as hover (with pointer events of zero movement), so
 * hover styling keyed to :hover alone flickers on and off as things pass
 * under the pointer. Only real movement engages; leaving, or a wheel turn,
 * hands the element back to scrolling. Set straight on the element, so
 * pointer movement never re-renders anything. Spread onto a client
 * component's element: `<ol {...engageHandlers}>`.
 */
export const engageHandlers = {
	onPointerMove(event: React.PointerEvent<HTMLElement>) {
		if (event.pointerType !== "mouse") return;
		if (event.movementX !== 0 || event.movementY !== 0)
			event.currentTarget.dataset.engaged = "";
	},
	onPointerLeave(event: React.SyntheticEvent<HTMLElement>) {
		delete event.currentTarget.dataset.engaged;
	},
	onWheel(event: React.SyntheticEvent<HTMLElement>) {
		delete event.currentTarget.dataset.engaged;
	}
};
