const audio = document.getElementById("audio");
const coverImage = document.getElementById("coverImage");
const nowTitle = document.getElementById("nowTitle");
const nowMeta = document.getElementById("nowMeta");
const statusMessage = document.getElementById("statusMessage");
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

function setStatus(text, isError = false) {
  statusMessage.textContent = text;
  statusMessage.classList.toggle("error", isError);
}

function clearNode(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

function createTextElement(tag, text, className = "") {
  const el = document.createElement(tag);
  el.textContent = text;
  if (className) el.className = className;
  return el;
}

function setNowPlaying(track) {
  coverImage.src = track.cover;
  coverImage.alt = `Capa de ${track.title}`;
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
      setStatus(`Tocando: ${track.title}`);
    })
    .catch(() => {
      setStatus("Clique no botão ▶ para iniciar a reprodução.", true);
    });
}

function renderHighlights() {
  clearNode(highlightGrid);

  allAlbums.forEach((album) => {
    const card = document.createElement("article");
    card.className = "highlight-card";
    card.tabIndex = 0;

    card.appendChild(createTextElement("h3", album.title));
    card.appendChild(createTextElement("p", album.event, "muted"));
    card.appendChild(createTextElement("p", album.description));

    const onChoose = () => {
      searchInput.value = album.event;
      applySearch();
    };

    card.addEventListener("click", onChoose);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onChoose();
      }
    });

    highlightGrid.appendChild(card);
  });
}

function renderQuickPlaylists() {
  clearNode(quickPlaylists);

  allAlbums.slice(0, 5).forEach((album) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quick-item";
    button.textContent = `${album.event} • ${album.year}`;
    button.addEventListener("click", () => {
      searchInput.value = album.event;
      applySearch();
    });
    quickPlaylists.appendChild(button);
  });
}

function renderTracksTable() {
  clearNode(tracksTable);

  if (filteredTracks.length === 0) {
    const empty = document.createElement("div");
    empty.className = "track-row";
    empty.textContent = "Nenhuma faixa encontrada para essa busca.";
    tracksTable.appendChild(empty);
    setStatus("Nenhuma faixa encontrada.", true);
    return;
  }

  filteredTracks.forEach((track, i) => {
    const row = document.createElement("div");
    row.className = "track-row";
    row.setAttribute("role", "listitem");

    row.appendChild(createTextElement("span", String(i + 1)));
    row.appendChild(createTextElement("strong", track.title));
    row.appendChild(createTextElement("span", track.artist));
    row.appendChild(createTextElement("span", formatDuration(track.duration)));

    const playBtn = document.createElement("button");
    playBtn.type = "button";
    playBtn.textContent = "▶";
    playBtn.setAttribute("aria-label", `Tocar ${track.title}`);
    playBtn.addEventListener("click", () => playTrackByIndex(i));
    row.appendChild(playBtn);

    tracksTable.appendChild(row);
  });

  setStatus(`${filteredTracks.length} faixa(s) disponível(is).`);
}

function applySearch() {
  const query = searchInput.value.trim().toLowerCase();

  filteredTracks = allTracks.filter((track) => {
    return [track.title, track.artist, track.event, track.theme].join(" ").toLowerCase().includes(query);
  });

  currentIndex = -1;
  renderTracksTable();
}

async function init() {
  try {
    setStatus("Carregando catálogo...");
    const response = await fetch("data.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Erro ao carregar data.json");

    const data = await response.json();
    allTracks = Array.isArray(data.tracks) ? data.tracks : [];
    allAlbums = Array.isArray(data.albums) ? data.albums : [];
    filteredTracks = [...allTracks];

    renderQuickPlaylists();
    renderHighlights();
    renderTracksTable();
  } catch (error) {
    setStatus("Falha ao carregar o catálogo. Tente atualizar a página.", true);
    clearNode(tracksTable);
    const errorRow = document.createElement("div");
    errorRow.className = "track-row";
    errorRow.textContent = "Não foi possível carregar data.json.";
    tracksTable.appendChild(errorRow);
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
