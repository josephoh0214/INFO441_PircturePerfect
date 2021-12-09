async function getImages() {
  let query = document.getElementById("queryInput").value;

  let h2 = document.getElementById("search_query");
  query = query.substr(0, 1).toUpperCase() + query.substr(1, query.length);
  h2.innerHTML = `${query}`;

  const images = await getImagesApi(query);
  loadImages(images, "search_results");
}

function loadImages(images, containerId) {
  document.getElementById(containerId).innerHTML = "";
  for (let i = 0; i < images.length; i++) {
    const cardElement = createCardElement(images[i]);
    document.getElementById(containerId).appendChild(cardElement);
  }
}

async function handleFavoriteImage(imageInfo, span) {
  const spanText = span.innerHTML;
  if (spanText === "☆") {
    span.innerHTML = "&#9733;";
    await favoriteImageApi(imageInfo);
  } else {
    span.innerHTML = "&#9734;";
    await unfavoriteImageApi(imageInfo);
  }
}

const createCardElement = (imageInfo) => {
  let container = document.createElement("div");
  container.classList.add("m-2", "p-2", "border", "border-dark", "rounded");
  container.innerHTML = `
    <a href="${imageInfo.url}"><img src="${imageInfo.preview}"></img></a>
    <hr>
  `;
  let favoritesBtn = document.createElement("btn");
  favoritesBtn.type = "button";
  favoritesBtn.classList.add("btn", "btn-warning");
  let favoritesSpan = document.createElement("span");
  favoritesSpan.innerHTML = imageInfo.date ? "&#9733;" : "&#9734;";
  favoritesSpan.style = "font-size:15px;";
  favoritesBtn.appendChild(favoritesSpan);
  favoritesBtn.addEventListener("click", function () {
    handleFavoriteImage(imageInfo, favoritesSpan);
  });
  container.appendChild(favoritesBtn);
  return container;
}

async function loadFavorites() {
  const resp = await favoritesApi();
  if (!resp.status) {
    loadImages(resp.favorites, "favorite_images");
  }
}

async function init() {
  loadIdentity();
  loadFavorites();
}
