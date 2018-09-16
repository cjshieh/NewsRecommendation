const initialState = {visible: false};

export default function(state=initialState, action) {
    switch (action.type) {
        case 'toggle_drawer':
            // const newState = Object.assign({}, state, {
            //     visible: !state.visible
            // });
            // console.log(newState);
            // return newState;
            return {...state, visible: !state.visible };
        case 'hide_drawer':
            // state.visiable = false;
            return initialState;
        default:
            return state;
    }
}