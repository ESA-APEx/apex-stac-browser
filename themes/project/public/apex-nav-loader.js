(function () {
	var cfg = window.APEX_CONFIG || {};
	var portalUrl = cfg.portalUrl;

	if (!portalUrl) {
		return;
	}

	function toAbsoluteHref(base, href) {
		try {
			return new URL(href, base).toString();
		} catch (error) {
			return href;
		}
	}

	function fetchTextCandidates(urls) {
		var index = 0;

		function next() {
			if (index >= urls.length) {
				return Promise.reject(new Error('All fetch candidates failed.'));
			}

			var current = urls[index];
			index += 1;

			return fetch(current)
				.then(function (response) {
					if (!response.ok) {
						throw new Error('Portal request failed: ' + response.status);
					}
					return response.text();
				})
				.catch(function () {
					return next();
				});
		}

		return next();
	}

	function absolutizeNodeUrls(root, portalOrigin) {
		if (!root) {
			return;
		}

		var nodes = root.querySelectorAll('[href], [src], [action]');
		for (var i = 0; i < nodes.length; i += 1) {
			var node = nodes[i];
			var href = node.getAttribute('href');
			var src = node.getAttribute('src');
			var action = node.getAttribute('action');

			if (href) {
				node.setAttribute('href', toAbsoluteHref(portalOrigin, href));
			}
			if (src) {
				node.setAttribute('src', toAbsoluteHref(portalOrigin, src));
			}
			if (action) {
				node.setAttribute('action', toAbsoluteHref(portalOrigin, action));
			}
		}
	}

	function extractNavFromPortal(doc, portalOrigin) {
		var links = [];
		var nodes = doc.querySelectorAll('main nav .navbar-nav .nav-link, nav .navbar-nav .nav-link');

		for (var i = 0; i < nodes.length; i += 1) {
			var node = nodes[i];
			var label = (node.textContent || '').trim();
			var href = node.getAttribute('href') || '';
			if (!label || !href) {
				continue;
			}
			links.push({ label: label, href: toAbsoluteHref(portalOrigin, href) });
		}

		// Deduplicate while preserving order.
		var seen = {};
		var deduped = [];
		for (var j = 0; j < links.length; j += 1) {
			var key = links[j].label + '|' + links[j].href;
			if (!seen[key]) {
				seen[key] = true;
				deduped.push(links[j]);
			}
		}

		var logo = doc.querySelector('main nav .navbar-brand img, nav .navbar-brand img');
		var logoUrl = logo ? toAbsoluteHref(portalOrigin, logo.getAttribute('src') || '') : '';

		var topHeaderNode = doc.querySelector('header.top-header');
		if (topHeaderNode) {
			topHeaderNode = topHeaderNode.cloneNode(true);
			absolutizeNodeUrls(topHeaderNode, portalOrigin);
		}

		var navNode = doc.querySelector('main nav.navbar, nav.navbar');
		if (navNode) {
			navNode = navNode.cloneNode(true);
			absolutizeNodeUrls(navNode, portalOrigin);
			var scripts = navNode.querySelectorAll('script');
			for (var l = 0; l < scripts.length; l += 1) {
				scripts[l].remove();
			}
		}

		return {
			links: deduped,
			logoUrl: logoUrl,
			topHeaderHtml: topHeaderNode ? topHeaderNode.outerHTML : '',
			navHtml: navNode ? navNode.outerHTML : ''
		};
	}

	function renderNav(data) {
		var nav = document.createElement('nav');
		nav.id = 'apex-main-nav';
		nav.className = 'apex-main-nav';
		nav.setAttribute('aria-label', 'APEx main navigation');

		var container = document.createElement('div');
		container.className = 'container';
		nav.appendChild(container);

		var menuId = 'apex-main-nav-links';

		if (data.logoUrl) {
			var logoLink = document.createElement('a');
			logoLink.className = 'apex-main-nav-logo';
			logoLink.href = portalUrl;
			logoLink.target = '_blank';
			logoLink.rel = 'noopener noreferrer';

			var logo = document.createElement('img');
			logo.src = data.logoUrl;
			logo.alt = 'APEx logo';

			logoLink.appendChild(logo);
			container.appendChild(logoLink);
		}

		var toggle = document.createElement('button');
		toggle.className = 'apex-main-nav-toggle';
		toggle.type = 'button';
		toggle.setAttribute('aria-label', 'Toggle navigation');
		toggle.setAttribute('aria-controls', menuId);
		toggle.setAttribute('aria-expanded', 'false');
		toggle.textContent = '\u2630';
		container.appendChild(toggle);

		var linksWrap = document.createElement('div');
		linksWrap.id = menuId;
		linksWrap.className = 'apex-main-nav-links';

		var list = document.createElement('ul');
		list.className = 'apex-main-nav-list';

		for (var i = 0; i < data.links.length; i += 1) {
			var itemData = data.links[i];
			var li = document.createElement('li');
			var a = document.createElement('a');
			a.href = itemData.href;
			a.textContent = itemData.label;
			a.target = '_blank';
			a.rel = 'noopener noreferrer';
			li.appendChild(a);
			list.appendChild(li);
		}

		linksWrap.appendChild(list);
		container.appendChild(linksWrap);

		if (!injectIntoStacBrowser(nav)) {
			return false;
		}

		function closeMenu() {
			linksWrap.classList.remove('is-open');
			toggle.setAttribute('aria-expanded', 'false');
		}

		toggle.addEventListener('click', function () {
			var isOpen = linksWrap.classList.toggle('is-open');
			toggle.setAttribute('aria-expanded', String(isOpen));
		});

		document.addEventListener('click', function (event) {
			if (!linksWrap.classList.contains('is-open')) {
				return;
			}
			if (nav.contains(event.target)) {
				return;
			}
			closeMenu();
		});

		document.addEventListener('keydown', function (event) {
			if (event.key === 'Escape') {
				closeMenu();
			}
		});

		window.addEventListener('resize', function () {
			if (window.innerWidth >= 992) {
				closeMenu();
			}
		});

		return true;
	}

	function enhancePortalMobileNav(nav) {
		var toggle = nav.querySelector('.navbar-toggler');
		var collapse = nav.querySelector('.navbar-collapse');
		if (!toggle || !collapse) {
			return;
		}

		function closeMenu() {
			collapse.classList.remove('show');
			toggle.setAttribute('aria-expanded', 'false');
		}

		toggle.addEventListener('click', function () {
			var isOpen = collapse.classList.toggle('show');
			toggle.setAttribute('aria-expanded', String(isOpen));
		});

		document.addEventListener('click', function (event) {
			if (!collapse.classList.contains('show')) {
				return;
			}
			if (nav.contains(event.target)) {
				return;
			}
			closeMenu();
		});

		document.addEventListener('keydown', function (event) {
			if (event.key === 'Escape') {
				closeMenu();
			}
		});

		window.addEventListener('resize', function () {
			if (window.innerWidth >= 992) {
				closeMenu();
			}
		});
	}

	function htmlToElement(html) {
		if (!html) {
			return null;
		}
		var template = document.createElement('template');
		template.innerHTML = html.trim();
		return template.content.firstElementChild;
	}

	function injectIntoStacBrowser(node) {
		if (!node) {
			return false;
		}

		var root = document.querySelector('#stac-browser');
		if (!root) {
			return false;
		}

		var existingNav = document.getElementById('apex-main-nav');
		if (existingNav) {
			existingNav.remove();
		}

		root.insertAdjacentElement('afterbegin', node);
		return true;
	}

	function renderWithRetry(renderer, attempts) {
		if (renderer()) {
			return;
		}
		if (attempts <= 0) {
			return;
		}
		setTimeout(function () {
			renderWithRetry(renderer, attempts - 1);
		}, 100);
	}

	function renderPortalMarkup(data, portalOrigin) {
		var navNode = htmlToElement(data.navHtml);
		if (!navNode) {
			return false;
		}

		absolutizeNodeUrls(navNode, portalOrigin);
		navNode.id = 'apex-main-nav';
		navNode.setAttribute('aria-label', 'APEx main navigation');

		if (!injectIntoStacBrowser(navNode)) {
			return false;
		}
		enhancePortalMobileNav(navNode);
		return true;
	}

	function init() {
		var parsedPortal;
		try {
			parsedPortal = new URL(portalUrl);
		} catch (error) {
			console.warn('apex-nav-loader: invalid portalUrl', portalUrl);
			return;
		}

		var origin = parsedPortal.origin;
		var resolvedPortalUrl = parsedPortal.toString();
		var fetchUrls = [resolvedPortalUrl];

		fetchTextCandidates(fetchUrls)
			.then(function (html) {
				var parser = new DOMParser();
				var doc = parser.parseFromString(html, 'text/html');
				var extracted = extractNavFromPortal(doc, origin);

				renderWithRetry(function () {
					if (extracted.navHtml && renderPortalMarkup(extracted, origin)) {
						return true;
					}
					renderNav(extracted);
					var nav = document.getElementById('apex-main-nav');
					return Boolean(nav);
				}, 30);
			})
			.catch(function (error) {
				console.warn('apex-nav-loader: falling back to default nav links', error);
			});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
