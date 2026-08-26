let filterRow = document.querySelectorAll('.directory-filters')[0];
let sortRow = document.querySelectorAll('.directory-filters')[1];
let list = document.querySelector('.directory-list');
let pinnedBusiness = list.querySelector('.directory-list-item[data-pinned]');
let businesses = [...list.querySelectorAll('.directory-list-item:not([data-pinned])')];

function businessName(item) {
	return item.querySelector('.directory-list-item-name').textContent.trim();
}

function shuffle(items) {
	let shuffled = items.slice();
	for (let i = shuffled.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

function filterDirectory(button) {
	for (let other of filterRow.querySelectorAll('button')) {
		other.dataset.active = other == button ? 1 : 0;
	}
	let service = button.textContent.trim();
	for (let item of businesses) {
		let services = item.dataset.services.split('|');
		item.dataset.hidden = service != 'All' && !services.includes(service) ? 1 : 0;
	}
	layoutMasonry();
}

function sortDirectory(button) {
	for (let other of sortRow.querySelectorAll('button')) {
		other.dataset.active = other == button ? 1 : 0;
	}
	let mode = button.textContent.trim();
	let sorted = businesses;
	if (mode == 'A to Z') {
		sorted = businesses.slice().sort((a, b) => businessName(a).localeCompare(businessName(b)));
	} else if (mode == 'Z to A') {
		sorted = businesses.slice().sort((a, b) => businessName(b).localeCompare(businessName(a)));
	} else {
		sorted = shuffle(businesses);
	}
	for (let item of sorted) {
		list.append(item);
	}
	// the "add your business" card stays first no matter how the list is sorted
	if (pinnedBusiness != null) {
		list.prepend(pinnedBusiness);
	}
	layoutMasonry();
}

function initDirectory() {
	for (let button of filterRow.querySelectorAll('button')) {
		button.addEventListener('click', () => {filterDirectory(button)});
	}
	for (let button of sortRow.querySelectorAll('button')) {
		button.addEventListener('click', () => {sortDirectory(button)});
	}
	sortDirectory(sortRow.querySelector('button'));
}
initDirectory();
