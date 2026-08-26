const mapCenter = [41.8618, -71.3927];
const mapZoom = 15;
const mapFocusZoom = 17;
const mapBounds = [[41.8410, -71.4140], [41.8830, -71.3720]];
const mapMobile = 900;
const mapPopupOffset = [0, -44];

const mapActiveZ = 100000;

let neighborhoodMap;
let mapMarkers = {};
let mapZOrder = {};

// Leaflet recomputes every marker's z-index from its rounded pixel y on each
// frame of an animation. Pins that sit within a pixel of each other ~ the ones
// sharing an address ~ therefore keep swapping stacking order all the way
// through a flyTo. Ranking them once by latitude gives every tie the same
// answer on every frame, in the order Leaflet was reaching for anyway: further
// north sits behind, further south sits in front.
function initMapZOrder() {
	let ranked = mapBusinesses.slice().sort((a, b) => b.latitude - a.latitude);
	for (let rank = 0; rank < ranked.length; rank++) {
		mapZOrder[ranked[rank].index] = rank;
	}
}

function pinIcon(business) {
	return L.divIcon({
		className: `map-pin-${business.index}`,
		html: `<div class="map-pin" style="--primary: var(--${business.color});">
			<svg viewBox="0 0 76.63 95.52" class="map-pin-shape" preserveAspectRatio="none"><path d="M76.63,38.32c0,32.68-38.32,57.21-38.32,57.21,0,0-38.32-24.63-38.32-57.21C0,17.15,17.15,0,38.32,0s38.32,17.15,38.32,38.32Z"/></svg>
			<div class="map-pin-number">${business.index}</div>
		</div>`,
		iconSize: [30, 38],
		iconAnchor: [15, 38]
	});
}

function initMap() {
	neighborhoodMap = L.map('map-canvas', {closePopupOnClick: false, scrollWheelZoom: false, zoomControl: false}).setView(mapCenter, mapZoom);
	// openstreetmap's standard tiles: one hostname (no {s} subdomains), no retina
	// variant, and 19 is as far as they zoom. their usage policy asks for light
	// traffic and requires the attribution below to stay visible.
	L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
		minZoom: 13,
		maxZoom: 19
	}).addTo(neighborhoodMap);
	neighborhoodMap.attributionControl.setPosition('bottomleft');
	neighborhoodMap.setMaxBounds(mapBounds);

	initMapZOrder();
	for (let business of mapBusinesses) {
		let marker = L.marker([business.latitude, business.longitude], {
			icon: pinIcon(business),
			zIndexOffset: mapZOrder[business.index]
		}).addTo(neighborhoodMap);
		marker.on('mouseover', () => {highlightBusiness(business.index)});
		marker.on('click', () => {selectOnMap(business.index)});
		mapMarkers[business.index] = marker;
	}

	neighborhoodMap.on('dragstart', () => {neighborhoodMap.closePopup()});
	neighborhoodMap.on('click', () => {neighborhoodMap.closePopup()});
}

function zoomMap(step) {
	neighborhoodMap.setZoom(neighborhoodMap.getZoom() + step);
}

function clearMapHighlight() {
	for (let item of document.querySelectorAll('.map-index-item')) {
		item.dataset.active = 0;
	}
	for (let pin of document.querySelectorAll('.leaflet-marker-icon')) {
		pin.dataset.active = 0;
	}
	for (let index in mapMarkers) {
		mapMarkers[index].setZIndexOffset(mapZOrder[index]);
	}
}

function highlightBusiness(index) {
	clearMapHighlight();
	document.querySelector(`.map-index-item[data-index="${index}"]`).dataset.active = 1;
	document.querySelector(`.map-pin-${index}`).dataset.active = 1;
	// lift the highlighted pin clear of the rest, keeping its own rank as the
	// tie-break so it never fights with a neighbour either
	mapMarkers[index].setZIndexOffset(mapActiveZ + mapZOrder[index]);
}

function showOnMap(index) {
	if (window.innerWidth < mapMobile) {
		return;
	}
	highlightBusiness(index);
	let business = mapBusinesses[index - 1];
	neighborhoodMap.flyTo([business.latitude, business.longitude], mapFocusZoom);
}

function selectOnMap(index) {
	highlightBusiness(index);
	showMapPopup(index);
	if (window.innerWidth < mapMobile) {
		return;
	}
	document.querySelector(`.map-index-item[data-index="${index}"]`).scrollIntoView({
		behavior: 'smooth',
		block: 'start'
	});
}

function showMapPopup(index) {
	let business = mapBusinesses[index - 1];
	let description = !business.description ? '' : `<p class="map-popup-description">${business.description}</p>`;
	let links = [];
	if (business.phone) {
		links.push(`<a href="tel:${business.phone}">${business.phone}</a>`);
	}
	if (business.url) {
		links.push(`<a href="${business.url}" target="_blank">${business.url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '')}</a>`);
	}
	links = links.length == 0 ? '' : `<p class="map-popup-links">${links.join('')}</p>`;

	let popup = L.popup({offset: mapPopupOffset})
		.setLatLng([business.latitude, business.longitude])
		.setContent(`<div class="map-popup">
			<h3 class="map-popup-name">${business.name}</h3>
			<p class="map-popup-type">${business.typeName}</p>
			${description}
			${links}
		</div>`)
		.openOn(neighborhoodMap);
	popup.getElement().style.setProperty('--primary', `var(--${business.color})`);
}

// a listing highlights and flies the map when it is clicked. this used to fire
// on mouseenter, which yanked the map around constantly while scrolling the list.
function initMapIndex() {
	for (let item of document.querySelectorAll('.map-index-item')) {
		item.addEventListener('click', (e) => {
			// leave the address and contact links to do their own thing
			if (e.target.closest('a')) {
				return;
			}
			showOnMap(Number(item.dataset.index));
		});
	}
}

// leaflet focuses the map on click, which scrolls it into view
function initMapFocus() {
	let canvas = document.querySelector('.map-canvas');
	let focus = canvas.focus.bind(canvas);
	let fromPointer = false;
	canvas.addEventListener('pointerdown', () => {fromPointer = true});
	canvas.focus = (options) => {
		focus(fromPointer ? {preventScroll: true} : options);
		fromPointer = false;
	};
}

function initMapZoom() {
	document.querySelector('.map-canvas').addEventListener('wheel', (e) => {
		if (e.ctrlKey) {
			e.preventDefault();
		}
	}, {passive: false});
	window.addEventListener('keydown', (e) => {
		if (e.key == 'Control') {
			neighborhoodMap.scrollWheelZoom.enable();
		}
	});
	window.addEventListener('keyup', (e) => {
		if (e.key == 'Control') {
			neighborhoodMap.scrollWheelZoom.disable();
		}
	});
	window.addEventListener('blur', () => {
		neighborhoodMap.scrollWheelZoom.disable();
	});
}

initMap();
initMapIndex();
initMapFocus();
initMapZoom();
