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
        conversations: action.payload.conversations.reverse(),
        result: action.payload.result,
        firstLoad: true,
      };
    case MESSAGE_TYPES.CREATE_CONVERSATION:
      return {
        ...state,
        conversations: [action.payload, ...state.conversations],
      };
    case MESSAGE_TYPES.UPDATE_LAST_MESSAGE:
      return {
        ...state,
        conversations: state.conversations.map((cv) => {
          const newCv = cv.id === action.payload.id ?
             { ...cv, lastMessage: action.payload.lastMessage } : cv;
          return newCv;
        }),
      };
    case MESSAGE_TYPES.UPDATE_NAME_CONVERSATION:
      return {
        ...state,
        conversations: state.conversations.map((cv) => {
          const newCv = cv.id === action.payload.id ?
              { ...cv, name: action.payload.name } : cv;
          return newCv;
        }),
      };
    case MESSAGE_TYPES.UPDATE_THUMBNAIL_CONVERSATION:
      return {
        ...state,
        conversations: state.conversations.map((cv) => {
          const newCv = cv.id === action.payload.id ?
              { ...cv, thumbnail: action.payload.url } : cv;
          return newCv;
        }),
      };
    case MESSAGE_TYPES.GET_MESSAGES:
      return {
        ...state,
        data: [...state.data, action.payload],
      };
    case MESSAGE_TYPES.UPDATE_MESSAGES:
      return {
        ...state,
        data: state.data.map((dt) => {
          const newData =
            dt.id === action.payload.id
              ? {
                  ...action.payload,
                  data: [...action.payload.data, ...dt.data.filter(itemDt => !action.payload.data.some(itemPayload => itemPayload.id === itemDt.id))],
                }
              : dt;
          return newData;
        }),
      };
    case MESSAGE_TYPES.CREATE_MESSAGE:
      return {
        ...state,
        data: state.data.map((dt) => {
          const cvId = parseInt(dt.id);
          const newData =
            cvId === action.payload.id
              ? {
                  ...dt,
                  limit: dt.limit + 1,
                  data: [...dt.data, action.payload.message],
                }
              : dt;
          return newData;
        }),
      };
    default:
      return state;
  }
};

export default messageReducer;
