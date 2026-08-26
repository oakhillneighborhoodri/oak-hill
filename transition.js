// page transitions
// let body = document.querySelector('body');
// let reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
// let transitioning = false;
// body.dataset.transition = 0;
// function goTransition(url) {
// 	if (transitioning) {
// 		return;
// 	}
// 	transitioning = true;
// 	body.dataset.transition = 1;
// 	setTimeout(() => {
// 		window.location.href = url;
// 	}, 200)
// }
// function initTransitions() {
// 	let links = document.querySelectorAll('a');
// 	for (let link of links) {
// 		if (link.dataset.transitionReady == 1) {
// 			continue;
// 		}
// 		if (link.origin != window.location.origin) {
// 			continue;
// 		}
// 		if (link.target == "_blank") {
// 			continue;
// 		}
// 		if (link.hasAttribute('download')) {
// 			continue;
// 		}
// 		if (link.hash != "" && link.pathname == window.location.pathname) {
// 			continue;
// 		}
// 		link.dataset.transitionReady = 1;
// 		link.addEventListener('click', (e) => {
// 			// let the browser navigate normally
// 			if (reduceMotion.matches) {
// 				return;
// 			}
// 			if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
// 				return;
// 			}
// 			e.preventDefault();
// 			goTransition(link.href);
// 		})
// 	}
// }
// initTransitions();

// // catch links added after load
// let transitionObserver = new MutationObserver(() => {
// 	initTransitions();
// });
// transitionObserver.observe(body, {
// 	childList: true,
// 	subtree: true
// });

// // always reset, covers back navigation and bfcache restores
// window.addEventListener('pageshow', () => {
// 	transitioning = false;
// 	body.dataset.transition = 0;
// })