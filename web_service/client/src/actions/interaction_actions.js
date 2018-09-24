import {interactionConstants} from '../constants';

export const interActions = {
    toggleDrawer,
    hideDrawer
}; 

function toggleDrawer() {
    return {
        type: interactionConstants.TOGGLE_DRAWER
    }
}

function hideDrawer() {
    return {
        type: interactionConstants.HIDE_DRAWER
    }
}