import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteMessage } from "../../redux/actions/message.action";

const MessageOptions = ({ message, conversationId, setOnEdit, setUpdateText }) => {
  const auth = useSelector(state => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);

  const dispatch = useDispatch()

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleEditMessage = () => {
    setOnEdit(message.id)
    setUpdateText(message.text)
  }

  const handleDeleteMessage = () => {
    dispatch(deleteMessage({ auth, conversationId, messageId: message.id }))
  }

  return (
    <div className="message_options inline-block hs-dropdown relative inline-flex mr-3.5 opacity-0">
      <button
        id="hs-dropdown-custom-icon-trigger"
        type="button"
        className="hs-dropdown-toggle flex justify-center items-center size-9 text-sm font-semibold rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
        onClick={toggleMenu}
      >
        <svg
          className="flex-none size-4 text-gray-600 dark:text-neutral-500"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="5" r="1" />
          <circle cx="12" cy="19" r="1" />
        </svg>
      </button>

      {
        menuOpen &&
        <div
          className="active hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg p-2 mt-2 dark:bg-neutral-800 dark:border dark:border-neutral-700"
          aria-labelledby="hs-dropdown-custom-icon-trigger"
          id='dropdown_menu_options'
          onMouseLeave={() => setMenuOpen(false)}
        >
          <span
            className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
            onClick={handleEditMessage}
          >
            Edit
          </span>
          <span
            className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
            onClick={handleDeleteMessage}
          >
            Delete
          </span>
        </div>
      }
    </div>
  );
};

export default MessageOptions;
