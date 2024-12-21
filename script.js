function setup() {
  const allEpisodes = getAllEpisodes();
  setupSearch(allEpisodes);
  displayEpisodes(allEpisodes);
}

function setupSearch(episodeList) {
  const searchInput = document.getElementById("search-input");
  const searchResult = document.getElementById("search-result");

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filteredEpisodes = episodeList.filter(
      (episode) =>
        episode.name.toLowerCase().includes(query) ||
        episode.summary.toLowerCase().includes(query)
    );

    searchResult.textContent = `Displaying ${filteredEpisodes.length} / ${episodeList.length} episodes`;
    displayEpisodes(filteredEpisodes);
  });
}

function displayEpisodes(episodeList) {
  const ulList = document.getElementById("ul-list");
  ulList.innerHTML = "";

  for (let item in episodeList) {
    let liList = document.createElement("li");
    ulList.appendChild(liList);
    liList.classList.add("li-list-cls");

    let episodeTitle = document.createElement("h2");
    episodeTitle.innerHTML =
      episodeList[item].name +
      `-S${episodeList[item].season
        .toString()
        .padStart(2, "0")}E${episodeList[item].number
        .toString()
        .padStart(2, "0")}`;
    episodeTitle.classList.add("h2-title-cls");

    let episodePicture = document.createElement("img");
    episodePicture.src = episodeList[item].image.medium;
    episodePicture.alt = "Episode Thumbnail";
    episodePicture.classList.add("img-picture-cls");

    let episodeSummary = document.createElement("p");
    episodeSummary.innerHTML = episodeList[item].summary;
    episodeSummary.classList.add("p-summary-cls");

    let source = document.createElement("p");
    source.innerHTML = `<p>Link to this episode <a href=${episodeList[item].url} target="_blank" class="episode-link">TV
