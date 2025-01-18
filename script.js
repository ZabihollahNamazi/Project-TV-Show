let tvShows = [];

// Function to fetch TV shows
function fetchTvShows() {
  return fetch('https://api.tvmaze.com/shows')
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json(); // Parse and return JSON data
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function filterShows(query) {
  let ulListShow = document.getElementById("ul-list");
  ulListShow.innerHTML = ""; // Clear previous cards

  const filteredShows = tvShows.filter(show => {
    const titleMatch = show.name.toLowerCase().includes(query.toLowerCase());
    const summaryMatch = show.summary.toLowerCase().includes(query.toLowerCase());
    return titleMatch || summaryMatch; // Show if either title or summary matches
  });

  // Recreate the cards for the filtered shows
  createShowCard(filteredShows);
}

function createShowCard(tvShows) {
  let ulListShow = document.getElementById("ul-list");
  ulListShow.innerHTML = ""; // Clear previous cards
  tvShows.forEach((show) => {
    let liList = document.createElement('li');
    liList.classList.add("li-list-cls-show");

    // Title container
    let divTitleShow = document.createElement('div');
    let showTitle = document.createElement("h2");
    showTitle.innerHTML = show.name;
    showTitle.classList.add("h2-title-cls-show");
    divTitleShow.appendChild(showTitle);

    // Container for divOne and divTwo
    let contentContainer = document.createElement('div');
    contentContainer.classList.add("content-container");

    // divOne: Image and Summary
    let divOne = document.createElement('div');
    divOne.classList.add("div-one");
    let showPicture = document.createElement("img");
    showPicture.src = show.image ? show.image.medium : "placeholder.jpg";
    showPicture.alt = `${show.name}`;
    showPicture.classList.add("img-picture-cls-show");
    let showSummary = document.createElement("p");
    showSummary.innerHTML = show.summary;
    showSummary.classList.add("p-summary-cls-show");
    divOne.appendChild(showPicture);
    divOne.appendChild(showSummary);

    // divTwo: Additional Details
    let divTwo = document.createElement('div');
    divTwo.classList.add("div-two");
    let rated = document.createElement("p");
    rated.innerHTML = `Rated: ${show.rating.average || "N/A"}`;
    let genres = document.createElement("p");
    genres.innerHTML = `Genres: ${show.genres.join(", ")}`;
    let status = document.createElement("p");
    status.innerHTML = `Status: ${show.status}`;
    let runTime = document.createElement("p");
    runTime.innerHTML = `Runtime: ${show.runtime || "N/A"} minutes`;
    divTwo.appendChild(rated);
    divTwo.appendChild(genres);
    divTwo.appendChild(status);
    divTwo.appendChild(runTime);

    // Add divOne and divTwo to the content container
    contentContainer.appendChild(divOne);
    contentContainer.appendChild(divTwo);

    // Add everything to the list item
    liList.appendChild(divTitleShow);
    liList.appendChild(contentContainer);

    liList.addEventListener("click", (event) => {
      const selectedShowId = show.id; // Get the selected show ID
      if (selectedShowId !== "default") {
        const selectedShowApi = `https://api.tvmaze.com/shows/${selectedShowId}/episodes`; // Construct the episodes API URL
        console.log(`Fetching episodes from: ${selectedShowApi}`);
        // Fetch and display episodes
        //fetchEpisodes(selectedShowApi);
        displayEpisodes(selectedShowApi);
      }
      });
      
    // Append the list item to the main list
    ulListShow.appendChild(liList);
  });
}

// Add event listener for searching
document.getElementById("search-episode").addEventListener("keyup", (event) => {
  const searchQuery = event.target.value; // Get the search query
  filterShows(searchQuery); // Filter and update the display
});

fetchTvShows().then((data) => {
  if (data) {
    tvShows = data;
    console.log("create show card ", tvShows);
    createShowCard(tvShows);

  }
});

// Populate the dropdown with TV shows
function populateDropdownShows() {
  fetchTvShows().then((data) => {
    if (data) {
      tvShows = data;

      // Reset the dropdown content
      dropDownTvShows.innerHTML = '<option value="default" selected disabled>Select a TV Show</option>';

      // Populate the dropdown with TV shows
      tvShows.forEach((show) => {
        const option = document.createElement("option");
        option.value = show.id; // Use the show's ID for fetching episodes
        option.textContent = show.name; // Display the show's name
        dropDownTvShows.appendChild(option);
      });

      console.log("Dropdown populated with shows:", tvShows);
    }
  });
}

// Add an event listener to the dropdown
const dropDownTvShows = document.querySelector("#show-select");
document.addEventListener("DOMContentLoaded", () => {
  populateDropdownShows(); // Populate the dropdown when the page loads
});

// Add event listener for selecting a TV show
dropDownTvShows.addEventListener("change", (event) => {
  const selectedShowId = event.target.value; // Get the selected show ID
  if (selectedShowId !== "default") {
    const selectedShowApi = `https://api.tvmaze.com/shows/${selectedShowId}/episodes`; // Construct the episodes API URL
    console.log(`Fetching episodes from: ${selectedShowApi}`);

    // Fetch and display episodes
    //fetchEpisodes(selectedShowApi);
    displayEpisodes(selectedShowApi);
  }
});

function displayEpisodes(selectedShowApi){

const state = {
  allEpisodes:[],
  searchTerm:"",
};

function fetchFilms(){
  const ulList = document.getElementById("ul-list");
  if (ulList) ulList.innerHTML = "<p>Loading episodes, please wait...</p>";

  return fetch(`${selectedShowApi}`).then(function (data) {
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
  console.log("fetching films", state);
  setup();
  })

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
  episodePicture.alt = `${item.name}`;
  episodePicture.classList.add("img-picture-cls");

  let episodeSummary = document.createElement("p");
  episodeSummary.innerHTML = item.summary;
  episodeSummary.classList.add("p-summary-cls")

  let source = document.createElement("p");
  source.innerHTML = `<p>Link to this episode  <a href=${item.url} target="_blank" class="episode-link">  TVMaze</a></p>`;
  source.classList.add("p-episode-link");

  liList.setAttribute("id", `S${item.season.toString().padStart(2, "0")}E${item.number.toString().padStart(2, "0")}`)

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

const dropDownEpisode = document.querySelector("#episode-select");
dropDownEpisode.addEventListener("click", () => {
  // Call the function to populate the dropdown
  populateDropdown();
});
 // Function to populate the dropdown
function populateDropdown() {
  dropDownEpisode.innerHTML = '<option value="default" selected disabled>Select an option</option>';

  const eachEpisode = state.allEpisodes;
  console.log("each episode", eachEpisode);
  for (let episode of eachEpisode) {
    const season = episode.season.toString().padStart(2, "0");
    const episodeNumber = episode.number.toString().padStart(2, "0");

    const option = document.createElement("option");
    option.value = `S${season}E${episodeNumber}`;
    option.textContent = `S${season}E${episodeNumber} ${episode.name}`;

    dropDownEpisode.appendChild(option);
  }
}
let dropDownEpi = document.getElementById("episode-select");
dropDownEpi.addEventListener("change", function() {
  const selectedValue = dropDownEpi.value;
  console.log("values", selectedValue);
  if(selectedValue){
    const cardFilm = document.getElementById(selectedValue);
    cardFilm.scrollIntoView({ behavior: 'smooth', block: 'start' });
   }
});
}


//window.onload = setup();