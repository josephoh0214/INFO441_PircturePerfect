async function getImages() {
    let query = document.getElementById("queryInput").value;

    let h2 = document.getElementById("search_query");
    query = query.substr(0, 1).toUpperCase() + query.substr(1, query.length);
    h2.innerHTML = `${query}`;

    const images = await getImagesApi(query);
    
    let html = '';
    for (let i = 0; i < images.length; i++) {
      html += `<a href="${images[i].url}"><img src="${images[i].preview}"></img></a>`
    }
    document.getElementById("search_results").innerHTML = html;
}

async function init() {
  loadIdentity();
}

