import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MESSAGE_TYPES } from "./redux/types/message.type";
import { GLOBALTYPES } from "./redux/types/global.type";

const SocketClient = () => {
  const auth = useSelector((state) => state.auth);
  const socket = useSelector((state) => state.socket);

  const dispatch = useDispatch()

  //Message
  useEffect(() => {

    socket.on("newMessage", (message) => {
        dispatch({ type: MESSAGE_TYPES.CREATE_MESSAGE, payload: { id: message.conversation.id, message } });

        dispatch({
          type: MESSAGE_TYPES.UPDATE_SCROLL_TO_BOTTOM,
          payload: { id: message.conversation.id }
        })

        dispatch({
          type: MESSAGE_TYPES.UPDATE_LAST_MESSAGE,
          payload: { id: message.conversation.id, lastMessage: message, isRead: false }
        })

        dispatch({ type: MESSAGE_TYPES.UPDATE_NUM_UNREADS, payload: { id: message.conversation.id, unRead: true } })
    });

    return () => socket.off("newMessage");
    
  }, [socket, dispatch]);

  useEffect(() => {
    socket.on("updateMessage", (message) => {
      console.log(message.conversation.id)
      dispatch({ type: MESSAGE_TYPES.EDIT_MESSAGE, payload: { conversationId: message.conversation.id, messageId: message.id, updatedMessage: message } });
    })
  
  return () => socket.off("updateMessage");
  
  }, [socket, dispatch]);

  useEffect(() => {

    socket.on("readMessage", (message) => {
      dispatch({
        type: MESSAGE_TYPES.READ_MESSAGE, 
        payload: { id: message.conversation.id, message } 
      })

      dispatch({
        type: MESSAGE_TYPES.UPDATE_SCROLL_TO_BOTTOM,
        payload: { id: message.conversation.id }
      })
    });

    return () => socket.off("readMessage");
    
  }, [socket, dispatch]);

  useEffect(() => {

    socket.on("deleteMessage", (message) => {
      dispatch({
        type: MESSAGE_TYPES.DELETE_MESSAGE, 
        payload: { conversationId: message.conversation.id, messageId: message.id } 
    })
    });

    return () => socket.off("deleteMessage");
    
  }, [socket, dispatch]);

  //Conversation
  useEffect(() => {

    socket.on("userCreateConversation", (conversation) => {
        dispatch({ type: MESSAGE_TYPES.CREATE_CONVERSATION, payload: conversation });
    });

    return () => socket.off("userCreateConversation");
    
  }, [socket, dispatch]);


  useEffect(() => {

    socket.on("newUsersJoinConversation", (data) => {
      if (auth && data.userIds.includes(auth.user.id)) {
        dispatch({
          type: MESSAGE_TYPES.CREATE_CONVERSATION, 
          payload: data.conversation 
        })
      } else {
        dispatch({ type: MESSAGE_TYPES.UPDATE_PARTICIPANTS, payload: { id: parseInt(data.conversation.id), participants: data.conversation.participants }})
      }
    });

    return () => socket.off("newUsersJoinConversation");
    
  }, [socket, dispatch, auth]);

  useEffect(() => {

    socket.on("userLeaveConversation", (data) => {
      dispatch({ type: MESSAGE_TYPES.REMOVE_USER_FROM_CONVERSATION, payload: { id: parseInt(data.conversation), userId: parseInt(data.user.id) }})
    });

    return () => socket.off("userLeaveConversation");
    
  }, [socket, dispatch]);

  useEffect(() => {

    socket.on("userRemovedConversation", (data) => {
      if (auth && auth.user.id === parseInt(data.user.id)) {
        dispatch({ type: MESSAGE_TYPES.USER_LEAVE_CONVERSATION, payload: { id: parseInt(data.conversation) }})
      } else {
        dispatch({ type: MESSAGE_TYPES.REMOVE_USER_FROM_CONVERSATION, payload: { id: parseInt(data.conversation), userId: parseInt(data.user.id) }})
      }
    });

    return () => socket.off("userRemovedConversation");
    
  }, [socket, dispatch, auth]);

  // Users Status
  useEffect(() => {

    socket.on("userOnline", (id) => {
        dispatch({ type: GLOBALTYPES.ONLINE, payload: id });
    });

    return () => socket.off("userOnline");
    
  }, [socket, dispatch]);

  useEffect(() => {

    socket.on("userOffline", (id) => {
        dispatch({ type: GLOBALTYPES.OFFLINE, payload: id });
    });

    return () => socket.off("userOffline");
    
  }, [socket, dispatch]);

  return <></>
};

export default SocketClient;
