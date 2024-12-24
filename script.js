<<<<<<< HEAD
//You can edit ALL of the code here
//const allEpisodes = getAllEpisodes();
const state = {
  allEpisodes:[],
  searchTerm:"",
};

function fetchFilms(){
  const ulList = document.getElementById("ul-list");
  if (ulList) ulList.innerHTML = "<p>Loading episodes, please wait...</p>";

  return fetch('https://api.tvmaze.com/shows/82/episodes').then(function (data) {
    if (!data.ok) throw new Error("Network response was not ok");
    return data.json();
  })
  .catch(function (error) {
    console.error("Error fetching episodes:", error);
    // Display an error message
    if (ulList)
      ulList.innerHTML = "<p>Error loading episodes. Please try again later.</p>";
    throw error; // Re-throw to ensure other handlers are aware of the failure
  });
}
fetchFilms().then(function (data){
  state.allEpisodes = data;
  console.log(state);
  setup();
  })
console.log(state);

function setup() {

  makePageForEpisodes(state.allEpisodes);
}

function makePageForEpisodes() {

  let ulList = document.getElementById("ul-list");
  if (ulList) ulList.innerHTML = ""; // Clear the list

  let filteredEpisodes = state.allEpisodes.filter(function(episode){
    return(episode.name.toLowerCase().includes(state.searchTerm.toLowerCase()))
  })

  let cards = filteredEpisodes.map ((item)=> {
    return createFilmCard(item)
  })
  ulList.append(...cards);

  let searchEpisodeLabel = document.querySelector("#search-episode-label");
  searchEpisodeLabel.innerHTML = `Displaying ${filteredEpisodes.length}/${state.allEpisodes.length} episodes`;
}


function createFilmCard(item) {
// You should have an implementation of this function from before.
  let liList = document.createElement('li');
 // ulList.appendChild(liList);
  liList.classList.add("li-list-cls")

  let episodeTitle = document.createElement("h2");
  episodeTitle.innerHTML = item.name + `-S${item.season.toString().padStart(2, "0")}E${item.number.toString().padStart(2, "0")}`;
  episodeTitle.classList.add("h2-title-cls");

  let episodePicture = document.createElement("img");
  episodePicture.src = item.image.medium;
  episodePicture.alt = "Game of Thrones";
  episodePicture.classList.add("img-picture-cls");

  let episodeSummary = document.createElement("p");
  episodeSummary.innerHTML = item.summary;
  episodeSummary.classList.add("p-summary-cls")

  let source = document.createElement("p");
  source.innerHTML = `<p>Link to this episode  <a href=${item.url} target="_blank" class="episode-link">  TVMaze</a></p>`;
  source.classList.add("p-episode-link");

  liList.appendChild(episodeTitle);
  liList.appendChild(episodePicture);
  liList.appendChild(episodeSummary);
  liList.appendChild(source);
  return liList; 
}


let searchEpisode = document.querySelector("#search-episode");
searchEpisode.addEventListener('keyup', ()=> {
  state.searchTerm = searchEpisode.value;
  let bodyUl = document.querySelector("#ul-list");
  if(bodyUl) bodyUl.innerHTML = "";

  makePageForEpisodes()
})

let dropDownEpisode = document.querySelector("#episode-select");

// Populate the dropdown when the page loads or state is ready
function populateDropdown() {
  // Clear any existing options
  dropDownEpisode.innerHTML = '';

  // Loop through each episode in allEpisodes
  for (let i = 0; i < state.allEpisodes.length; i++) {
    let episode = state.allEpisodes[i]; // Accessing the individual episode object
    let season = episode.season.toString().padStart(2, "0");
    let episodeNumber = episode.episode.toString().padStart(2, "0");

    // Create a new option element for each episode
    let option = document.createElement("option");
    option.value = `S${season}E${episodeNumber}`;
    option.innerHTML = `S${season}E${episodeNumber} ${episode.name}`;

    // Append the new option to the dropdown
    dropDownEpisode.appendChild(option);
  }
}

// Call this function when your state is ready
populateDropdown();




//window.onload = setup();

=======
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
>>>>>>> cd4e43373b69447e20751bdf1ae1c1455f1a3a6d
