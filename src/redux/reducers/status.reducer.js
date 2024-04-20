import { GLOBALTYPES } from "../types/global.type";

const statusReducer = (state = [], action) => {
    switch (action.type){
        case GLOBALTYPES.GET_USERS_ONLINE:
            return [...state, ...action.payload]
        case GLOBALTYPES.ONLINE:
            return [...state, action.payload]
        case GLOBALTYPES.OFFLINE:
            return state.filter(item => item !== action.payload)
        default:
            return state;
    }
}
export default statusReducer