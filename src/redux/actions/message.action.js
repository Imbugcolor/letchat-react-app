import { getDataAPI, patchDataAPI, patchFormDataAPI, postDataAPI, postFormDataAPI } from "../../utils/fetchData";
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
        const res= await getDataAPI(`messages/${id}?page=${page}&limit=12`, auth.token, dispatch)

        dispatch({type: MESSAGE_TYPES.GET_MESSAGES, payload: {...res.data, data: res.data.data.reverse(), id, page}})
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.message}})
    }
}


export const loadMoreMessages = ({ auth, id, page = 1, limit = 10 }) => async(dispatch) => {
    try {
        const res= await getDataAPI(`messages/${id}?page=${page}&limit=${limit}`, auth.token, dispatch)
    
        dispatch({type: MESSAGE_TYPES.UPDATE_MESSAGES, payload: {...res.data, data: res.data.data.reverse(), id: id, page}})
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.message}})
    }
}

export const createConversation = ({auth, users}) => async(dispatch) => {
    try {
        const userIds = [];

        users.forEach(user => userIds.push(user.id))
        const res = await postDataAPI(`conversations`, { userIds }, auth.token, dispatch);
        const conversation = res.data

        dispatch({
            type: MESSAGE_TYPES.CREATE_CONVERSATION, 
            payload: conversation 
        })
    } catch (err) {
        console.log(err);
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.message}})
    }
}

export const createMessage = ({ auth, conversationId, text = null, photos = [] }) => async(dispatch) => {
    try {
        const formData = new FormData()

        photos.map(photo => formData.append("files", photo));
        formData.append('context', JSON.stringify(text))
        let createMessage;
        if (photos && photos.length > 0) {
            const res = await postFormDataAPI(`messages/${conversationId}`, formData, auth.token, dispatch);
            createMessage = res.data
        } else {
            const res = await postDataAPI(`messages/${conversationId}`, { context: text }, auth.token, dispatch);
            createMessage = res.data
        }
        const { conversation, ...message } = createMessage

        dispatch({
            type: MESSAGE_TYPES.CREATE_MESSAGE, 
            payload: { id: Number(conversationId), message } 
        })

        dispatch({
            type: MESSAGE_TYPES.UPDATE_LAST_MESSAGE,
            payload: { id: Number(conversationId), lastMessage: message, isRead: true }
        })
    } catch (err) {
        console.log(err);
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.message}})
    }
}

export const updateNameConversation = ({ auth, conversationId, name = null }) => async(dispatch) => {
    try {
        await patchDataAPI(`conversations/name/${conversationId}`, { name }, auth.token, dispatch) 

        dispatch({
            type: MESSAGE_TYPES.UPDATE_NAME_CONVERSATION, 
            payload: { id: conversationId, name } 
        })

    } catch (err) {
        console.log(err);
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.message}})
    }
}

export const updateThumbnailConversation = ({ auth, conversationId, image }) => async(dispatch) => {
    try {
        const formData = new FormData()

        formData.append("file", image)

        const res = await patchFormDataAPI(`conversations/thumbnail/${conversationId}`, formData , auth.token, dispatch) 

        dispatch({
            type: MESSAGE_TYPES.UPDATE_THUMBNAIL_CONVERSATION, 
            payload: { id: conversationId, url: res.data } 
        })

    } catch (err) {
        console.log(err);
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.message}})
    }
}

export const readMessage = ({ auth, conversationId }) => async(dispatch) => {
    try {
        const res = await patchDataAPI(`messages/read/${conversationId}`, {} , auth.token, dispatch) 

        dispatch({
            type: MESSAGE_TYPES.READ_MESSAGE, 
            payload: { id: conversationId, message: res.data } 
        })

    } catch (err) {
        console.log(err);
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.message}})
    }
}