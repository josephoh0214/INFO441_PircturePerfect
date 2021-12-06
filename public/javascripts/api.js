const apiVersion = 'v1';

async function getImagesApi(query){
    try{
        let unsplashResponse = await fetch(`api/${apiVersion}/imagesUnsplash?term=${query}`);
        let unsplashImages = await unsplashResponse.json();
        let pexelResponse = await fetch(`api/${apiVersion}/imagesPexel?term=${query}`);
        let pexelImages = await pexelResponse.json();
        let responseJson = await response.json();
        return responseJson;
    }catch(error){
        return {
            status: "error",
            error: "There was an error: " + error
        };
    }
}