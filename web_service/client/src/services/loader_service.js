import { authHeader } from "./helper/auth_header";
export const loadService = {
  loadAll,
  loadByCategory,
  loadByQuery
};

const baseUrl = "http://localhost:3000";
function loadAll() {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  };

  return fetch(`${baseUrl}/news`, requestOptions).then(handleResponse);
}

function loadByCategory(category) {
  // TODO: load from different category
  return;
}

function loadByQuery(queryKey) {
  // TODO: load from the search bar
  return;
}

function handleResponse(response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}
