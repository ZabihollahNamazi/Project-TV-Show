// Main setup function called when the page loads
function setup() {
  fetchEpisodes() // Fetch episodes dynamically
    .then((allEpisodes) => {
      setupSearch(allEpisodes); // Initialize search functionality
      displayEpisodes(allEpisodes); // Display all episodes on the page
    })
    .catch((error) => {
      showError(error); // Handle and display errors
    });
}

// Fetch episodes from the TVMaze API
async function fetchEpisodes() {
  const url = "https://api.tvmaze.com/shows/82/episodes";

  // Show loading message
  const root = document.getElementById("root");
  root.innerHTML = "<p>Loading episodes, please wait...</p>";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    root.innerHTML = ""; // Clear loading message after data is fetched
    return data;
  } catch (error) {
    throw error;
  }
}

// Handle and display errors
function showError(error) {
  const root = document.getElementById("root");
  root.innerHTML = `<p style="color: red;">Error loading episodes: ${error.message}</p>`;
}

// Sets up the search bar functionality
function setupSearch(episodeList) {
  const searchInput = document.getElementById("search-input");
  const searchResult = document.getElementById("search-result");

  // Listen for user input in the search bar
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();

    // Filter episodes based on the search query
    const filteredEpisodes = episodeList.filter(
      (episode) =>
        episode.name.toLowerCase().includes(query) ||
        episode.summary.toLowerCase().includes(query)
    );

    // Update search result text and display filtered episodes
    searchResult.textContent = `Displaying ${filteredEpisodes.length} / ${episodeList.length} episodes`;
    displayEpisodes(filteredEpisodes);
  });
}

// Displays the list of episodes on the page
function displayEpisodes(episodeList) {
  const ulList = document.getElementById("ul-list");
  ulList.innerHTML = ""; // Clear existing content

  // Iterate through the list of episodes and create elements for each
  for (let episode of episodeList) {
    let liList = document.createElement("li");
    ulList.appendChild(liList);
    liList.classList.add("li-list-cls");

    // Create episode title
    let episodeTitle = document.createElement("h2");
    episodeTitle.innerHTML =
      `${episode.name} - S${episode.season.toString().padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`;
    episodeTitle.classList.add("h2-title-cls");

    // Create episode image
    let episodePicture = document.createElement("img");
    episodePicture.src = episode.image?.medium || "https://via.placeholder.com/210x295";
    episodePicture.alt = `Image for ${episode.name}`;
    episodePicture.classList.add("img-picture-cls");

    // Create episode summary
    let episodeSummary = document.createElement("p");
    episodeSummary.innerHTML = episode.summary || "No summary available.";
    episodeSummary.classList.add("p-summary-cls");

    // Create link to the episode on TVMaze
    let source = document.createElement("p");
    source.innerHTML = `<p>Link to this episode: <a href=${episode.url} target="_blank" class="episode-link">TVMaze</a></p>`;
    source.classList.add("p-episode-link");

    // Append elements to the list item
    liList.appendChild(episodeTitle);
    liList.appendChild(episodePicture);
    liList.appendChild(episodeSummary);
    liList.appendChild(source);
  }
}

// Call the setup function when the page loads
window.onload = setup;
