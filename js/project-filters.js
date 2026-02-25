(function () {
  function getCardTags(card) {
    return Array.from(card.querySelectorAll('.tag')).map((element) =>
      element.textContent.trim().toLowerCase()
    );
  }

  function setActiveChip(filterContainer, selectedTag) {
    const chips = filterContainer.querySelectorAll('.filter-chip');
    chips.forEach((chip) => {
      chip.classList.toggle('active', chip.dataset.tag === selectedTag);
    });
  }

  function applyFilter(cards, selectedTag) {
    cards.forEach((card) => {
      if (selectedTag === 'all') {
        card.hidden = false;
        return;
      }

      const tags = getCardTags(card);
      card.hidden = !tags.includes(selectedTag);
    });
  }

  function getCardTitle(card) {
    const heading = card.querySelector('h3');
    return heading ? heading.textContent.trim().toLowerCase() : '';
  }

  function getCardDateValue(card, fallbackOrder) {
    const added = card.dataset.added;
    if (added) {
      const parsedDate = Date.parse(added);
      if (!Number.isNaN(parsedDate)) {
        return parsedDate;
      }
    }

    return fallbackOrder;
  }

  function sortCards(projectGrid, cards, sortValue) {
    const sortedCards = [...cards].sort((firstCard, secondCard) => {
      const firstIndex = Number(firstCard.dataset.originalIndex || 0);
      const secondIndex = Number(secondCard.dataset.originalIndex || 0);

      if (sortValue === 'title-asc') {
        const titleCompare = getCardTitle(firstCard).localeCompare(getCardTitle(secondCard));
        return titleCompare !== 0 ? titleCompare : firstIndex - secondIndex;
      }

      const firstDate = getCardDateValue(firstCard, cards.length - firstIndex);
      const secondDate = getCardDateValue(secondCard, cards.length - secondIndex);

      if (sortValue === 'date-asc') {
        return firstDate - secondDate;
      }

      return secondDate - firstDate;
    });

    sortedCards.forEach((card) => {
      projectGrid.appendChild(card);
    });
  }

  function buildFilterChip(filterContainer, label, value, onClick) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'filter-chip';
    button.dataset.tag = value;
    button.textContent = label;
    button.addEventListener('click', () => onClick(value));
    filterContainer.appendChild(button);
  }

  function initProjectFilters() {
    const projectGrid = document.getElementById('projects-grid');
    const filterContainer = document.getElementById('project-filter-tags');
    const sortSelect = document.getElementById('project-sort');

    if (!projectGrid || !filterContainer || !sortSelect) {
      return;
    }

    const cards = Array.from(projectGrid.querySelectorAll('.project-card'));
    if (cards.length === 0) {
      filterContainer.textContent = 'No projects to filter.';
      return;
    }

    cards.forEach((card, index) => {
      card.dataset.originalIndex = String(index);
    });

    const allTags = new Set();
    cards.forEach((card) => {
      getCardTags(card).forEach((tag) => allTags.add(tag));
    });

    const sortedTags = Array.from(allTags).sort((first, second) =>
      first.localeCompare(second)
    );

    let currentTag = 'all';

    const applyCurrentState = () => {
      sortCards(projectGrid, cards, sortSelect.value);
      setActiveChip(filterContainer, currentTag);
      applyFilter(cards, currentTag);
    };

    const onFilterClick = (selectedTag) => {
      currentTag = selectedTag;
      applyCurrentState();
    };

    sortSelect.addEventListener('change', () => {
      applyCurrentState();
    });

    buildFilterChip(filterContainer, 'All', 'all', onFilterClick);
    sortedTags.forEach((tag) => {
      buildFilterChip(filterContainer, tag, tag, onFilterClick);
    });

    sortSelect.value = 'date-desc';
    applyCurrentState();
  }

  document.addEventListener('DOMContentLoaded', initProjectFilters);
})();
