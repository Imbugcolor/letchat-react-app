import { getDataAPI } from "../../utils/fetchData";
import { GLOBALTYPES } from "../types/global.type";
import { MESSAGE_TYPES } from "../types/message.type";

export const getConversations = ({auth, page = 1}) => async(dispatch) => {
    try {
        const res = await getDataAPI(`conversations`, auth.token, dispatch);
        const conversations = res.data
   
        // loop conversations to get recipient (_id, fullname, username, avatar)
       

        dispatch({
            type: MESSAGE_TYPES.GET_CONVERSATIONS, 
            payload: { conversations, result: 0 }
        })
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.message}})
    }
}

export const getMessages = ({ auth, id, page = 1 }) => async(dispatch) => {
    try {
        const res= await getDataAPI(`messages/${id}?page=${page}`, auth.token, dispatch)

        dispatch({type: MESSAGE_TYPES.GET_MESSAGES, payload: {...res.data, data: res.data.data.reverse(), id, page}})
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.message}})
    }
}


export const loadMoreMessages = ({ auth, id, page = 1 }) => async(dispatch) => {
    try {
        const res= await getDataAPI(`messages/${id}?page=${page}`, auth.token, dispatch)
    
        dispatch({type: MESSAGE_TYPES.UPDATE_MESSAGES, payload: {...res.data, data: res.data.data.reverse(), id: id, page}})
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.message}})
    }
}