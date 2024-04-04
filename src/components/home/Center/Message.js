import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getMessages,
  loadMoreMessages,
} from "../../../redux/actions/message.action";
import LoadIcon from "../../../images/loading.gif";
import MessageScreen from "../MessageScreen";

const Message = () => {
  const auth = useSelector((state) => state.auth);
  const message = useSelector((state) => state.message);
  const dispatch = useDispatch();

  const { id } = useParams();

  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [load, setLoad] = useState(false);
  const [last, setLast] = useState(0);
  const [total, setTotal] = useState(0);
  const [isLoadMore, setIsLoadMore] = useState(0);

  // If data loaded, get data in Redux Store
  useEffect(() => {
    const newData = message.data.find((item) => item.id === id);
    if (newData) {
      setData(newData.data);
      setPage(newData.page);
      setLast(newData.last);
      setTotal(newData.total);
    }
  }, [message.data, id]);

  const refDisplay = useRef();
  const pageEnd = useRef();

  useEffect(() => {
    if (id) {
      // get messages data each conversation
      const getMessagesData = async () => {
        setLoad(true);
        // if data id is not exist, get messages data
        if (id && message.data.every((item) => item.id !== id)) {
          await dispatch(getMessages({ auth, id }));
          setTimeout(() => {
            refDisplay.current.scrollTo(0, refDisplay.current.scrollHeight);
          }, 50);
        }
        setLoad(false);
      };
  
      getMessagesData();
    }
  }, [id, auth, dispatch, message.data]);

  // Load more
  useEffect(() => {
    if (id) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setIsLoadMore((p) => p + 1);
          }
        },
        { threshold: 0.1 }
      );
  
      observer.observe(pageEnd.current);
    }
  }, [setIsLoadMore, id]);

  // useEffect(() => {
  //   if (isLoadMore > 1) {
  //     if (last < total) {
  //       dispatch(loadMoreMessages({ auth, id, page: page + 1 }));
  //       setIsLoadMore(1);
  //     }
  //   }
  //   // eslint-disable-next-line
  // }, [isLoadMore]);

  const handleScroll = (event) => {
    const { scrollTop } = event.currentTarget;

    if (scrollTop === 0 && isLoadMore === 1 && last < total + 1) {
      setIsLoadMore((p) => p + 1);
      // User has scrolled to the top, load more messages
      dispatch(loadMoreMessages({ auth, id, page: page + 1 }));

      setIsLoadMore(1);
    }
  };

  if (!id) return <MessageScreen />
  return (
    <div className="w-full px-5 flex flex-col justify-between">
      {load ? (
        <div className="loading_conversation">
          <img src={LoadIcon} alt="loading" />
        </div>
      ) : (
        <div className="chat-display flex flex-col mt-5" onScroll={handleScroll} ref={refDisplay}>
          <button style={{ opacity: 0 }} ref={pageEnd}>
            Load more
          </button>
          {data.map((msg) => {
            if (msg.senderId.id === auth.user.id) {
              return (
                <div className="flex justify-end mb-4" key={msg.id}>
                  {msg.attachments?.length > 0 && (
                    <div className="images_message_container">
                      {msg.attachments.map((att) => (
                        <img src={att.url} alt="" key={att.id} />
                      ))}
                    </div>
                  )}
                  {msg.text && (
                    <div className="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white">
                      {msg.text}
                    </div>
                  )}

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
                  {msg.attachments?.length > 0 && (
                    <div className="images_message_container">
                      {msg.attachments.map((att) => (
                        <img src={att.url} alt="" key={att.id} />
                      ))}
                    </div>
                  )}

                  {msg.text && (
                    <div className="ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white">
                      {msg.text}
                    </div>
                  )}
                </div>
              );
            }
          })}
        </div>
      )}
      <div className="py-5">
        <input
          className="w-full bg-gray-300 py-5 px-3 rounded-xl"
          type="text"
          placeholder="type your message here..."
        />
      </div>
    </div>
  );
};

export default Message;
