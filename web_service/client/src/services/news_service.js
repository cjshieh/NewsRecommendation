import { authHeader } from "./helper/auth_header";
export const newsService = {
  loadAll,
  loadByCategory,
  loadByPage,
  loadByQuery,
  storeBehaviour
};

const baseUrl = "http://localhost:3000";
function loadAll() {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  };

  return fetch(`${baseUrl}/news`, requestOptions).then(handleResponse);
}

function loadByPage(pageNum) {
  const user = JSON.parse(localStorage.getItem("user"));
  // console.log(user);
  const username = user ? user.username : "";
  const uri = `${baseUrl}/news/userId/${username}/pageNum/${pageNum}`;
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };
  console.log(encodeURI(uri));
  return fetch(encodeURI(uri), requestOptions)
    .then(handleResponse)
    .then(news => {
      if(!news || news.length === 0) {
        return {
          allLoaded: true,
          news: []
        }
      }
      return {
        allLoaded: false,
        news
      }
    });
}

function loadByCategory(category) {
  // TODO: load from different category
  return;
}

function loadByQuery(queryKey) {
  // TODO: load from the search bar
  return;
}

function storeBehaviour(newsId) {
  const user = JSON.parse(localStorage.getItem("user"));
  // console.log(user);
  const username = user ? user.username : "";
  const uri = `${baseUrl}/news/userId/${username}/newsId/${newsId}`;
  const requestOptions = {
    method: "POST",
    headers: authHeader()
  };
  return fetch(encodeURI(uri), requestOptions);
}

function handleResponse(response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }
    // console.log(data);
    return data;
  });
}
