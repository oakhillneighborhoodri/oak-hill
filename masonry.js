let masonryGrids = document.querySelectorAll('[data-masonry]');

function layoutMasonry() {
	for (let grid of masonryGrids) {
		let gap = parseFloat(window.getComputedStyle(grid).columnGap);
		for (let item of grid.children) {
			item.style.gridRowEnd = `span ${Math.ceil(item.getBoundingClientRect().height + gap)}`;
		}
	}
}

let masonryObserver = new ResizeObserver(() => {layoutMasonry()});
function initMasonry() {
	for (let grid of masonryGrids) {
		for (let item of grid.children) {
			masonryObserver.observe(item);
		}
	}
}
initMasonry();
