// Drag Region Support for custom titlebars
// Detects elements with CSS app-region: drag or .electrobun-webkit-app-region-drag class

import "./globals.d.ts";
import { send } from "./internalRpc";

function isAppRegionDrag(e: MouseEvent): boolean {
	const target = e.target as HTMLElement;
	if (!target || !target.closest) return false;

	// If the target is inside a no-drag region, it should not trigger window move
  if (
    target.closest(".electrobun-webkit-app-region-no-drag") ||
    target.closest('[style*="app-region"][style*="no-drag"]')
  ) {
    return false;
	}

	// Check for inline style with app-region: drag
	const draggableByStyle = target.closest(
		'[style*="app-region"][style*="drag"]',
	);
	// Check for class-based drag region
	const draggableByClass = target.closest(".electrobun-webkit-app-region-drag");

	return !!(draggableByStyle || draggableByClass);
}

function injectDragRegionStyles() {
	const css =
		".electrobun-webkit-app-region-drag{app-region:drag;-webkit-app-region:drag;}" +
		".electrobun-webkit-app-region-no-drag{app-region:no-drag;-webkit-app-region:no-drag;}";
	const apply = () => {
		if (document.getElementById("electrobun-drag-region-styles")) return;
		const style = document.createElement("style");
		style.id = "electrobun-drag-region-styles";
		style.textContent = css;
		(document.head || document.documentElement).appendChild(style);
	};
	if (document.head || document.documentElement) {
		apply();
	} else {
		document.addEventListener("DOMContentLoaded", apply, { once: true });
	}
}

export function initDragRegions() {
	injectDragRegionStyles();

	document.addEventListener("mousedown", (e) => {
		if (isAppRegionDrag(e)) {
			send("startWindowMove", { id: window.__electrobunWindowId });
		}
	});

	document.addEventListener("mouseup", (e) => {
		if (isAppRegionDrag(e)) {
			send("stopWindowMove", { id: window.__electrobunWindowId });
		}
	});
}
