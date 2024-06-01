import { deleteDataAPI, getDataAPI, patchDataAPI, patchFormDataAPI, postDataAPI, postFormDataAPI } from "../../utils/fetchData";
import { GLOBALTYPES } from "../types/global.type";
import { MESSAGE_TYPES } from "../types/message.type";

export const getConversations = ({auth, page = 1}) => async(dispatch) => {
    try {
        const res = await getDataAPI(`conversations`, auth.token, dispatch);
        const conversations = res.data
   
        // loop conversations to get recipient (_id, fullname, username, avatar)
       

        dispatch({
            type: MESSAGE_TYPES.GET_CONVERSATIONS, 
            payload: { conversations, result: conversations.length }
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

export const createConversation = ({ auth, users, navigate }) => async(dispatch) => {
    try {
        const userIds = [];

        users.forEach(user => userIds.push(user.id))
        const res = await postDataAPI(`conversations`, { userIds }, auth.token, dispatch);
        const conversation = res.data

        dispatch({
            type: MESSAGE_TYPES.CREATE_CONVERSATION, 
            payload: conversation 
        })

        dispatch({ type: GLOBALTYPES.MODAL, payload: null })

        return navigate(`/message/${conversation.id}`)
    } catch (err) {
        console.log(err);
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.message}})
    }
}

export const createMessage = ({ auth, conversationId, text = null, photos = [] }) => async(dispatch) => {
    try {
        const formData = new FormData()

        photos.map(photo => formData.append("files", photo));
        formData.append('text', JSON.stringify(text))
        let createMessage;
        if (photos && photos.length > 0) {
            const res = await postFormDataAPI(`messages/${conversationId}`, formData, auth.token, dispatch);
            createMessage = res.data
        } else {
            const res = await postDataAPI(`messages/${conversationId}`, { text }, auth.token, dispatch);
            createMessage = res.data
        }
        const { conversation, ...message } = createMessage

        dispatch({
            type: MESSAGE_TYPES.CREATE_MESSAGE, 
            payload: { id: Number(conversationId), message } 
        })

        dispatch({
            type: MESSAGE_TYPES.UPDATE_SCROLL_TO_BOTTOM, 
            payload: { id: Number(conversationId) } 
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

        dispatch({
            type: MESSAGE_TYPES.UPDATE_NUM_UNREADS, 
            payload: { id: conversationId, unRead: false } 
        })

    } catch (err) {
        console.log(err);
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.message}})
    }
}

export const deleteMessage = ({ auth, conversationId, messageId }) => async(dispatch) => {
    try {
        dispatch({
            type: MESSAGE_TYPES.DELETE_MESSAGE, 
            payload: { conversationId , messageId } 
        })
        
        await deleteDataAPI(`messages/${messageId}`, auth.token, dispatch) 

    } catch (err) {
        console.log(err);
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.message}})
    }
}


export const addMember = ({ auth, users, conversationId }) => async(dispatch) => {
    try {
        const userIds = users.map(user => user.id);
        const res = await postDataAPI(`conversations/invite/${conversationId}`, { userIds }, auth.token, dispatch);

        dispatch({ type: MESSAGE_TYPES.UPDATE_PARTICIPANTS, payload: { id: conversationId, participants: res.data.participants }})
    } catch (error) {
        console.log(error);
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: error.response.data.message}})
    }
}

export const removeUserFromConversation = ({ auth, conversationId, userId }) => async(dispatch) => {
    try {
        await deleteDataAPI(`conversations/${conversationId}/user/${userId}`, auth.token, dispatch);

        dispatch({ type: MESSAGE_TYPES.REMOVE_USER_FROM_CONVERSATION, payload: { id: conversationId, userId }})
    } catch (error) {
        console.log(error);
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: error.response.data.message}})
    }
}

export const updateMessage = ({ auth, conversationId, messageId, updateText }) => async(dispatch) => {
    try {
        const updatedMessage = await patchDataAPI(`messages/${messageId}`, { text: updateText }, auth.token, dispatch)

        dispatch({ type: MESSAGE_TYPES.EDIT_MESSAGE, payload: { conversationId, messageId, updatedMessage: updatedMessage.data }})
    } catch (error) {
        console.log(error);
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: error.response.data.message}})
    }
}