import { sortByIdToFirst } from "../../utils/sortToFirst";
import { MESSAGE_TYPES } from "../types/message.type";

const initialState = {
  conversations: [],
  result: 0,
  data: [],
  scrollToBottom: null,
  isLoaded: false,
};

const messageReducer = (state = initialState, action) => {
  switch (action.type) {
    case MESSAGE_TYPES.GET_CONVERSATIONS:
      return {
        ...state,
        conversations: action.payload.conversations.reverse(),
        result: action.payload.result,
        isLoaded: true,
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
    case MESSAGE_TYPES.UPDATE_PARTICIPANTS:
      return {
        ...state,
        conversations: state.conversations.map((cv) => {
          const newCv = cv.id === action.payload.id ?
             { ...cv, participants: action.payload.participants } : cv;
          return newCv;
        }),
      }
    case MESSAGE_TYPES.REMOVE_USER_FROM_CONVERSATION:
      return {
        ...state,
        conversations: state.conversations.map((cv) => {
          const newCv = cv.id === action.payload.id ?
              { ...cv, participants: cv.participants.filter(part => part.user.id !== action.payload.userId) } : cv;
          return newCv;
        }),
      }
    case MESSAGE_TYPES.USER_LEAVE_CONVERSATION:
        return {
          ...state,
          conversations: state.conversations.filter((cv) => cv.id !== action.payload.id),
        }
    case MESSAGE_TYPES.EDIT_MESSAGE:
      return {
        ...state,
        conversations: state.conversations.map((cv) => {
          const newCv = cv.id === action.payload.conversationId && cv.lastMessage.id === action.payload.messageId ?
             { 
              ...cv, 
              lastMessage: { 
                ...cv.lastMessage, 
                text: action.payload.updatedMessage.text, 
                isUpdated: action.payload.updatedMessage.isUpdated, 
                updatedAt: action.payload.updatedMessage.updatedAt
              } 
            } : cv;
          return newCv;
        }),
        data: state.data.map((dt) => {
          const newData =
            parseInt(dt.id) === action.payload.conversationId
              ? {
                  ...dt,
                  data: dt.data.map(item =>
                    item.id === action.payload.messageId ? action.payload.updatedMessage : item
                  )
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
