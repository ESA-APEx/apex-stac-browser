document.addEventListener('DOMContentLoaded', () => {
  'use strict';

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

  new MegaMenu();

});
