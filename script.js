const playlistEl = document.getElementById("playlist");
const audioPlayer = document.getElementById("audioPlayer");
const coverEl = document.getElementById("cover");
const trackTitleEl = document.getElementById("trackTitle");
const trackThemeEl = document.getElementById("trackTheme");
const randomTrackBtn = document.getElementById("randomTrackBtn");

let tracks = [];

function playTrack(track) {
  audioPlayer.src = track.file;
  coverEl.src = track.cover;
  trackTitleEl.textContent = track.title;
  trackThemeEl.textContent = track.theme;

  audioPlayer
    .play()
    .catch(() => {
      trackThemeEl.textContent = "Navegador bloqueou autoplay. Clique no play 🎵";
    });
}

function renderPlaylist() {
  playlistEl.innerHTML = "";

  tracks.forEach((track) => {
    const wrapper = document.createElement("article");
    wrapper.className = "playlist-item";

    const text = document.createElement("div");
    text.innerHTML = `<strong>${track.title}</strong><br><small>${track.theme}</small>`;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "Tocar";
    btn.addEventListener("click", () => playTrack(track));

    wrapper.append(text, btn);
    playlistEl.appendChild(wrapper);
  });
}

async function loadTracksFromJson() {
  try {
    const response = await fetch("data.json");
    if (!response.ok) {
      throw new Error(`Erro ao carregar JSON: ${response.status}`);
    }

    const data = await response.json();
    tracks = Array.isArray(data.tracks) ? data.tracks : [];

    if (tracks.length === 0) {
      trackThemeEl.textContent = "Nenhuma faixa encontrada no data.json";
      return;
    }

    renderPlaylist();
  } catch (error) {
    trackThemeEl.textContent = "Falha ao carregar data.json. Rode com servidor local.";
    console.error(error);
  }
}

randomTrackBtn.addEventListener("click", () => {
  if (tracks.length === 0) return;
  const randomIndex = Math.floor(Math.random() * tracks.length);
  playTrack(tracks[randomIndex]);
});

loadTracksFromJson();
