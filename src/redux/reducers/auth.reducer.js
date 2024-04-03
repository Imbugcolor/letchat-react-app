import { GLOBALTYPES } from "../types/global.type";

const initialState = {}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case GLOBALTYPES.AUTH:
            return {
                ...action.payload,
                isLogged: true
            };
        default:
            return state;
    }
}
export default authReducer;