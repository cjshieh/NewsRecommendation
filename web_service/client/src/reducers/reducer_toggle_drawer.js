import {interactionConstants} from '../constants';

const initialState = {visible: false};

export default function(state=initialState, action) {
    switch (action.type) {
        case interactionConstants.TOGGLE_DRAWER:
            // const newState = Object.assign({}, state, {
            //     visible: !state.visible
            // });
            // console.log(newState);
            // return newState;
            return {...state, visible: !state.visible };
        case interactionConstants.HIDE_DRAWER:
            // state.visiable = false;
            return initialState;
        default:
            return state;
    }
}