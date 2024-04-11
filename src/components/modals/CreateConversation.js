import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GLOBALTYPES } from "../../redux/types/global.type";
import { IoIosSearch } from "react-icons/io";
import { getDataAPI } from "../../utils/fetchData";
import { createConversation } from "../../redux/actions/message.action";

const CreateConversation = () => {
  const auth = useSelector(state => state.auth);
  const [searchInput, setSearchInput] = useState('');
  const [searchResult, setSearchResult] = useState(0)
  const [isSearch, setIsSearch] = useState(false)
  const [usersSelected, setUsersSelected] = useState([]);

  const [users, setUsers] = useState([])

  const dispatch = useDispatch();
  const handleCloseModal = () => {
    dispatch({ type: GLOBALTYPES.MODAL, payload: null });
  };

  const handleOnChangeInput = (e) => {
    setIsSearch(false)
    setSearchInput(e.target.value);
  }

  const handleSearch = async() => {
    const usersMatch = await getDataAPI(`users/search?searchTerm=${searchInput}`, auth.token, dispatch)
    setUsers(usersMatch.data[0])
    setSearchResult(usersMatch.data[1])
    setIsSearch(true)
  }

  const handleSelectUser = (user) => {
    if (usersSelected.every((_user) => _user.id !== user.id)) {
      setUsersSelected([...usersSelected, user]);
    }
  };

  const handleUnSelectUser = (user) => {
    const unSelected = usersSelected.filter((_user) => _user.id !== user.id);
    setUsersSelected(unSelected);
  };

  const handleCreateConversation = (e) => {
    e.preventDefault();
    if (usersSelected.length > 0) {
      dispatch(createConversation({ auth, users: usersSelected }));
    }
  }

  return (
    // <!-- Main modal -->
    <div
      id="chat-modal"
      aria-hidden="true"
      className="flex overflow-x-hidden overflow-y-auto fixed h-modal md:h-full top-4 left-0 right-0 md:inset-0 z-50 justify-center items-center"
    >
      <div className="relative w-full max-w-md px-4 h-full md:h-auto">
        {/* <!-- Modal content --> */}
        <div className="bg-white rounded-lg shadow relative dark:bg-gray-700">
          <div className="flex justify-end p-2">
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
              onClick={handleCloseModal}
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          <form
            className="space-y-6 px-6 lg:px-8 pb-4 sm:pb-6 xl:pb-8"
            onSubmit={handleCreateConversation}
          >
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Search following name or email:{" "}
            </h3>
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300"
              >
                Name / Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="username / name@company.com"
                  onChange={handleOnChangeInput}
                />
                <IoIosSearch className="search_icon" onClick={handleSearch}/>
              </div>
            </div>
            <div className="result_number">
                <span>{users && users.length} results</span>
            </div>
            <div className={`search-results ${users && users.length > 4 && 'overflow-y-scroll'}`}>
              {users &&
                users.length > 0 &&
                users.map((user) => (
                  <div
                    key={user.id}
                    className="flex justify-between items-center my-2"
                  >
                    <div className="flex items-center">
                      <img
                        className="image-user-result"
                        src={user.avatar}
                        alt=""
                        style={{ maxWidth: "50px" }}
                      />
                      <span>{user.username}</span>
                    </div>
                    <div
                      className="cursor-pointer"
                      onClick={() => handleSelectUser(user)}
                    >
                      <span>+</span>
                    </div>
                  </div>
                )
              )
            }
            {
              users && users.length < 1 && searchInput && isSearch &&
              <div>
              Not users match.
              </div>
            }
            </div>

            <div className="adding-users flex">
              {usersSelected &&
                usersSelected.length > 0 &&
                usersSelected.map((user) => (
                  <div
                    key={user.id}
                    className="flex justify-between items-center relative my-2"
                  >
                    <div className="flex items-center">
                      <img
                        className="image-user-result"
                        src={user.avatar}
                        alt=""
                        style={{ maxWidth: "50px" }}
                      />
                      <span
                        className="un-select-button"
                        onClick={() => handleUnSelectUser(user)}
                      >
                        -
                      </span>
                    </div>
                  </div>
                ))}
            </div>

            <button
              type="submit"
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Create
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateConversation;
