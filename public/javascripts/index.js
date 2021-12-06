async function getImages() {
    let query = document.getElementById("queryInput").value;
    const images = await getImagesApi(query);
}

async function init() {
  loadIdentity();
}
