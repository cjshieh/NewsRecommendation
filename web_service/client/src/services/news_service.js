import { authHeader } from "./helper/auth_header";
import { newsClass } from "../constants";

export const newsService = {
  loadNewsByDefault,
  loadByCategory,
  loadByPageForUser,
  loadBySearchKey,
  storeBehaviour
};

// const baseUrl = "http://localhost:3000";
async function loadNewsByDefault() {
  const uri = `/news/default`;
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: 'no-cache'
  };
  const request = new Request(encodeURI(uri), requestOptions);
  const response = await fetch(request);
  const news = await handleResponse(response);
  return {
    class: newsClass.DEFAULT,
    news
  };
}

async function loadByPageForUser(pageNum) {
  const user = JSON.parse(localStorage.getItem("user"));
  // console.log(user);
  const username = user ? user.username : "";
  const uri = `/news/userId/${username}/pageNum/${pageNum}`;
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
    cache: 'no-cache'
  };
  const request = new Request(encodeURI(uri), requestOptions);
  const response = await fetch(request);
  const news = await handleResponse(response);
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
}

function loadByCategory(category) {
  // TODO: load from different category
  return;
}

async function loadBySearchKey(queryKey, pageNum) {
  const spaceless = queryKey.trim();
  // Normalized text without any punctuation and extra spaces betwen words
  const punctuationless = spaceless.replace(/^[.,/#!$%^&*;:{}=\-_`~()]/g,"");
  console.log(punctuationless);
  const finalQuery= punctuationless.replace(/\s{2,}/g," ");
  if(finalQuery.length === 0) {
    return;
  }
  
  const uri = `/news/search/q/${finalQuery}/pageNum/${pageNum}`;
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: 'no-cache'
  };
  const request = new Request(encodeURI(uri), requestOptions);
  const response = await fetch(request);
  const news = await handleResponse(response);
  return {
    class: newsClass.SEARCH,
    allLoaded: news.length === 0,
    news
  };
}

function storeBehaviour(newsId) {
  const user = JSON.parse(localStorage.getItem("user"));
  // console.log(user);
  const username = user ? user.username : "";
  const uri = `/news/userId/${username}/newsId/${newsId}`;
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
    return data.result;
  });
}
