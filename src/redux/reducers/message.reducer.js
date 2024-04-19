import { sortByIdToFirst } from "../../utils/sortToFirst";
import { MESSAGE_TYPES } from "../types/message.type";

const initialState = {
  conversations: [],
  result: 0,
  data: [],
  firstLoad: false,
  scrollToBottom: null,
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
             { ...cv, lastMessage: action.payload.lastMessage, isRead: action.payload.isRead } : cv;
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
    case MESSAGE_TYPES.UPDATE_SCROLL_TO_BOTTOM:
      return {
        ...state,
        scrollToBottom: action.payload.id
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
        conversations: sortByIdToFirst(state.conversations, action.payload.id),
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
        newMessage: action.payload.newMessage,
      };
    case MESSAGE_TYPES.READ_MESSAGE:
      return {
        ...state,
        conversations: state.conversations.map((cv) => {
          const newCv = cv.id === action.payload.id ?
             { ...cv, isRead: true, lastMessage: action.payload.message } : cv;
          return newCv;
        }),
      };
    case MESSAGE_TYPES.UPDATE_NUM_UNREADS:
      return {
        ...state,
        conversations: state.conversations.map((cv) => {
          const newCv = cv.id === action.payload.id ?
              { ...cv, numUnReads: action.payload.unRead ? cv.numUnReads + 1 : 0 } : cv;
          return newCv;
        }),
      };
    case MESSAGE_TYPES.DELETE_MESSAGE:
      return {
        ...state,
        data: state.data.map((dt) => {
          if (parseInt(dt.id) === action.payload.conversationId) {
            return {...dt, data: dt.data.filter((message) => message.id !== action.payload.messageId)}
          }
          return dt;
        }),
      };
    default:
      return state;
  }
};

export default messageReducer;
