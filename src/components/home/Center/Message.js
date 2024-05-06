import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  createMessage,
  getMessages,
  loadMoreMessages,
  readMessage,
} from "../../../redux/actions/message.action";
import LoadIcon from "../../../images/loading.gif";
import MessageScreen from "../MessageScreen";
import { GrAttachment } from "react-icons/gr";
import { RiSendPlaneFill } from "react-icons/ri";
import { GLOBALTYPES } from "../../../redux/types/global.type";
import { getTimeFromDate } from "../../../utils/dateFormat";
import MessageOptions from "../../dropdown/messageOptions";
import { MESSAGE_TYPES } from "../../../redux/types/message.type";
import CenterSkeletonLoading from "../../skeleton/center.skeleton";

const Message = () => {
  const auth = useSelector((state) => state.auth);
  const message = useSelector((state) => state.message);
  const conversations = useSelector((state) => state.message).conversations;
  const dispatch = useDispatch();

  const { id } = useParams();

  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [load, setLoad] = useState(false);
  const [last, setLast] = useState(0);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(0);
  const [isLoadMore, setIsLoadMore] = useState(0);
  const [lastMsg, setLastMsg] = useState();

  const [text, setText] = useState("");
  const [media, setMedia] = useState([]);

  const [loadMessage, setLoadMessage] = useState(false);

  // If data loaded, get data in Redux Store
  useEffect(() => {
    const newData = message.data.find((item) => item.id === id);
    if (newData) {
      setData(newData.data);
      setPage(newData.page);
      setLast(newData.last);
      setTotal(newData.total);
      setLimit(newData.limit);
    }
  }, [message.data, id]);

  const refDisplay = useRef();
  const pageEnd = useRef();

  useEffect(() => {
    if (id) {
      setIsLoadMore(1)
      // get messages data each conversation
      const getMessagesData = async () => {
        setLoad(true);
        // if data id is not exist, get messages data
        if (id && message.data.every((item) => item.id !== id)) {
          await dispatch(getMessages({ auth, id }));
          setTimeout(() => {
            refDisplay.current.scrollTo({
              top: refDisplay.current.scrollHeight,
              behavior: 'smooth'
            });
          }, 50);
        }
        setLoad(false);
      };

      getMessagesData();
    }
  }, [id, auth, dispatch, message.data]);

  useEffect(() => {
    if (id && conversations.find(cv => cv.id === Number(id))) {
      if (conversations.find(cv => cv.id === Number(id)).lastMessage) {
        setLastMsg(conversations.find(cv => cv.id === Number(id)).lastMessage)
      }
    }
  },[id, conversations])

  useEffect(() => {
    const getReadMessage = async() => {
      if (id && conversations.find(cv => cv.id === Number(id)) && conversations.find(cv => cv.id === Number(id)).isRead === false) {
        if (conversations.find(cv => cv.id === Number(id)).lastMessage) {
          if (conversations.find(cv => cv.id === Number(id)).lastMessage.senderId.id !== auth.user.id) {
            await dispatch(readMessage({ auth, conversationId: Number(id) }))
  
            if (refDisplay.current) {
              setTimeout(() => {
                refDisplay.current.scrollTo(0, refDisplay.current.scrollHeight);
              }, 50);
            }
          }
        }
        return;
      }
    }

    getReadMessage()
  },[id, conversations, dispatch, auth])

  useEffect(() => {
    setIsLoadMore(1)
  },[id, isLoadMore])

  useEffect(() => {
    if (refDisplay && refDisplay.current) {
      setTimeout(() => {
        refDisplay?.current?.scrollTo({
          top: refDisplay.current.scrollHeight,
          behavior: 'smooth'
        });
      }, 50);
    }
  },[id])

  // Load more
  useEffect(() => {
    if (id && pageEnd.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setIsLoadMore((p) => p + 1);
          }
        },
        { threshold: 0.1 }
      );
 
      observer.observe(pageEnd.current);
      
       // Clean up the observer when component unmounts or id changes
      return () => {
        observer.disconnect();
      };
    }
  }, [setIsLoadMore, id]);

  const handleScroll = (event) => {
    const { scrollTop } = event.currentTarget;

    if (scrollTop === 0 && isLoadMore === 1 && last < total + 1) {
      setIsLoadMore((p) => p + 1);
      // User has scrolled to the top, load more messages
      dispatch(loadMoreMessages({ auth, id, page: page + 1, limit }));

      setIsLoadMore(1);
    }
  };

  const handleChangeMedia = (e) => {
    const files = [...e.target.files];

    let err = "";
    let newMedia = [];
    const types = ["image/png", "image/jpeg"];

    files.forEach((file) => {
      if (!file) return (err = "File does not exist.");

      if (file.size > 1024 * 1024 * 25) {
        return (err = "The image/video largest is 25mb.");
      }

      if (!types.includes(file.type))
        return (err = "The image/video is not support.");

      return newMedia.push(file);
    });

    if (err) dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err } });

    setMedia([...media, ...newMedia]);

    e.target.value = null;
  };

  const handleDeleteMedia = (index) => {
    const newArr = [...media];
    newArr.splice(index, 1);
    setMedia(newArr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && media.length === 0) return;
    setText("");
    setMedia([]);

    setLoadMessage(true);

    await dispatch(
      createMessage({ auth, conversationId: id, text, photos: media })
    );
  
    setLoadMessage(false);
  };

  useEffect(() => {
    if (loadMessage) {
      if (refDisplay && refDisplay.current) {
        setTimeout(() => {
          refDisplay?.current?.scrollTo({
            top: refDisplay.current.scrollHeight,
            behavior: 'smooth'
          });
        }, 50);
      }
    }
  },[loadMessage])

  useEffect(() => {
    if (message.scrollToBottom && message.scrollToBottom === Number(id)) {
      if (refDisplay && refDisplay.current) {
        setTimeout(() => {
          refDisplay?.current?.scrollTo({
            top: refDisplay.current.scrollHeight,
            behavior: 'smooth'
          });
        }, 50);
      }
      dispatch({ type: MESSAGE_TYPES.UPDATE_SCROLL_TO_BOTTOM, payload: { id: null } })
    }
  },[message.scrollToBottom, id, dispatch])

  if (!id) return <MessageScreen />;
  return (
    <div className="w-full px-5 flex flex-col justify-between">
      {load ? (
        // <div className="loading_conversation">
        //   <img src={LoadIcon} alt="loading" />
        // </div>
        <CenterSkeletonLoading />
      ) : (
        <>
        <div
          className="chat-display flex flex-col mt-5"
          onScroll={handleScroll}
          ref={refDisplay}
        >
          <button style={{ opacity: 0 }} ref={pageEnd}>
            Load more
          </button>

          {data.map((msg) => {
            if (msg.senderId.id === auth.user.id) {
              return (
                <div className="flex justify-end mb-4" key={msg.id}>
                  <div className='flex flex-col text-right text-sm'> 
                    <span style={{ color: '#65676b'}}>{msg.senderId.fullname}</span>
                    <div className="message_context flex items-center justify-end">
                      <MessageOptions message={msg} conversationId={Number(id)}/>
                      {!msg.text && msg.attachments && msg.attachments.length > 0 && (
                        <div className="max-w-lg inline-block images_message_container flex flex-col text-right">
                          {msg.attachments.map((att) => (
                            <img src={att.url} alt="" key={att.id} className="max-w-xs"/>
                          ))}
                        </div>
                      )}

                      {msg.text && msg.attachments && msg.attachments.length > 0 && (
                        <div className="max-w-lg inline-block images_message_container flex flex-col text-right">
                          <div className="py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white w-fit self-end text-left"> {msg.text}</div>
                          {msg.attachments.map((att) => (
                            <img src={att.url} alt="" key={att.id} className="max-w-xs"/>
                          ))}
                        </div>
                      )}

                      {msg.text && (!msg.attachments || msg.attachments.length < 1) && (
                        <div className="max-w-lg inline-block py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white w-fit self-end text-left">
                          {msg.text}
                        </div>
                      )}
                    </div>

                    {msg.createdAt && (
                      <div className="message_time_send w-fit self-end text-left mt-1 gray-text">
                        {
                          getTimeFromDate(new Date(msg.createdAt))
                        }
                      </div>
                    )}

                    {
                      lastMsg?.id === msg.id && lastMsg?.usersRead?.length > 0 && 
                      <div className="user_seen_msg w-fit self-end text-left"> 
                       {
                          lastMsg?.usersRead?.length === 1 &&
                            <p>{lastMsg?.usersRead[0].readBy.fullname}</p>
                        }
                        {
                           lastMsg?.usersRead?.length > 1 && lastMsg?.usersRead.map((usr,index) => (
                                <p key={usr.id}>{usr.readBy.fullname}{index + 1 < lastMsg?.usersRead.length && ', '}</p>
                              )
                          )
                        }
                        <p>seen.</p>
                      </div>
                    }
                  </div>

                  <img
                    src={msg.senderId.avatar}
                    className="object-cover h-8 w-8 rounded-full"
                    alt=""
                  />
                </div>
              );
            } else {
              return (
                <div className="flex justify-start mb-4" key={msg.id}>
                  <img
                    src={msg.senderId.avatar}
                    className="object-cover h-8 w-8 rounded-full"
                    alt=""
                  />
                  <div className='flex flex-col text-left text-sm'> 
                    <span style={{ color: '#65676b'}}>{msg.senderId.fullname}</span>
                    {!msg.text && msg.attachments && msg.attachments.length > 0 && (
                      <div className="max-w-lg images_message_container flex flex-col text-left">
                        {msg.attachments.map((att) => (
                          <img src={att.url} alt="" key={att.id} className="max-w-xs"/>
                        ))}
                      </div>
                    )}

                    {msg.text && msg.attachments && msg.attachments.length > 0 && (
                      <div className="max-w-lg images_message_container flex flex-col text-left">
                        <div className="py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white w-fit self-start text-left"> {msg.text}</div>
                        {msg.attachments.map((att) => (
                          <img src={att.url} alt="" key={att.id} className="max-w-xs"/>
                        ))}
                      </div>
                    )}

                    {msg.text && (!msg.attachments || msg.attachments.length < 1) && (
                      <div className="max-w-lg py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white w-fit self-start text-left">
                        {msg.text}
                      </div>
                    )}

                    {msg.createdAt && (
                      <div className="message_time_send w-fit self-start text-left mt-1 gray-text">
                        {
                          getTimeFromDate(new Date(msg.createdAt))
                        }
                      </div>
                    )}

                    {
                      lastMsg?.id === msg.id && lastMsg?.usersRead?.length > 0 &&
                      <div className="user_seen_msg w-fit self-start text-left"> 
                        {
                          lastMsg?.usersRead?.length === 1 &&
                            <p>{lastMsg?.usersRead[0].readBy.fullname}</p>
                        }
                        {
                           lastMsg?.usersRead?.length > 1 && lastMsg?.usersRead.map((usr,index) => (
                                <p key={usr.id}>{usr.readBy.fullname}{index + 1 < lastMsg?.usersRead.length && ', '}</p>
                              )
                          )
                        }
                        <p>seen.</p>
                      </div>
                    }
                  </div>
                </div>
              );
            }
          })}
          {loadMessage && (
            <div className="chat_row you_message flex justify-end mr-8">
              <img src={LoadIcon} alt="loading" className="w-2.5"/>
            </div>
          )}
        </div>

        <form className="chat_form flex py-5 relative" onSubmit={handleSubmit}>
          <div
            className="show_media flex flex-col mt-5"
            style={{ display: media.length > 0 ? "grid" : "none" }}
          >
            {media.map((item, index) => (
              <div key={index} id="file_media">
                <img
                  src={URL.createObjectURL(item)}
                  alt="images"
                  className="img-thumbnail"
                />
                <span className='delete_photo' onClick={() => handleDeleteMedia(index)}>&times;</span>
              </div>
            ))}
          </div>
          <div className="w-full relative">
            <input
              className="w-full bg-gray-100 py-5 px-12 rounded-2xl"
              type="text"
              placeholder="Write messages..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="file_upload cursor-pointer">
              <GrAttachment
                style={{ fontSize: "22px", marginRight: "10px" }}
              />
              <input
                type="file"
                name="file"
                id="file"
                multiple
                accept="image/*"
                onChange={handleChangeMedia}
              />
            </div>
          </div>
          <button type="submit" className="send_btn flex items-center justify-center rounded-2xl ml-1.5"><RiSendPlaneFill /></button>
        </form>
        </>
      )}

    </div>
  );
};

export default Message;
