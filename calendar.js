const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

let eventsByDate = {};
for (let event of calendarEvents) {
	if (eventsByDate[event.date] == undefined) {
		eventsByDate[event.date] = [];
	}
	eventsByDate[event.date].push(event);
}

let today = new Date();
let viewYear = today.getFullYear();
let viewMonth = today.getMonth();

function formatDate(date) {
	let [year, month, day] = date.split('-').map(Number);
	let full = new Date(year, month - 1, day);
	return `${weekdays[full.getDay()]}, ${months[month - 1]} ${day}, ${year}`;
}

function renderCalendar() {
	let label = document.querySelector('.calendar-month');
	let grid = document.querySelector('.calendar-grid');
	label.innerHTML = `${months[viewMonth]} <span>${viewYear}</span>`;
	grid.innerHTML = '';

	let offset = new Date(viewYear, viewMonth, 1).getDay();
	let total = new Date(viewYear, viewMonth + 1, 0).getDate();
	for (let i = 0; i < offset; i++) {
		let cell = document.createElement('div');
		cell.dataset.active = 0;
		grid.append(cell);
	}
	for (let day = 1; day <= total; day++) {
		let cell = document.createElement('div');
		let number = document.createElement('div');
		number.classList.add('calendar-grid-number');
		number.innerText = day;
		cell.append(number);

		let date = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
		if (eventsByDate[date] != undefined) {
			for (let event of eventsByDate[date]) {
				let button = document.createElement('button');
				button.classList.add('calendar-grid-event');
				button.innerText = event.time ? `${event.name}, ${event.time}` : event.name;
				button.addEventListener('click', () => {openEvent(event)});
				cell.append(button);
			}
		}
		grid.append(cell);
	}
	while (grid.children.length % 7 != 0) {
		let cell = document.createElement('div');
		cell.dataset.active = 0;
		grid.append(cell);
	}
}

function shiftCalendar(shift) {
	viewMonth += shift;
	if (viewMonth < 0) {
		viewMonth = 11;
		viewYear--;
	}
	if (viewMonth > 11) {
		viewMonth = 0;
		viewYear++;
	}
	renderCalendar();
}

function openEvent(event) {
	let lightbox = document.querySelector('.calendar-lightbox');
	lightbox.querySelector('.calendar-lightbox-name').innerText = event.name;
	let when = event.time ? `${formatDate(event.date)}, ${event.time}` : formatDate(event.date);
	if (event.location) {
		when += `<br>${event.location}`;
	}
	lightbox.querySelector('.calendar-lightbox-when').innerHTML = when;
	lightbox.querySelector('.calendar-lightbox-description').innerHTML = event.description.map(text => `<p>${text}</p>`).join('');
	lightbox.dataset.active = 1;
}

function closeEvent() {
	let lightbox = document.querySelector('.calendar-lightbox');
	lightbox.dataset.active = 0;
}

document.querySelector('.calendar-lightbox-event').addEventListener('click', (e) => {
	e.stopPropagation();
});
window.addEventListener('keydown', (e) => {
	if (e.key == 'Escape') {
		closeEvent();
	}
});

renderCalendar();
