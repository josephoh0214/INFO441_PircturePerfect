async function getImages() {
    let query = document.getElementById("queryInput").value;
    const images = await getImagesApi(query);
    let h2 = documemt.getElementById("search_query").innerHTML;
    h2.innerHTML = `<div>${query}</div>`;
    console.log(query)
}

async function init() {
  loadIdentity();
}

