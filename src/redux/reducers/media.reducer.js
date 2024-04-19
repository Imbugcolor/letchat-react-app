import { MEDIATYPES } from "../types/media.type";

const initialState = []

const mediaReducer = (state = initialState, action) => {
    switch (action.type) {
        case MEDIATYPES.GET_MEDIA:
            return [...state, { data: action.payload.data, conversationId: action.payload.id }];
        default:
            return state;
    }
}
export default mediaReducer;