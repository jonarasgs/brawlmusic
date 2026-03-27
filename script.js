const audio = document.getElementById("audio");
const coverImage = document.getElementById("coverImage");
const nowTitle = document.getElementById("nowTitle");
const nowMeta = document.getElementById("nowMeta");
const searchInput = document.getElementById("searchInput");
const quickPlaylists = document.getElementById("quickPlaylists");
const highlightGrid = document.getElementById("highlightGrid");
const tracksTable = document.getElementById("tracksTable");
const playPauseBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const seekbar = document.getElementById("seekbar");
const volume = document.getElementById("volume");

let allTracks = [];
let allAlbums = [];
let filteredTracks = [];
let currentIndex = -1;

function formatDuration(seconds = 0) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
}

function setNowPlaying(track) {
  coverImage.src = track.cover;
  nowTitle.textContent = track.title;
  nowMeta.textContent = `${track.artist} • ${track.event}`;
}

function playTrackByIndex(index) {
  const track = filteredTracks[index];
  if (!track) return;

  currentIndex = index;
  audio.src = track.file;
  setNowPlaying(track);

  audio
    .play()
    .then(() => {
      playPauseBtn.textContent = "⏸";
    })
    .catch(() => {
      nowMeta.textContent = "Clique no botão ▶ para iniciar.";
    });
}

function renderHighlights() {
  highlightGrid.innerHTML = "";

  allAlbums.forEach((album) => {
    const card = document.createElement("article");
    card.className = "highlight-card";
    card.innerHTML = `
      <h3>${album.title}</h3>
      <p class="muted">${album.event}</p>
      <p>${album.description}</p>
    `;
    card.addEventListener("click", () => {
      searchInput.value = album.event;
      applySearch();
    });
    highlightGrid.appendChild(card);
  });
}

function renderQuickPlaylists() {
  quickPlaylists.innerHTML = "";

  allAlbums.slice(0, 5).forEach((album) => {
    const box = document.createElement("div");
    box.className = "quick-item";
    box.innerHTML = `<strong>${album.event}</strong><br><small>${album.year}</small>`;
    box.addEventListener("click", () => {
      searchInput.value = album.event;
      applySearch();
    });
    quickPlaylists.appendChild(box);
  });
}

function renderTracksTable() {
  tracksTable.innerHTML = "";

  filteredTracks.forEach((track, i) => {
    const row = document.createElement("div");
    row.className = "track-row";
    row.innerHTML = `
      <span>${i + 1}</span>
      <strong>${track.title}</strong>
      <span>${track.artist}</span>
      <span>${formatDuration(track.duration)}</span>
      <button type="button">▶</button>
    `;
    row.querySelector("button").addEventListener("click", () => playTrackByIndex(i));
    tracksTable.appendChild(row);
  });

  if (filteredTracks.length === 0) {
    tracksTable.innerHTML = '<div class="track-row">Nenhuma faixa encontrada.</div>';
  }
}

function applySearch() {
  const query = searchInput.value.trim().toLowerCase();

  filteredTracks = allTracks.filter((track) => {
    return [track.title, track.artist, track.event, track.theme].join(" ").toLowerCase().includes(query);
  });

  renderTracksTable();
}

async function init() {
  try {
    const response = await fetch("data.json");
    if (!response.ok) throw new Error("Erro ao carregar data.json");

    const data = await response.json();
    allTracks = Array.isArray(data.tracks) ? data.tracks : [];
    allAlbums = Array.isArray(data.albums) ? data.albums : [];
    filteredTracks = [...allTracks];

    renderQuickPlaylists();
    renderHighlights();
    renderTracksTable();
  } catch (error) {
    tracksTable.innerHTML = '<div class="track-row">Falha ao carregar data.json.</div>';
    console.error(error);
  }
}

playPauseBtn.addEventListener("click", () => {
  if (!audio.src && filteredTracks.length > 0) {
    playTrackByIndex(0);
    return;
  }

  if (audio.paused) {
    audio.play();
    playPauseBtn.textContent = "⏸";
  } else {
    audio.pause();
    playPauseBtn.textContent = "▶";
  }
});

nextBtn.addEventListener("click", () => {
  if (filteredTracks.length === 0) return;
  const nextIndex = currentIndex < filteredTracks.length - 1 ? currentIndex + 1 : 0;
  playTrackByIndex(nextIndex);
});

prevBtn.addEventListener("click", () => {
  if (filteredTracks.length === 0) return;
  const prevIndex = currentIndex > 0 ? currentIndex - 1 : filteredTracks.length - 1;
  playTrackByIndex(prevIndex);
});

audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  seekbar.value = String((audio.currentTime / audio.duration) * 100);
});

seekbar.addEventListener("input", () => {
  if (!audio.duration) return;
  audio.currentTime = (Number(seekbar.value) / 100) * audio.duration;
});

volume.addEventListener("input", () => {
  audio.volume = Number(volume.value);
});

audio.addEventListener("ended", () => {
  nextBtn.click();
});

searchInput.addEventListener("input", applySearch);

init();
