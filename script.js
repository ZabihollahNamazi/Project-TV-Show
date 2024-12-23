// Cache for shows and episodes to minimize API requests
const showCache = {};

function setup() {
  // Fetch and display the list of TV shows
  fetchShows();

  // Add event listener for search input
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", () => filterEpisodes());
}

// Fetch the list of TV shows
function fetchShows() {
  const showSelect = document.getElementById("show-select");

  // Show loading message in the dropdown
  showSelect.innerHTML = "<option value=''>Loading shows...</option>";

  fetch("https://api.tvmaze.com/shows")
    .then((response) => {
      if (!response.ok) throw new Error("Failed to fetch shows");
      return response.json();
    })
    .then((shows) => {
      // Sort shows alphabetically (case-insensitive)
      shows.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

      // Populate dropdown
      shows.forEach((show) => {
        const option = document.createElement("option");
        option.value = show.id;
        option.textContent = show.name;
        showSelect.appendChild(option);

        // Cache show data
        showCache[show.id] = show;
      });

      // Add event listener for show selection
      showSelect.addEventListener("change", (event) => {
        const showId = event.target.value;
        if (showId) fetchEpisodesForShow(showId);
      });
    })
    .catch((error) => {
      console.error("Error fetching shows:", error);
      showSelect.innerHTML = "<option value=''>Error loading shows</option>";
    });
}

// Fetch episodes for a specific show
function fetchEpisodesForShow(showId) {
  const ulList = document.getElementById("ul-list");
  const episodeSelect = document.getElementById("episode-select");

  if (showCache[showId]?.episodes) {
    // Use cached episodes if available
    displayEpisodes(showCache[showId].episodes);
    populateDropdown(showCache[showId].episodes);
    return;
  }

  // Show loading message
  ulList.innerHTML = "<li>Loading episodes...</li>";
  episodeSelect.innerHTML = "<option value=''>Loading episodes...</option>";

  fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
    .then((response) => {
      if (!response.ok) throw new Error("Failed to fetch episodes");
      return response.json();
    })
    .then((episodes) => {
      // Cache episodes
      showCache[showId].episodes = episodes;

      // Update UI
      displayEpisodes(episodes);
      populateDropdown(episodes);
    })
    .catch((error) => {
      console.error("Error fetching episodes:", error);
      ulList.innerHTML = "<li>Error loading episodes. Please try again later.</li>";
      episodeSelect.innerHTML = "<option value=''>Error loading episodes</option>";
    });
}

// Populate episode dropdown
function populateDropdown(episodes) {
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

  // Add event listener for episode selection
  episodeSelect.addEventListener("change", (event) => {
    const selectedEpisode = episodes[event.target.value];
    if (selectedEpisode) {
      document.getElementById("search-result").textContent = `Displaying: ${selectedEpisode.name}`;
      displayEpisodes([selectedEpisode]);
    }
  });
}

// Display episodes on the page
function displayEpisodes(episodes) {
  const ulList = document.getElementById("ul-list");
  ulList.innerHTML = ""; // Clear existing episodes

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
    img.classList.add("img-picture-cls");

    const summary = document.createElement("p");
    summary.innerHTML = episode.summary || "No summary available.";
    summary.classList.add("p-summary-cls");

    const linkContainer = document.createElement("p");
    linkContainer.classList.add("p-episode-link");
    linkContainer.innerHTML = `Link to this episode: <a href="${episode.url}" target="_blank" class="episode-link">TVMaze</a>`;

    li.appendChild(title);
    li.appendChild(img);
    li.appendChild(summary);
    li.appendChild(linkContainer);
    ulList.appendChild(li);
  });
}

// Filter episodes by search term
function filterEpisodes() {
  const searchInput = document.getElementById("search-input").value.toLowerCase();
  const showSelect = document.getElementById("show-select");
  const showId = showSelect.value;

  if (!showId || !showCache[showId]?.episodes) return;

  const filteredEpisodes = showCache[showId].episodes.filter((episode) =>
    episode.name.toLowerCase().includes(searchInput)
  );

  displayEpisodes(filteredEpisodes);
  document.getElementById("search-result").textContent = filteredEpisodes.length
    ? `Displaying ${filteredEpisodes.length} episode(s)`
    : "No episodes found.";
}

// Initialize the application on page load
window.onload = setup;
