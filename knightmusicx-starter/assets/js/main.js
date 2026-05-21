const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

document.querySelectorAll('[data-embed-tab]').forEach((button) => {
  button.addEventListener('click', () => {
    const target = button.dataset.embedTab;
    document.querySelectorAll('[data-embed-tab]').forEach((tab) => {
      const active = tab === button;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    document.querySelectorAll('.embed-panel').forEach((panel) => {
      panel.classList.toggle('active', panel.id === `embed-${target}`);
    });
  });
});

document.querySelectorAll('.track-row').forEach((row) => {
  row.addEventListener('click', () => {
    document.querySelectorAll('.track-row').forEach((item) => item.classList.remove('playing'));
    row.classList.add('playing');
  });
});

document.querySelectorAll('[data-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach((chip) => {
      chip.classList.toggle('active', chip === button);
    });
    document.querySelectorAll('.artist-grid li[data-category]').forEach((item) => {
      item.hidden = filter !== 'all' && item.dataset.category !== filter;
    });
    document.querySelectorAll('.roster-group').forEach((group) => {
      const hasVisibleArtist = Array.from(group.querySelectorAll('li[data-category]')).some((item) => !item.hidden);
      group.hidden = !hasVisibleArtist;
    });
  });
});
