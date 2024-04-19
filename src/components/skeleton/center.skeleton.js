import React from "react";

const CenterSkeletonLoading = () => {
  return (
    <>
      {
        [0,1].map(element => (
          <div className="chat-display flex flex-col mt-5" key={element}>
            <div className="flex justify-end mb-4">
              <div className="flex flex-col text-right text-sm w-full">
                <div className="message_context flex items-center justify-end">
                  <div className="max-w-lg inline-block images_message_container flex flex-col text-right w-full">
                    <div className="skeleton py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white w-fit self-end text-left w-full h-20">
                      
                    </div>
                    <div className="max-w-xs"></div>
                  </div>

                </div>

                <div className="w-1/3 bg-gray-400 skeleton message_time_send w-fit self-end text-left mt-1 gray-text skeleton py-3 px-4">
              
                </div>
              </div>

              <div className="object-cover h-8 w-8 rounded-full bg-gray-400 skeleton ml-4"></div>
            </div>

            <div className="flex justify-start mb-4">
              <div className="object-cover h-8 w-8 rounded-full bg-gray-400 skeleton mr-4"></div>
              <div className="flex flex-col text-left text-sm w-full">
                <div className="max-w-lg images_message_container flex flex-col text-left w-full">
                  <div className="skeleton py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white w-fit self-start text-left w-full h-20">
              
                  </div>
                  <div className="max-w-xs bg-gray-400 skeleton"></div>
                </div>

                <div className="w-1/3 py-3 px-4 bg-gray-400 skeleton message_time_send w-fit self-start text-left mt-1 gray-text">
            
                </div>
              </div>
            </div>
          </div>
        ))
      }

      <form className="chat_form flex py-5 relative">
        <div className="w-full relative">
          <input
            className="w-full bg-gray-100 py-5 px-12 rounded-2xl skeleton"
            type="text"
            placeholder=""
            disabled
          />
          <div className="file_upload cursor-pointer">
          </div>
        </div>
        <button
          type="submit"
          className="send_btn flex items-center justify-center rounded-2xl ml-1.5 skeleton"
          disabled
        >
        </button>
      </form>
    </>
  );
};

export default CenterSkeletonLoading;
