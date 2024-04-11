import { GLOBALTYPES } from "../types/global.type";

const socketReducer = (state = null, action) => {
    switch (action.type){
        case GLOBALTYPES.SOCKET:
            return action.payload;
        default:
            return state;
    }
}
export default socketReducer