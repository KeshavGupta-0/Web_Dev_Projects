// player.js - Audicore
// Expects: songList (array) injected in template, audio element with id="audioPlayer"
// and the DOM elements/IDs described above.

(function () {
  // Elements
  const audio = document.getElementById('audioPlayer');
  const playBtn = document.getElementById('play-pause-btn');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const progress = document.getElementById('progress');
  const volume = document.getElementById('volume');

  const albumArt = document.getElementById('player-album-art');
  const titleEl = document.getElementById('player-song-title');
  const artistEl = document.getElementById('player-artist-name');

  if (!audio || typeof songList === 'undefined' || !Array.isArray(songList) || songList.length === 0) {
    console.warn('Player: audio element or songs missing. Make sure songList is injected and audio exists.');
    return;
  }

  let currentIndex = 0;
  let isPlaying = false;
  audio.preload = 'metadata';

  // Helpers
  function getStaticUrl(path) {
    // path is expected like "music/sample1.mp3" — produce /static/ + path
    if (!path) return '';
    return `/static/${path.replace(/^\/+/, '')}`;
  }

  function loadSong(index) {
    if (index < 0) index = songList.length - 1;
    if (index >= songList.length) index = 0;
    currentIndex = index;
    const s = songList[currentIndex];

    // Update audio src
    audio.src = getStaticUrl(s.file || s.src || s.url);
    audio.currentTime = 0;

    // Update UI
    if (albumArt) albumArt.src = getStaticUrl(s.cover || s.cover_image || s.image || 'images/album-art.jpg');
    if (titleEl) titleEl.textContent = s.title || s.name || 'Unknown Title';
    if (artistEl) artistEl.textContent = s.artist || s.created_by || 'Unknown Artist';

    // Update progress UI
    progress.value = 0;
    progress.max = 100;
  }

  function play() {
    audio.play().then(() => {
      isPlaying = true;
      updatePlayIcon();
    }).catch(err => {
      console.warn('Play failed:', err);
    });
  }

  function pause() {
    audio.pause();
    isPlaying = false;
    updatePlayIcon();
  }

  function togglePlay() {
    if (isPlaying) pause(); else play();
  }

  function updatePlayIcon() {
    if (!playBtn) return;
    const icon = playBtn.querySelector('i');
    if (!icon) return;
    icon.classList.toggle('fa-play', !isPlaying);
    icon.classList.toggle('fa-pause', isPlaying);
    // ensure correct style classes (FontAwesome 6 uses different prefixes sometimes)
    icon.classList.remove('fa-solid', 'fa-regular');
    icon.classList.add('fa-solid');
    // toggle the specific icon classes
    if (isPlaying) {
      icon.classList.remove('fa-play'); icon.classList.add('fa-pause');
    } else {
      icon.classList.remove('fa-pause'); icon.classList.add('fa-play');
    }
  }

  function nextSong() {
    loadSong(currentIndex + 1);
    play();
  }

  function prevSong() {
    loadSong(currentIndex - 1);
    play();
  }

  // Progress updates
  audio.addEventListener('timeupdate', () => {
    if (!audio.duration || !progress) return;
    const percent = (audio.currentTime / audio.duration) * 100;
    progress.value = percent || 0;
  });

  // When user drags progress
  progress.addEventListener('input', (e) => {
    if (!audio.duration) return;
    const val = Number(e.target.value);
    audio.currentTime = (val / 100) * audio.duration;
  });

  // Volume control (0-100 slider)
  volume.addEventListener('input', (e) => {
    const v = Number(e.target.value) / 100;
    audio.volume = Math.min(Math.max(v, 0), 1);
  });

  // Ended -> auto next
  audio.addEventListener('ended', () => {
    nextSong();
  });

  // Button events
  playBtn.addEventListener('click', () => {
    togglePlay();
  });

  nextBtn.addEventListener('click', () => {
    nextSong();
  });

  prevBtn.addEventListener('click', () => {
    prevSong();
  });

  // Keyboard shortcuts (optional, quick UX)
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      // avoid page scrolling
      e.preventDefault();
      togglePlay();
    } else if (e.code === 'ArrowRight') {
      nextSong();
    } else if (e.code === 'ArrowLeft') {
      prevSong();
    }
  });

  // Initialize: set volume, load first song
  audio.volume = (volume && volume.value ? Number(volume.value) / 100 : 0.7);
  loadSong(0);
})();
