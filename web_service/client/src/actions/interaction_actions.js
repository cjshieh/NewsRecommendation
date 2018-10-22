import { interactionConstants } from "../constants";

export const interActions = {
  toggleDrawer,
  hideDrawer,
  toggleSearchMobie,
  hideSearchMobie
};

function toggleDrawer() {
  return {
    type: interactionConstants.TOGGLE_DRAWER
  };
}

function hideDrawer() {
  return {
    type: interactionConstants.HIDE_DRAWER
  };
}

function toggleSearchMobie() {
  return {
    type: interactionConstants.SHOW_SEARCH_MOBIE
  };
}

function hideSearchMobie() {
  return {
    type: interactionConstants.HIDE_SEARCH_MOBIE
  };
}
