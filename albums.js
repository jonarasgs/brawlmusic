const filterHost = document.getElementById("filters");
const albumGrid = document.getElementById("albumGrid");

let albumData = [];

function renderFilters(activeCategory = "Todos") {
  filterHost.innerHTML = "";
  const categories = ["Todos", ...new Set(albumData.map((item) => item.event))];

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `filter-btn ${category === activeCategory ? "active" : ""}`;
    button.textContent = category;
    button.addEventListener("click", () => {
      renderFilters(category);
      renderAlbums(category);
    });
    filterHost.appendChild(button);
  });
}

function renderAlbums(filter = "Todos") {
  albumGrid.innerHTML = "";
  const filteredData =
    filter === "Todos" ? albumData : albumData.filter((item) => item.event === filter);

  filteredData.forEach((album) => {
    const card = document.createElement("article");
    card.className = "album-card";
    card.innerHTML = `
      <span class="album-tag">${album.event}</span>
      <h3>${album.title}</h3>
      <p><strong>Período:</strong> ${album.year}</p>
      <p>${album.description}</p>
    `;
    albumGrid.appendChild(card);
  });
}

async function loadAlbumsFromJson() {
  try {
    const response = await fetch("data.json");
    if (!response.ok) {
      throw new Error(`Erro ao carregar JSON: ${response.status}`);
    }

    const data = await response.json();
    albumData = Array.isArray(data.albums) ? data.albums : [];

    if (albumData.length === 0) {
      albumGrid.innerHTML = "<p>Nenhum álbum/evento encontrado no data.json.</p>";
      return;
    }

    renderFilters();
    renderAlbums();
  } catch (error) {
    albumGrid.innerHTML = "<p>Falha ao carregar data.json. Rode com servidor local.</p>";
    console.error(error);
  }
}

loadAlbumsFromJson();
