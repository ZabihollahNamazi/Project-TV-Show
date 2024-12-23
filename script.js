//You can edit ALL of the code here
const allEpisodes = getAllEpisodes();
  const state = {
    allEpisodes,
    searchTerm:""
  }

function setup() {
  
  makePageForEpisodes(state.allEpisodes);
}

function makePageForEpisodes(episodeList) {
  
  let ulList = document.getElementById("ul-list");

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
  bodyUl.innerHTML = "";

  makePageForEpisodes()
})



window.onload = setup;
