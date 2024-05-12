import React, { useState } from 'react'
import useDebounce from '../../hooks/useDebounce';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { GoSearch } from 'react-icons/go'
import { getDataAPI } from '../../utils/fetchData';


const SearchBar = () => {
    const auth = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const [searchInput, setSearchInput] = useState('')
    const [searchData, setSearchData] = useState([])
    const [open, setOpen] = useState(false)
  
    useDebounce(async() => {
      if (searchInput) {
        const usersMatch = await getDataAPI(`users/search?searchTerm=${searchInput}`, auth.token, dispatch)
        setSearchData(usersMatch.data[0]);
      }
    }, [dispatch, searchInput], 800);
  
    const handleOnChangeInput = (e) => {
        if (!e.target.value) {
            setOpen(false)
        } else {
            setOpen(true)
        }
      setSearchInput(e.target.value);
    }

  return (
    <div className="w-1/2 search search__bar_wrapper">
        <input
          type="text"
          name=""
          id=""
          placeholder="search friends following email, username, phone..."
          className="rounded-2xl bg-gray-100 py-3 px-5 w-full"
          onChange={handleOnChangeInput}
        />
        <div className="">
        {
                    open && searchData.length > 0 ?
                        <ul className="list_item_suggest">
                            <li className='key_search_msg'>
                                <GoSearch /> Results for '{searchInput}'
                            </li>
                            {
                                searchData.map((item, index) => {
                                    return index > 15 ? null :
                                        <li key={item.id} className="item_suggest_result">
                                            <div className='right__item_suggest_result'>
                                                <Link to={`/profile/${item.id}`} className="redirect_item_result" onClick={(e) => {                                    
                                                    setOpen(false)
                                                }}>
                                                    <img src={item.avatar} alt=""/>
                                                </Link>    
                                            </div>  
                                            <div className='left__item_suggest_result'>
                                                <Link to={`/profile/${item.id}`} className="redirect_item_result" onClick={(e) => {                                  
                                                    setOpen(false)
                                                }}>
                                                    {item.fullname}
                                                </Link>
                                                <span>{item.username}</span>
                                                <span>{item.email ? item.email : item.phone}</span>
                                            </div>                                        
                                        </li>
                                })
                            }
                        </ul>
                        : open && searchData.length === 0 && searchInput ? 
                        <ul className="list_item_suggest">
                            <li className='not__found_msg'>
                                <GoSearch /> There are no results for '{searchInput}'
                            </li>
                        </ul> : null
                }
        </div>
      </div>
  )
}

export default SearchBar
