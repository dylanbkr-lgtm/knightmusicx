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

const quiz = document.querySelector('[data-quiz]');
if (quiz) {
  const questions = Array.from(quiz.querySelectorAll('.quiz-question'));
  const resultPanel = quiz.querySelector('[data-quiz-result]');
  const stepLabel = quiz.querySelector('[data-quiz-step-label]');
  const progressBar = quiz.querySelector('[data-quiz-progress-bar]');
  const resultName = quiz.querySelector('[data-result-name]');
  const resultCopy = quiz.querySelector('[data-result-copy]');
  const resultLink = quiz.querySelector('[data-result-link]');
  const shareStatus = quiz.querySelector('[data-share-status]');
  const scores = {};
  let currentQuestion = 0;
  let currentResult = null;

  const artists = {
    'lil-cabbage': {
      name: 'Lil’ Cabbage',
      href: '/artists/lil-cabbage.html',
      copy: 'West Coast country-trap, ferry dread, outlaw hooks, and Crumby Island dust.'
    },
    secretmxtp: {
      name: 'secretmxtp',
      href: '/artists/secretmxtp.html',
      copy: 'Lo-fi tape ghosts, wet pavement, Cumberland fragments, and songs that feel found in a jacket pocket.'
    },
    'marcy-daydream': {
      name: 'Marcy Daydream',
      href: '/artists/marcy-daydream.html',
      copy: 'Tender indie melancholy, hoodie-weather choruses, and soft-focus disappearance.'
    },
    cedarhollow: {
      name: 'CEDΛRHØLLØW',
      href: '/artists/ced-rh-ll-w.html',
      copy: 'Coastal Indietronica for rain-drenched rooms, haunted synths, and analog ghosts.'
    },
    'victoria-victrola': {
      name: 'Victoria Victrola',
      href: '/artists/victoria-victrola.html',
      copy: 'Art rock anti-pop, clipped transmissions, digital vanishing acts, and glossy static.'
    },
    hushnoise: {
      name: 'Hushnoise',
      href: '/artists/hushnoise.html',
      copy: 'Ambient sleep loops, pressure-release drones, and the soft hum after everyone leaves.'
    },
    snacktrap: {
      name: 'SnackTrap',
      href: '/artists/snacktrap.html',
      copy: 'Deutschrap train rides, transit blur, and lo-fi motion through places with no fixed address.'
    },
    'dylan-sparrow': {
      name: 'Dylan Sparrow',
      href: '/artists/dylan-sparrow.html',
      copy: 'Indie folk confessions, campfire static, window seats, and weather.'
    },
    'st-plaid': {
      name: 'St. Plaid',
      href: '/artists/st-plaid.html',
      copy: 'Cinematic alt-folk, dusk highways, slow burns, and songs with a little road dust on them.'
    },
    'baie-verte-bys': {
      name: 'Baie Verte B’ys',
      href: '/artists/baie-verte-bys.html',
      copy: 'Newfoundland ghost-folk, cold coastal summer, and voices from a weathered shoreline.'
    },
    knight: {
      name: 'K.N.I.G.H.T.',
      href: '/artists/knight.html',
      copy: 'The central broadcast: no fixed address, just the signal holding the weird universe together.'
    },
    sylphina: {
      name: 'Sylphina Veyra',
      href: '/artists/sylphina.html',
      copy: 'Ocean-lit pop, shimmer, strange tides, and songs that drift in from somewhere else.'
    }
  };

  function updateQuizProgress() {
    if (stepLabel) stepLabel.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
    if (progressBar) progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  }

  function showQuestion(index) {
    questions.forEach((question, questionIndex) => {
      question.classList.toggle('active', questionIndex === index);
    });
    currentQuestion = index;
    updateQuizProgress();
  }

  function applyPoints(points) {
    points.split(',').forEach((entry) => {
      const [artist, value] = entry.split(':');
      scores[artist] = (scores[artist] || 0) + Number(value || 0);
    });
  }

  function showResult() {
    const winner = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] || 'lil-cabbage';
    currentResult = artists[winner];
    questions.forEach((question) => question.classList.remove('active'));
    if (stepLabel) stepLabel.textContent = 'Signal locked';
    if (progressBar) progressBar.style.width = '100%';
    if (resultName) resultName.textContent = currentResult.name;
    if (resultCopy) resultCopy.textContent = currentResult.copy;
    if (resultLink) resultLink.href = currentResult.href;
    if (shareStatus) shareStatus.textContent = '';
    if (resultPanel) resultPanel.hidden = false;
  }

  quiz.querySelectorAll('.quiz-question button').forEach((button) => {
    button.addEventListener('click', () => {
      applyPoints(button.dataset.points || '');
      if (currentQuestion + 1 < questions.length) {
        showQuestion(currentQuestion + 1);
      } else {
        showResult();
      }
    });
  });

  quiz.querySelector('[data-quiz-reset]')?.addEventListener('click', () => {
    Object.keys(scores).forEach((key) => delete scores[key]);
    currentResult = null;
    if (resultPanel) resultPanel.hidden = true;
    showQuestion(0);
  });

  quiz.querySelector('[data-quiz-share]')?.addEventListener('click', async () => {
    if (!currentResult) return;
    const text = `My Knight Music X signal is ${currentResult.name}: ${currentResult.copy} https://www.knightmusicx.com${currentResult.href}`;
    try {
      await navigator.clipboard.writeText(text);
      if (shareStatus) shareStatus.textContent = 'Copied signal text.';
    } catch {
      if (shareStatus) shareStatus.textContent = text;
    }
  });

  showQuestion(0);
}
