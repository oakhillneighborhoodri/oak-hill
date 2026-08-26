let track = document.querySelector('.home-marquee-track');
let marqueePhotos = [...track.children];
let setSize = marqueePhotos.length / 2;

function shuffle(items) {
	let shuffled = items.slice();
	for (let i = shuffled.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

let order = shuffle([...Array(setSize).keys()]);
let rotations = order.map(() => (Math.random() * 5 - 2.5).toFixed(2));

function arrangeMarquee(photos, offset) {
	let position = 0;
	for (let index of order) {
		let photo = photos[index];
		photo.style.setProperty('--rotation', `${rotations[position]}deg`);
		photo.style.setProperty('--delay', `${((offset + position) * .08).toFixed(2)}s`);
		track.append(photo);
		position++;
	}
}
arrangeMarquee(marqueePhotos.slice(0, setSize), 0);
arrangeMarquee(marqueePhotos.slice(setSize), setSize);
