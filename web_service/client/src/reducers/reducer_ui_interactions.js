import { interactionConstants } from "../constants";

const initialState = { drawer_visible: false, search_form_visible: false };

export function interaction(state = initialState, action) {
  switch (action.type) {
    case interactionConstants.TOGGLE_DRAWER:
      return { ...state, drawer_visible: !state.drawer_visible };
    case interactionConstants.HIDE_DRAWER:
      return { ...state, drawer_visible: false };
    case interactionConstants.SHOW_SEARCH_MOBIE:
      return { ...state, search_form_visible: !state.search_form_visible  };
    case interactionConstants.HIDE_SEARCH_MOBIE:
      return { ...state, search_form_visible: false };
    default:
      return state;
  }
}
