import { MESSAGE_TYPES } from "../types/message.type";

const initialState = {
  conversations: [],
  result: 0,
  data: [],
  firstLoad: false,
};

const messageReducer = (state = initialState, action) => {
  switch (action.type) {
    case MESSAGE_TYPES.GET_CONVERSATIONS:
      return {
        ...state,
        conversations: action.payload.conversations,
        result: action.payload.result,
        firstLoad: true,
      };
    case MESSAGE_TYPES.GET_MESSAGES:
      return {
        ...state,
        data: [...state.data, action.payload],
      };
    case MESSAGE_TYPES.UPDATE_MESSAGES:
        return {
          ...state,
          data: state.data.map(dt => {
            const newData = dt.id === action.payload.id ? {...action.payload, data: [...action.payload.data, ...dt.data]} : dt;
            return newData;
          }),
        };
    default:
      return state;
  }
};

export default messageReducer;
