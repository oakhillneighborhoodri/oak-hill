// submission form popup
const formPopup = document.querySelector('.form-popup');
const formEl = formPopup == null ? null : formPopup.querySelector('.form');
const formDone = formPopup == null ? null : formPopup.querySelector('.form-done');
const formPanel = formPopup == null ? null : formPopup.querySelector('.form-popup-panel');
const formError = formEl == null ? null : formEl.querySelector('.form-error');
let formReturnFocus = null;

function openForm() {
	if (formPopup == null) {
		return;
	}
	formReturnFocus = document.activeElement;
	formPopup.inert = false;
	formPopup.dataset.active = 1;
	// the form keeps whatever was typed, so a stray click never loses a draft
	let first = formEl.querySelector('.form-input');
	if (first != null && !formEl.hidden) {
		setTimeout(() => {first.focus({preventScroll: true})}, 350);
	}
}

function closeForm() {
	if (formPopup == null) {
		return;
	}
	formPopup.dataset.active = 0;
	formPopup.inert = true;
	if (formReturnFocus != null) {
		formReturnFocus.focus({preventScroll: true});
		formReturnFocus = null;
	}
}

function showFormError(message) {
	formError.textContent = message;
	formError.hidden = false;
	formError.scrollIntoView({behavior: 'smooth', block: 'center'});
}

function clearFormError() {
	formError.hidden = true;
	formError.textContent = '';
}

// some forms need at least one of a group of fields, not any particular one
function checkFormRequireOne() {
	let group = formEl.dataset.requireOne;
	if (group == undefined) {
		return true;
	}
	let filled = group.split(' ').some(name => {
		let field = formEl.elements[name];
		if (field == undefined) {
			return false;
		}
		if (field.type == 'file') {
			return field.files.length > 0;
		}
		return field.value.trim() != '';
	});
	if (!filled) {
		showFormError(formEl.dataset.requireOneMessage);
		return false;
	}
	return true;
}

function submitForm(e) {
	e.preventDefault();
	clearFormError();
	if (!formEl.reportValidity() || !checkFormRequireOne()) {
		return;
	}
	formEl.dataset.busy = 1;
	let data = new FormData(formEl);
	// netlify wants multipart when a file is attached, urlencoded otherwise
	let options = formEl.enctype == 'multipart/form-data'
		? {method: 'POST', body: data}
		: {
			method: 'POST',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			body: new URLSearchParams(data).toString()
		};
	fetch(window.location.pathname, options).then(response => {
		if (!response.ok) {
			throw new Error(response.status);
		}
		formEl.reset();
		formEl.hidden = true;
		formDone.hidden = false;
		formPanel.scrollIntoView({behavior: 'smooth', block: 'center'});
		formDone.querySelector('.form-done-close').focus({preventScroll: true});
	}).catch(() => {
		showFormError('Sorry, that didn’t send. Please try again, or email us directly at oakhillneighborhoodri@gmail.com and we’ll sort it out.');
	}).finally(() => {
		formEl.dataset.busy = 0;
	});
}

function initForm() {
	if (formPopup == null) {
		return;
	}
	// a closed popup is still in the DOM and off-screen, so keep it out of
	// the tab order and away from screen readers until it is opened
	formPopup.inert = true;
	formPanel.addEventListener('click', (e) => {
		e.stopPropagation();
	});
	formEl.addEventListener('submit', submitForm);
	formEl.addEventListener('input', () => {
		if (!formError.hidden) {
			clearFormError();
		}
	});
	window.addEventListener('keydown', (e) => {
		if (e.key == 'Escape' && formPopup.dataset.active == 1) {
			closeForm();
		}
	});
}
initForm();
