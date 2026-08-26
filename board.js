function initPosts() {
	let posts = document.querySelectorAll('.board-item');
	let i = 0;
	for (let post of posts) {
		let image = post.querySelector('.board-item-image img');
		if (image != undefined) {
			const index = i
			image.addEventListener('click', () => {openPost(index)});
		}
		i++;
	}
}
function openPost(index) {
	let posts = document.querySelectorAll('.board-item');
	let post = posts[index];
	console.log(index)
	let image = post.querySelector('.board-item-image img');
	let lightbox = document.querySelector('.board-lightbox');
	let lightboxImage = lightbox.querySelector('.board-lightbox-image img');
	lightboxImage.src = image.src;
	lightbox.dataset.active = 1;
}
function closePost() {
	let lightbox = document.querySelector('.board-lightbox');
	lightbox.dataset.active = 0;
}
initPosts();