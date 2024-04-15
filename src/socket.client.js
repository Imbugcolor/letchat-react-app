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
          type: MESSAGE_TYPES.UPDATE_LAST_MESSAGE,
          payload: { id: message.conversation.id, lastMessage: message, isRead: false }
      })
    });

    return () => socket.off("newMessage");
    
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
