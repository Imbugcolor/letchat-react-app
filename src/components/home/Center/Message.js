import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  createMessage,
  getMessages,
  loadMoreMessages,
} from "../../../redux/actions/message.action";
import LoadIcon from "../../../images/loading.gif";
import MessageScreen from "../MessageScreen";
import { MdOutlinePermMedia } from "react-icons/md";
import { GLOBALTYPES } from "../../../redux/types/global.type";
import Loading5 from '../../../images/loading5.gif'

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
  const [limit, setLimit] = useState(0);
  const [isLoadMore, setIsLoadMore] = useState(0);

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

    if (refDisplay.current) {
      setTimeout(() => {
        refDisplay.current.scrollTo(0, refDisplay.current.scrollHeight);
      }, 50);
    }
  };

  if (!id) return <MessageScreen />;
  return (
    <div className="w-full px-5 flex flex-col justify-between">
      {load ? (
        <div className="loading_conversation">
          <img src={LoadIcon} alt="loading" />
        </div>
      ) : (
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
                    {!msg.text && msg.attachments && msg.attachments.length > 0 && (
                      <div className="images_message_container flex flex-col text-right">
                        {msg.attachments.map((att) => (
                          <img src={att.url} alt="" key={att.id} />
                        ))}
                      </div>
                    )}

                    {msg.text && msg.attachments && msg.attachments.length > 0 && (
                      <div className="images_message_container flex flex-col text-right">
                        <div className="py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white w-fit self-end text-left"> {msg.text}</div>
                        {msg.attachments.map((att) => (
                          <img src={att.url} alt="" key={att.id} />
                        ))}
                      </div>
                    )}

                    {msg.text && (!msg.attachments || msg.attachments.length < 1) && (
                      <div className="py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white w-fit self-end text-left">
                        {msg.text}
                      </div>
                    )}
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
                      <div className="images_message_container flex flex-col text-left">
                        {msg.attachments.map((att) => (
                          <img src={att.url} alt="" key={att.id} />
                        ))}
                      </div>
                    )}

                    {msg.text && msg.attachments && msg.attachments.length > 0 && (
                      <div className="images_message_container flex flex-col text-left">
                        <div className="py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white w-fit self-start text-left"> {msg.text}</div>
                        {msg.attachments.map((att) => (
                          <img src={att.url} alt="" key={att.id} />
                        ))}
                      </div>
                    )}

                    {msg.text && (!msg.attachments || msg.attachments.length < 1) && (
                      <div className="py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white w-fit self-start text-left">
                        {msg.text}
                      </div>
                    )}
                  </div>
                </div>
              );
            }
          })}
          {loadMessage && (
            <div className="chat_row you_message">
              <img src={LoadIcon} alt="loading" />
            </div>
          )}
        </div>
      )}

      <form className="chat_form py-5 relative" onSubmit={handleSubmit}>
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
        <input
          className="w-full bg-gray-300 py-5 px-3 rounded-xl"
          type="text"
          placeholder="type your message here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="file_upload">
          <MdOutlinePermMedia
            style={{ fontSize: "26px", marginRight: "10px" }}
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
      </form>
    </div>
  );
};

export default Message;
