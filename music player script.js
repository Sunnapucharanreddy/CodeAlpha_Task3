const playlist = [
  {
    title: "Vinaraa",
    artist: "Unknown Artist",
    src: "Vinaraa.mp3",
    cover: "cover1.jpg"
  },
  {
    title: "Hridayam Lopala",
    artist: "Unknown Artist",
    src: "[iSongs.info] 02 - Hridayam Lopala.mp3",
    cover: "cover2.jpg"
  }
];

let currentTrackIndex = 0;

const audio = document.getElementById('audio');
const title = document.getElementById('track-title');
const artist = document.getElementById('track-artist');
const cover = document.getElementById('cover');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const currentTimeEl = document.getElementById('current-time');
const totalDurationEl = document.getElementById('total-duration');
const playlistEl = document.getElementById('playlist');

function loadTrack(index) {
  const track = playlist[index];
  title.textContent = track.title;
  artist.textContent = track.artist;
  cover.src = track.cover;
  audio.src = track.src;
  updatePlaylistUI(index);
  pauseCoverRotation();
}

function updatePlaylistUI(activeIndex) {
  const items = playlistEl.querySelectorAll('li');
  items.forEach((el, idx) => {
    el.classList.toggle('active', idx === activeIndex);
  });
}

function playTrack() {
  audio.play();
  playBtn.textContent = '⏸️';
  resumeCoverRotation();
}

function pauseTrack() {
  audio.pause();
  playBtn.textContent = '▶️';
  pauseCoverRotation();
}

function togglePlay() {
  audio.paused ? playTrack() : pauseTrack();
}

function prevTrack() {
  currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
  loadTrack(currentTrackIndex);
  playTrack();
}

function nextTrack() {
  currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
  loadTrack(currentTrackIndex);
  playTrack();
}

function updateProgress() {
  const { duration, currentTime } = audio;
  if (!isNaN(duration)) {
    const percent = (currentTime / duration) * 100;
    progress.style.width = `${percent}%`;
    currentTimeEl.textContent = formatTime(currentTime);
    totalDurationEl.textContent = formatTime(duration);
  }
}

function setProgress(e) {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  if (!isNaN(duration)) {
    audio.currentTime = (clickX / width) * duration;
  }
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${min}:${sec}`;
}

function buildPlaylist() {
  playlist.forEach((track, i) => {
    const li = document.createElement('li');
    li.textContent = `${track.title} - ${track.artist}`;
    li.addEventListener('click', () => {
      currentTrackIndex = i;
      loadTrack(i);
      playTrack();
    });
    playlistEl.appendChild(li);
  });
}

function pauseCoverRotation() {
  cover.style.animationPlayState = 'paused';
}

function resumeCoverRotation() {
  cover.style.animationPlayState = 'running';
}

playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', prevTrack);
nextBtn.addEventListener('click', nextTrack);
audio.addEventListener('timeupdate', updateProgress);
progressContainer.addEventListener('click', setProgress);
audio.addEventListener('ended', nextTrack);

// Init
buildPlaylist();
loadTrack(currentTrackIndex);
