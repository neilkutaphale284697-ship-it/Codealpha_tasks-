// ===== EDIT: your playlist. Put audio files in the audio/ folder (mp3, wav, ogg). =====
const tracks = [
  { title: 'Sunrise Drive', artist: 'Demo Artist', src: 'audio/track1.wav', hue: 170 },
  { title: 'Night Study',   artist: 'Demo Artist', src: 'audio/track2.wav', hue: 265 },
  { title: 'Neon Walk',     artist: 'Demo Artist', src: 'audio/track3.wav', hue: 340 }
];

const $ = (id) => document.getElementById(id);
const audio = new Audio();
let index = 0;

const els = {
  title: $('title'), artist: $('artist'), disc: $('disc'),
  progress: $('progress'), current: $('current'), duration: $('duration'),
  play: $('play'), playIcon: $('play-icon'), prev: $('prev'), next: $('next'),
  volume: $('volume'), mute: $('mute'), volIcon: $('vol-icon'),
  autoplay: $('autoplay'), playlist: $('playlist')
};

// ---------- Helpers ----------
function fmt(sec) {
  if (!isFinite(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return m + ':' + s;
}
function setFill(input) {
  const pct = ((input.value - input.min) / (input.max - input.min)) * 100;
  input.style.setProperty('--fill', pct + '%');
}

// ---------- Playlist ----------
function buildPlaylist() {
  tracks.forEach((t, i) => {
    const li = document.createElement('li');
    li.innerHTML =
      '<button class="track" data-i="' + i + '">' +
      '<span class="num">' + (i + 1) + '</span>' +
      '<span><strong>' + t.title + '</strong><small>' + t.artist + '</small></span>' +
      '<span class="dur" id="dur-' + i + '">--:--</span></button>';
    els.playlist.appendChild(li);
    // Load each song's duration for the list
    const probe = new Audio();
    probe.preload = 'metadata';
    probe.src = t.src;
    probe.addEventListener('loadedmetadata', () => { $('dur-' + i).textContent = fmt(probe.duration); });
  });
  els.playlist.addEventListener('click', (e) => {
    const btn = e.target.closest('.track');
    if (btn) loadTrack(Number(btn.dataset.i), true);
  });
}

// ---------- Core controls ----------
function loadTrack(i, autoStart) {
  index = (i + tracks.length) % tracks.length;
  const t = tracks[index];
  audio.src = t.src;
  els.title.textContent = t.title;
  els.artist.textContent = t.artist;
  document.documentElement.style.setProperty('--hue', t.hue);
  els.progress.value = 0; setFill(els.progress);
  els.current.textContent = '0:00';
  els.duration.textContent = '0:00';
  document.querySelectorAll('.track').forEach((b, n) => b.classList.toggle('active', n === index));
  if (autoStart) playAudio();
}
function playAudio() { audio.play().catch(() => {}); }
function togglePlay() { audio.paused ? playAudio() : audio.pause(); }
function nextTrack() { loadTrack(index + 1, !audio.paused || audio.ended); }
function prevTrack() {
  if (audio.currentTime > 3) audio.currentTime = 0;   // restart song first
  else loadTrack(index - 1, !audio.paused);
}

// ---------- Audio events ----------
audio.addEventListener('play', () => {
  els.playIcon.setAttribute('href', '#i-pause');
  els.play.setAttribute('aria-label', 'Pause');
  els.disc.classList.add('playing');
});
audio.addEventListener('pause', () => {
  els.playIcon.setAttribute('href', '#i-play');
  els.play.setAttribute('aria-label', 'Play');
  els.disc.classList.remove('playing');
});
audio.addEventListener('loadedmetadata', () => { els.duration.textContent = fmt(audio.duration); });
audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  els.progress.value = (audio.currentTime / audio.duration) * 100;
  setFill(els.progress);
  els.current.textContent = fmt(audio.currentTime);
});
audio.addEventListener('ended', () => {
  if (els.autoplay.checked) loadTrack(index + 1, true);   // autoplay next song
  else { audio.currentTime = 0; }
});

// ---------- Progress bar (seek) ----------
els.progress.addEventListener('input', () => {
  if (audio.duration) audio.currentTime = (els.progress.value / 100) * audio.duration;
  setFill(els.progress);
});

// ---------- Volume ----------
function updateVolumeUI() {
  setFill(els.volume);
  const muted = audio.muted || audio.volume === 0;
  els.volIcon.setAttribute('href', muted ? '#i-mute' : '#i-vol');
  els.mute.setAttribute('aria-label', muted ? 'Unmute' : 'Mute');
}
els.volume.addEventListener('input', () => {
  audio.volume = Number(els.volume.value);
  audio.muted = false;
  updateVolumeUI();
});
els.mute.addEventListener('click', () => { audio.muted = !audio.muted; updateVolumeUI(); });

// ---------- Buttons ----------
els.play.addEventListener('click', togglePlay);
els.next.addEventListener('click', nextTrack);
els.prev.addEventListener('click', prevTrack);

// ---------- Keyboard shortcuts ----------
document.addEventListener('keydown', (e) => {
  const tag = e.target.tagName;
  if (tag === 'INPUT' && e.target.type !== 'range') return;
  const setVol = (v) => { els.volume.value = Math.min(1, Math.max(0, v)); els.volume.dispatchEvent(new Event('input')); };
  switch (e.key) {
    case ' ': if (tag === 'BUTTON') return; e.preventDefault(); togglePlay(); break;
    case 'ArrowRight': if (tag === 'INPUT') return; audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 5); break;
    case 'ArrowLeft': if (tag === 'INPUT') return; audio.currentTime = Math.max(0, audio.currentTime - 5); break;
    case 'ArrowUp': e.preventDefault(); setVol(audio.volume + 0.05); break;
    case 'ArrowDown': e.preventDefault(); setVol(audio.volume - 0.05); break;
    case 'n': case 'N': nextTrack(); break;
    case 'p': case 'P': prevTrack(); break;
    case 'm': case 'M': els.mute.click(); break;
  }
});

// ---------- Start ----------
buildPlaylist();
audio.volume = Number(els.volume.value);
updateVolumeUI();
loadTrack(0, false);
