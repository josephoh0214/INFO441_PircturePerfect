let myIdentity = undefined;

const escapeHTML = str => str.replace(/[&<>'"]/g,
  tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag]));



async function loadIdentity(){
    let identityInfo = await loadIdentityApi();
    let identity_div = document.getElementById("identity_div");
    if(identityInfo.status == "error"){
        myIdentity = undefined;
        identity_div.innerHTML = `<div>
        <button onclick="loadIdentity()">retry</button>
        Error loading identity: <span id="identity_error_span"></span>
        </div>`;
    } else if(identityInfo.status == "loggedin"){
        myIdentity = identityInfo.userInfo.username;
        identity_div.innerHTML = `
        <a href="/userInfo.html?user=${encodeURIComponent(identityInfo.userInfo.username)}">${identityInfo.userInfo.name} (${identityInfo.userInfo.username})</a>
        <a href="signout" class="btn btn-danger" role="button">Log out</a>`;
    } else { //loggedout
        myIdentity = undefined;
        identity_div.innerHTML = `
        <a href="signin" class="btn btn-primary" role="button">Log in</a>`;
    }
}
