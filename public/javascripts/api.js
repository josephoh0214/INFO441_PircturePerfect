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

async function loadIdentityApi() {
  try {
      let response = await fetch(`/users/getIdentity`);
      let responseJson = await response.json();
      await fetch(`/users`,
        {
            method: "POST",
            body: JSON.stringify({}),
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
    return responseJson;
  } catch (error) {
      return {
          status: "error",
          error: "There was an error: " + error
      };
  }
}

async function logOutApi() {
  try {
      let response = await fetch(`/users/logout`);
      let responseJson = await response.json();
      return responseJson;
  } catch (error) {
      return {
          status: "error",
          error: "There was an error: " + error
      };
  }
}

async function favoritesApi() {
  try {
      let response = await fetch(`/users/favorites`);
      let responseJson = await response.json();
      return responseJson;
  } catch (error) {
      return {
          status: "error",
          error: "There was an error: " + error
      };
  }
}

