// Main setup function called when the page loads
function setup() {
  // Fetch episodes from the API and display them
  fetchEpisodes();
}

// Fetch episodes from the TVMaze API
function fetchEpisodes() {
  const ulList = document.getElementById("ul-list"); // Root element for displaying episodes
  const episodeSelect = document.getElementById("episode-select"); // Dropdown for jumping to episodes

  if (!ulList || !episodeSelect) {
    console.error("Error: 'ul-list' or 'episode-select' element not found.");
    return;
  }

  // Show loading message while fetching data
  ulList.innerHTML = "<li>Loading episodes...</li>";
  episodeSelect.innerHTML = "<option value=''>Loading episodes...</option>"; // Show loading message in dropdown

  // Fetch data from TVMaze API
  fetch("https://api.tvmaze.com/shows/82/episodes")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch episodes from API.");
      }
      return response.json();
    })
    .then((episodes) => {
      if (episodes.length > 0) {
        // Populate the dropdown and display episodes
        populateDropdown(episodes);
        displayEpisodes(episodes);
      } else {
        // Handle the case where no episodes are returned
        ulList.innerHTML = "<li>No episodes available at the moment.</li>";
      }
    })
    .catch((error) => {
      // Handle any fetch or network errors
      console.error("Error fetching episodes:", error);
      ulList.innerHTML = "<li>Error loading episodes. Please try again later.</li>";
      episodeSelect.innerHTML = "<option value=''>Error loading episodes</option>"; // Update dropdown on error
    });
}

// Populates the dropdown with episode options
function populateDropdown(episodes) {
  const episodeSelect = document.getElementById("episode-select");

  // Clear previous options
  episodeSelect.innerHTML = "<option value=''>Select an episode...</option>"; // Reset dropdown

  // Add an option for each episode
  episodes.forEach((episode, index) => {
    const option = document.createElement("option");
    option.value = index; // Store the episode index as the value
    option.textContent = `${episode.name} - S${String(episode.season).padStart(2, "0")}E${String(
      episode.number
    ).padStart(2, "0")}`;
    episodeSelect.appendChild(option);
  });
}

// Displays the list of episodes on the page
function displayEpisodes(episodes) {
  const ulList = document.getElementById("ul-list");
  ulList.innerHTML = ""; // Clear any existing content

  episodes.forEach((episode) => {
    // Create list item for each episode
    const li = document.createElement("li");
    li.classList.add("li-list-cls");

    // Create episode title
    const title = document.createElement("h2");
    title.textContent = `${episode.name} - S${String(episode.season).padStart(2, "0")}E${String(
      episode.number
    ).padStart(2, "0")}`;
    title.classList.add("h2-title-cls");

    // Create episode image
    const img = document.createElement("img");
    img.src = episode.image ? episode.image.medium : "https://via.placeholder.com/250";
    img.alt = `Image for ${episode.name}`;
    img.classList.add("img-picture-cls");

    // Create episode summary
    const summary = document.createElement("p");
    summary.innerHTML = episode.summary || "No summary available.";
    summary.classList.add("p-summary-cls");

    // Create link to TVMaze episode
    const linkContainer = document.createElement("p");
    linkContainer.classList.add("p-episode-link");
    linkContainer.innerHTML = `Link to this episode: <a href="${episode.url}" target="_blank" class="episode-link">TVMaze</a>`;

    // Append elements to the list item
    li.appendChild(title);
    li.appendChild(img);
    li.appendChild(summary);
    li.appendChild(linkContainer);

    // Append list item to the unordered list
    ulList.appendChild(li);
  });
}

// Call the setup function when the page loads
window.onload = setup;
