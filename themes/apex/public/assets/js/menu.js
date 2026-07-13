document.addEventListener('DOMContentLoaded', async () => {
  'use strict';

  class NavigationLoader {
    constructor() {
      this.desktopNavRegion = document.querySelector('.c-header__nav .region-nav-main');
      this.mobileNavList = document.querySelector('.c-sidebar__menu');
      const runtimeConfig = window.STAC_BROWSER_CONFIG?.apexNavigation || {};
      this.meta = {
        enabled: runtimeConfig.enabled !== false,
        sourceUrl: runtimeConfig.sourceUrl || 'https://apex.esa.int/',
        proxyUrl: Object.prototype.hasOwnProperty.call(runtimeConfig, 'proxyUrl') ? runtimeConfig.proxyUrl : 'https://corsproxy.io/?'
      };
    }

    async load() {
      if (!this.meta.enabled || !this.desktopNavRegion || !this.mobileNavList) {
        return;
      }

      try {
        const response = await fetch(this.getRequestUrl(), {
          method: 'GET',
          mode: 'cors',
          credentials: 'omit'
        });

        if (!response.ok) {
          throw new Error(`Navigation request failed with status ${response.status}`);
        }

        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('text/html')) {
          throw new Error(`Navigation request returned unexpected content type: ${contentType}`);
        }

        const html = await response.text();
        const remoteDocument = new DOMParser().parseFromString(html, 'text/html');
        const desktopNavRegion = remoteDocument.querySelector('.c-header__nav .region-nav-main');
        const mobileNavList = remoteDocument.querySelector('.c-sidebar__menu');

        if (!desktopNavRegion || !mobileNavList) {
          throw new Error('Navigation markup was not found in the proxied APEx response');
        }

        this.desktopNavRegion.innerHTML = desktopNavRegion.innerHTML;
        this.mobileNavList.innerHTML = mobileNavList.innerHTML;
        this.rewriteUrls(this.desktopNavRegion);
        this.rewriteUrls(this.mobileNavList);
      }
      catch (error) {
        console.warn('APEx navigation fallback in use:', error);
      }
    }

    getRequestUrl() {
      if (!this.shouldUseProxy()) {
        return this.meta.sourceUrl;
      }

      if (this.meta.proxyUrl.includes('{url}')) {
        return this.meta.proxyUrl.replace('{url}', encodeURIComponent(this.meta.sourceUrl));
      }

      return `${this.meta.proxyUrl}${this.meta.sourceUrl}`;
    }

    shouldUseProxy() {
      if (!this.meta.proxyUrl) {
        return false;
      }

      const sourceOrigin = new URL(this.meta.sourceUrl).origin;
      if (window.location.origin === sourceOrigin) {
        return false;
      }

      return this.isLocalEnvironment();
    }

    isLocalEnvironment() {
      return ['localhost', '127.0.0.1', '0.0.0.0'].includes(window.location.hostname);
    }

    rewriteUrls(rootElement) {
      const sourceUrl = new URL(this.meta.sourceUrl);
      rootElement.querySelectorAll('[href], [src]').forEach(element => {
        for (const attributeName of ['href', 'src']) {
          const value = element.getAttribute(attributeName);
          if (!value || value.startsWith('#') || value.startsWith('mailto:') || value.startsWith('tel:')) {
            continue;
          }

          try {
            element.setAttribute(attributeName, new URL(value, sourceUrl).toString());
          }
          catch (error) {
            console.warn(`Could not normalize ${attributeName} for APEx navigation`, error);
          }
        }
      });
    }
  }

  // MegaMenu Class
  class MegaMenu {
    constructor() {
      const megaMenu = document.querySelector('.js-mega-menu');
      if (!megaMenu) return;

      const megaMenuTopics = document.querySelectorAll('.js-mega-menu-topic');
      const megaMenuContents = document.querySelectorAll('.js-mega-menu-content');

      megaMenuTopics.forEach(topic => {
        topic.addEventListener('click', this.handleClickTopic.bind(this));
        topic.addEventListener('mouseover', this.handleHoverTopic.bind(this));
        topic.addEventListener('mouseout', this.handleMouseOutTopic.bind(this));
      });

      this.megaMenuContents = megaMenuContents;
    }

    handleClickTopic(e) {
      e.preventDefault();
      this.switchContent(e.currentTarget);
    }

    handleHoverTopic(e) {
      this.switchContent(e.currentTarget);
    }

    handleMouseOutTopic(e) {
      // Optional: Add logic for mouse out events if needed
    }

    switchContent(topic) {
      const topicIndex = topic.getAttribute('data-index');
      this.megaMenuContents.forEach(content => {
        content.setAttribute('aria-hidden', content.getAttribute('data-index') !== topicIndex);
      });
    }
  }

  // Hamburger Menu Class
  class HamburgerMenu {
    constructor() {
      const hamburgers = document.querySelectorAll('.js-hamburger');
      const menu = document.querySelector('.js-hamburger-menu');
      const body = document.body;

      if (menu) {
        hamburgers.forEach(hamburger => {
          hamburger.addEventListener('click', (e) => this.handleClickHamburger(e, menu, body));
        });
      } else {

      }
    }

    handleClickHamburger(e, menu, body) {
      e.preventDefault();
      menu.classList.toggle('open');
      body.classList.toggle('has-hamburger-open');
    }
  }

  await new NavigationLoader().load();
  new MegaMenu();
  new HamburgerMenu();
});


