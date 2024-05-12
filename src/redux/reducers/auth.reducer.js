import { GLOBALTYPES } from "../types/global.type";
const initialState = {}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case GLOBALTYPES.AUTH:
            return {
                ...action.payload,
                isLogged: true
            };
        case GLOBALTYPES.UPDATE_TOKEN:
            return {
                ...state,
                token: action.payload
            };
        case GLOBALTYPES.VERIFY:
            return {
                ...action.payload,
            };
        case GLOBALTYPES.UPDATE_PROFILE:
            return {
                ...state,
                user: { ...state.user, ...action.payload.data },
            };
        case GLOBALTYPES.UPDATE_PHOTO_PROFILE:
            return {
            ...state,
            user: { ...state.user, avatar: action.payload.url },
        };
        default:
            return state;
    }
}
export default authReducer;