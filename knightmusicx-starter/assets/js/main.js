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
  const bigStep = quiz.querySelector('[data-quiz-big-step]');
  const teaser = quiz.querySelector('[data-quiz-teaser]');
  const resultName = quiz.querySelector('[data-result-name]');
  const resultCopy = quiz.querySelector('[data-result-copy]');
  const resultLink = quiz.querySelector('[data-result-link]');
  const resultSpotify = quiz.querySelector('[data-result-spotify]');
  const resultImage = quiz.querySelector('[data-result-image]');
  const resultTag = quiz.querySelector('[data-result-tag]');
  const shareText = quiz.querySelector('[data-share-text]');
  const shareStatus = quiz.querySelector('[data-share-status]');
  const scores = {};
  let currentQuestion = 0;
  let currentResult = null;

  const quizTeasers = [
    'Pick fast. Overthinking produces municipal paperwork.',
    'Transit preference tells the station more than your browser history.',
    'Seasonal data is legally inadmissible, but spiritually useful.',
    'The mix wants what it wants. Do not negotiate with the mix.',
    'Final routing. The coast is listening through a damp speaker.'
  ];

  const artists = {
    'lil-cabbage': {
      name: 'Lil’ Cabbage',
      href: '/artists/lil-cabbage.html',
      spotify: 'https://open.spotify.com/artist/6iLEqKx58SukUimAMifDPl',
      image: '/images/lilcabbageartist.jpeg',
      prompt: 'foggy dock argument',
      copy: 'KMX assigned you Lil’ Cabbage. Apparently you are a foggy dock argument with ferry dread, outlaw hooks, and a snack budget the city cannot regulate.'
    },
    secretmxtp: {
      name: 'secretmxtp',
      href: '/artists/secretmxtp.html',
      spotify: 'https://open.spotify.com/artist/4PeOpSW35ZXDxZIE1Oz6O5',
      image: '/images/secretmxtp%20artist%20image%201.png',
      prompt: 'wet pavement tape ghost',
      copy: 'KMX assigned you secretmxtp. You are a wet pavement tape ghost: quiet shoes, bad weather, and songs that feel found in a jacket pocket.'
    },
    'marcy-daydream': {
      name: 'Marcy Daydream',
      href: '/artists/marcy-daydream.html',
      spotify: 'https://open.spotify.com/album/2PBPToTasAkbw7c1yzDjir',
      image: '/images/MARCY%20DAYDREAM%20ARTIST%20PIC.PNG',
      prompt: 'hoodie-weather daydream',
      copy: 'KMX assigned you Marcy Daydream. You are hoodie-weather tenderness with a soft-focus exit plan and choruses that look out the window.'
    },
    cedarhollow: {
      name: 'CEDΛRHØLLØW',
      href: '/artists/ced-rh-ll-w.html',
      spotify: 'https://open.spotify.com/album/5xO8clzvEs2i48UZBXTFRs',
      image: '/images/rain%20atlas%20cedarhollow%20artist.png',
      prompt: 'rain atlas transmission',
      copy: 'KMX assigned you CEDΛRHØLLØW. You are a rain atlas transmission: haunted synths, coastal rooms, and analog ghosts in the walls.'
    },
    'victoria-victrola': {
      name: 'Victoria Victrola',
      href: '/artists/victoria-victrola.html',
      spotify: 'https://open.spotify.com/artist/1EGLiSOI9wT4Xgv6xFWPgP',
      image: '/images/victoria%20notmyp%20pic.webp',
      prompt: 'neon anti-pop transmission',
      copy: 'KMX assigned you Victoria Victrola. You are a neon anti-pop transmission: glossy static, clipped edges, and one elegant disappearance.'
    },
    hushnoise: {
      name: 'Hushnoise',
      href: '/artists/hushnoise.html',
      spotify: 'https://open.spotify.com/artist/1xJxmk05LkhfyyozlCsHjC',
      image: '/images/Hushnoise%20art.JPG',
      prompt: 'lights-off ambient loop',
      copy: 'KMX assigned you Hushnoise. You are a lights-off ambient loop: pressure release, low room hum, and nobody asking you to explain the fog.'
    },
    snacktrap: {
      name: 'SnackTrap',
      href: '/artists/snacktrap.html',
      spotify: 'https://open.spotify.com/artist/65t4uJaQ8Ok1EkLM3PQT5C',
      image: '/images/snacktrap-real.jpg',
      prompt: 'train with no explanation',
      copy: 'KMX assigned you SnackTrap. You are a train with no explanation: Deutschrap motion, platform lights, and snacks acquired through unclear means.'
    },
    'dylan-sparrow': {
      name: 'Dylan Sparrow',
      href: '/artists/dylan-sparrow.html',
      spotify: '',
      image: '/images/Dylan%20Sparrow%20fire.jpg',
      prompt: 'campfire weather confession',
      copy: 'KMX assigned you Dylan Sparrow. You are a campfire weather confession: honest, road-dusted, and staring into the middle distance with purpose.'
    },
    'st-plaid': {
      name: 'St. Plaid',
      href: '/artists/st-plaid.html',
      spotify: 'https://open.spotify.com/artist/2cIxPJRWvfHJ4hicZP1A2z',
      image: '/images/stplaidglue.jpg',
      prompt: 'dusk highway slow burn',
      copy: 'KMX assigned you St. Plaid. You are a dusk highway slow burn: cinematic, patient, and carrying a little road dust in the chorus.'
    },
    'baie-verte-bys': {
      name: 'Baie Verte B’ys',
      href: '/artists/baie-verte-bys.html',
      spotify: '',
      image: '/images/BAIE%20VERTE%20BYS%20ARTIST%20PIC.jpg',
      prompt: 'Atlantic ghost-folk shoreline',
      copy: 'KMX assigned you Baie Verte B’ys. You are Atlantic ghost-folk: cold coastal summer, weathered shoreline, and a chorus that knows the old roads.'
    },
    knight: {
      name: 'K.N.I.G.H.T.',
      href: '/artists/knight.html',
      spotify: 'https://open.spotify.com/artist/5BSZCKPIxIESKFDLvP5ck2',
      image: '/images/knight%20artist%20image.png',
      prompt: 'central broadcast anomaly',
      copy: 'KMX assigned you K.N.I.G.H.T. You are the central broadcast anomaly: no fixed address, just the signal holding the weird universe together.'
    },
    sylphina: {
      name: 'Sylphina Veyra',
      href: '/artists/sylphina.html',
      spotify: 'https://open.spotify.com/artist/4nHbl5M7v6hEa4OrwAUiMC',
      image: '/images/sylphina.png',
      prompt: 'ocean-lit pop drift',
      copy: 'KMX assigned you Sylphina Veyra. You are ocean-lit pop drift: shimmer, strange tides, and songs arriving from somewhere offshore.'
    }
  };

  function updateQuizProgress() {
    if (stepLabel) stepLabel.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
    if (progressBar) progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
    if (bigStep) bigStep.textContent = String(currentQuestion + 1).padStart(2, '0');
    if (teaser) teaser.textContent = quizTeasers[currentQuestion] || quizTeasers[0];
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
    const text = `KMX assigned me ${currentResult.name}. Apparently I'm ${currentResult.prompt}. https://www.knightmusicx.com/#signal-quiz`;
    questions.forEach((question) => question.classList.remove('active'));
    if (stepLabel) stepLabel.textContent = 'Signal locked';
    if (progressBar) progressBar.style.width = '100%';
    if (resultName) resultName.textContent = currentResult.name;
    if (resultCopy) resultCopy.textContent = currentResult.copy;
    if (resultLink) resultLink.href = currentResult.href;
    if (resultSpotify) {
      resultSpotify.href = currentResult.spotify || currentResult.href;
      resultSpotify.hidden = !currentResult.spotify;
    }
    if (resultImage) {
      resultImage.src = currentResult.image;
      resultImage.alt = `${currentResult.name} signal artwork`;
    }
    if (resultTag) resultTag.textContent = currentResult.prompt;
    if (shareText) shareText.value = text;
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
    const text = shareText?.value || `KMX assigned me ${currentResult.name}. Apparently I'm ${currentResult.prompt}. https://www.knightmusicx.com/#signal-quiz`;
    try {
      await navigator.clipboard.writeText(text);
      if (shareStatus) shareStatus.textContent = 'Copied signal text.';
    } catch {
      shareText?.focus();
      shareText?.select();
      if (shareStatus) shareStatus.textContent = 'Clipboard blocked. Text selected above.';
    }
  });

  showQuestion(0);
}
