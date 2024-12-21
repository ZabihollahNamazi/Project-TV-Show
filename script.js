// Main setup function called when the page loads
function setup() {
  const allEpisodes = getAllEpisodes(); // Fetch all episodes
  setupSearch(allEpisodes); // Initialize search functionality
  displayEpisodes(allEpisodes); // Display all episodes on the page
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
  for (let item in episodeList) {
    let liList = document.createElement("li");
    ulList.appendChild(liList);
    liList.classList.add("li-list-cls");

    // Create episode title
    let episodeTitle = document.createElement("h2");
    episodeTitle.innerHTML =
      episodeList[item].name +
      ` - S${episodeList[item].season
        .toString()
        .padStart(2, "0")}E${episodeList[item].number
        .toString()
        .padStart(2, "0")}`;
    episodeTitle.classList.add("h2-title-cls");

    // Create episode image
    let episodePicture = document.createElement("img");
    episodePicture.src = episodeList[item].image.medium;
    episodePicture.alt = `Image for ${episodeList[item].name}`;
    episodePicture.classList.add("img-picture-cls");

    // Create episode summary
    let episodeSummary = document.createElement("p");
    episodeSummary.innerHTML = episodeList[item].summary;
    episodeSummary.classList.add("p-summary-cls");

    // Create link to the episode on TVMaze
    let source = document.createElement("p");
    source.innerHTML = `<p>Link to this episode: <a href=${episodeList[item].url} target="_blank" class="episode-link">TVMaze</a></p>`;
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
