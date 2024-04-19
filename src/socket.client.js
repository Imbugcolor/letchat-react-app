import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MESSAGE_TYPES } from "./redux/types/message.type";

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

  return <></>
};

export default SocketClient;
