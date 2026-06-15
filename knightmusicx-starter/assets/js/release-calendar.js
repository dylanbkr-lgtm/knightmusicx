// Add only confirmed releases. Dates use YYYY-MM-DD.
const kmxReleases = [
  { date: '2026-06-18', artist: "Lil' Cabbage", title: 'Fry Crime', type: 'Single', href: '/artists/lil-cabbage.html' },
  { date: '2026-06-29', artist: 'CEDΛRHØLLØW', title: 'Tide Static', type: 'Single', href: '/artists/ced-rh-ll-w.html' },
  { date: '2026-07-01', artist: "Lil' Cabbage", title: 'Crumby Shuffle', type: 'Single', href: '/artists/lil-cabbage.html' },
  { date: '2026-07-07', artist: "Lil' Cabbage", title: 'Bic', type: 'Single', href: '/artists/lil-cabbage.html' },
  { date: '2026-07-15', artist: "Lil' Cabbage", title: 'takedown', type: 'Single', href: '/artists/lil-cabbage.html' },
  { date: '2026-07-21', artist: "Lil' Cabbage", title: 'Truck Arm', type: 'Single', href: '/artists/lil-cabbage.html' },
  { date: '2026-08-05', artist: "Lil' Cabbage", title: 'Island Time', type: 'Single', href: '/artists/lil-cabbage.html' },
  { date: '2026-08-14', artist: "Lil' Cabbage", title: 'wobble', type: 'Single', href: '/artists/lil-cabbage.html' },
  { date: '2026-09-03', artist: "Lil' Cabbage", title: 'elegance', type: 'Single', href: '/artists/lil-cabbage.html' }
];

const calendar = document.querySelector('[data-release-calendar]');

if (calendar) {
  const title = calendar.querySelector('[data-calendar-title]');
  const grid = calendar.querySelector('[data-calendar-grid]');
  const agenda = calendar.querySelector('[data-release-agenda]');
  const status = document.querySelector('[data-schedule-status]');
  const today = new Date();
  let visibleMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const dateKey = (date) => [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('-');

  function renderAgenda() {
    const upcoming = kmxReleases
      .filter((release) => release.date >= dateKey(today))
      .sort((a, b) => a.date.localeCompare(b.date));

    if (status && upcoming.length) {
      status.textContent = `${upcoming.length} confirmed transmission${upcoming.length === 1 ? '' : 's'}`;
    }

    if (!upcoming.length) {
      agenda.innerHTML = '<div class="release-empty"><span>NO DATES LOCKED</span><p>The next transmission has not been cleared for public release.</p></div>';
      return;
    }

    agenda.innerHTML = upcoming.map((release) => {
      const releaseDate = new Date(`${release.date}T12:00:00`);
      const label = releaseDate.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });
      return `<a class="agenda-item" href="${release.href}"><time datetime="${release.date}">${label}</time><span><small>${release.artist} · ${release.type}</small><strong>${release.title}</strong></span></a>`;
    }).join('');
  }

  function renderCalendar() {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const previousMonthDays = new Date(year, month, 0).getDate();

    title.textContent = visibleMonth.toLocaleDateString('en-CA', { month: 'long', year: 'numeric' });
    grid.innerHTML = '';

    for (let index = 0; index < 42; index += 1) {
      let day = index - firstDay + 1;
      let cellDate = new Date(year, month, day);
      let outside = false;

      if (day < 1) {
        day = previousMonthDays + day;
        cellDate = new Date(year, month - 1, day);
        outside = true;
      } else if (day > daysInMonth) {
        day -= daysInMonth;
        cellDate = new Date(year, month + 1, day);
        outside = true;
      }

      const key = dateKey(cellDate);
      const releases = kmxReleases.filter((release) => release.date === key);
      const cell = document.createElement('div');
      cell.className = 'calendar-day';
      if (outside) cell.classList.add('outside-month');
      if (key === dateKey(today)) cell.classList.add('is-today');
      if (releases.length) cell.classList.add('has-release');
      cell.innerHTML = `<time datetime="${key}">${day}</time>${releases.map((release) => `<a href="${release.href}" title="${release.artist}: ${release.title}"><small>${release.type}</small><strong>${release.artist}</strong><span>${release.title}</span></a>`).join('')}`;
      grid.appendChild(cell);
    }
  }

  calendar.querySelector('[data-calendar-prev]').addEventListener('click', () => {
    visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
    renderCalendar();
  });

  calendar.querySelector('[data-calendar-next]').addEventListener('click', () => {
    visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
    renderCalendar();
  });

  renderCalendar();
  renderAgenda();
}
