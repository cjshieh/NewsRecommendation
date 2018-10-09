import { authHeader } from "./helper/auth_header";
import { newsClass } from "../constants";

export const newsService = {
  loadNewsByDefault,
  loadByCategory,
  loadByPageForUser,
  loadByQuery,
  storeBehaviour
};

const baseUrl = "http://localhost:3000";
function loadNewsByDefault() {
  const uri = `${baseUrl}/news/default`;
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: 'no-cache'
  };
  const request = new Request(encodeURI(uri), requestOptions);
  return fetch(request)
    .then(handleResponse)
    .then(news => {
      return {
        class: newsClass.DEFAULT,
        news
      };
    });
}

function loadByPageForUser(pageNum) {
  const user = JSON.parse(localStorage.getItem("user"));
  // console.log(user);
  const username = user ? user.username : "";
  const uri = `${baseUrl}/news/userId/${username}/pageNum/${pageNum}`;
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
    cache: 'no-cache'
  };
  const request = new Request(encodeURI(uri), requestOptions);
  return fetch(request)
    .then(handleResponse)
    .then(news => {
      if (!news || news.length === 0) {
        return {
          class: newsClass.USER,
          allLoaded: true,
          news: []
        };
      }
      return {
        class: newsClass.USER,
        allLoaded: false,
        news
      };
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
    return data.result;
  });
}
