const showCache = {};

// Setup function called on page load
function setup() {
  fetchShows();
}

// Fetch list of shows from TVMaze API
function fetchShows() {
  const showSelect = document.getElementById("show-select");
  if (!showSelect) return;

  fetch("https://api.tvmaze.com/shows")
    .then((response) => {
      if (!response.ok) throw new Error("Failed to fetch shows");
      return response.json();
    })
    .then((shows) => {
      shows.sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
      populateShowDropdown(shows);
    })
    .catch((error) => {
      console.error("Error fetching shows:", error);
      showSelect.innerHTML = "<option value=''>Error loading shows</option>";
    });
}

// Populate the dropdown with shows
function populateShowDropdown(shows) {
  const showSelect = document.getElementById("show-select");
  showSelect.innerHTML = "<option value=''>Select a show...</option>";

  shows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    showCache[show.id] = { show };
    showSelect.appendChild(option);
  });

  showSelect.addEventListener("change", (e) => {
    const showId = e.target.value;
    if (showId) fetchEpisodesForShow(showId);
  });
}

// Fetch episodes for a specific show
function fetchEpisodesForShow(showId) {
  const ulList = document.getElementById("ul-list");
  const episodeSelect = document.getElementById("episode-select");
  const searchResult = document.getElementById("search-result");

  if (showCache[showId]?.episodes) {
    displayEpisodes(showCache[showId].episodes);
    populateEpisodeDropdown(showCache[showId].episodes);
    searchResult.textContent = "Displaying all episodes";
    return;
  }

  ulList.innerHTML = "<li>Loading episodes...</li>";
  episodeSelect.innerHTML = "<option value=''>Loading episodes...</option>";

  fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
    .then((response) => {
      if (!response.ok) throw new Error("Failed to fetch episodes");
      return response.json();
    })
    .then((episodes) => {
      showCache[showId].episodes = episodes;
      displayEpisodes(episodes);
      populateEpisodeDropdown(episodes);
      searchResult.textContent = "Displaying all episodes";
    })
    .catch((error) => {
      console.error("Error fetching episodes:", error);
      ulList.innerHTML = "<li>Error loading episodes. Please try again later.</li>";
    });
}

// Populate the episode dropdown
function populateEpisodeDropdown(episodes) {
  const episodeSelect = document.getElementById("episode-select");
  episodeSelect.innerHTML = "<option value=''>Select an episode...</option>";

  episodes.forEach((episode, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${episode.name} - S${String(episode.season).padStart(2, "0")}E${String(
      episode.number
    ).padStart(2, "0")}`;
    episodeSelect.appendChild(option);
  });
}

// Display episodes as cards
function displayEpisodes(episodes) {
  const ulList = document.getElementById("ul-list");
  ulList.innerHTML = "";

  episodes.forEach((episode) => {
    const li = document.createElement("li");
    li.classList.add("li-list-cls");

    const title = document.createElement("h2");
    title.textContent = `${episode.name} - S${String(episode.season).padStart(2, "0")}E${String(
      episode.number
    ).padStart(2, "0")}`;
    title.classList.add("h2-title-cls");

    const img = document.createElement("img");
    img.src = episode.image ? episode.image.medium : "https://via.placeholder.com/250";
    img.alt = `Image for ${episode.name}`;
    img.class
