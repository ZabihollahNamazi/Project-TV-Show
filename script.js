
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


//window.onload = setup();