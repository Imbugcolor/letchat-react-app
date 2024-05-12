import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRouter from './customRouter/PrivateRouter';
import PageRender from './customRouter/PageRender';
import Notify from './components/notifies/Notify';
import { useDispatch, useSelector } from 'react-redux';
import Home from './pages/Home';
import { useEffect } from 'react';
import { refreshToken } from './redux/actions/auth.action';
import { GLOBALTYPES } from './redux/types/global.type';
import { BASE_URL } from './utils/config';
import io from 'socket.io-client'
import { getConversations } from './redux/actions/message.action';
import CreateConversation from './components/modals/CreateConversation';
import SocketClient from './socket.client';
import EditConversation from './components/modals/EditConversation';
import UploadImage from './components/upload/image.upload';
import { getUsersOnline } from './redux/actions/status.action';
import Register from './pages/auth/register';
import Verify from './pages/auth/verify';
import Login from './pages/auth/Login';
import AddMember from './components/modals/AddMember';
import EditProfile from './components/profile/Edit';
import Header from './components/home/Header';
import UploadProfile from './components/upload/profile.upload';

function App() {
  const auth = useSelector(state => state.auth)
  const socket = useSelector(state => state.socket)
  const modal = useSelector(state => state.modal)
  const dispatch = useDispatch()

  useEffect(() => {
     // get new AccessToken everytime access/refresh page
     dispatch(refreshToken())
  },[dispatch])

  useEffect(() => {
    if (auth.isLogged) {
      dispatch(getConversations({auth}))
      // create new socket 
      const socket = io(BASE_URL, {
        extraHeaders: {
          Authorization: `Bearer ${auth.token}` // WARN: this will be ignored in a browser
        }
      })

      socket.on('connect', () => {
        dispatch({type: GLOBALTYPES.SOCKET, payload: socket})
        dispatch(getUsersOnline({ auth }))
      });
  
      return () => socket.close()
    }
  },[auth, dispatch])

  return (
    <Router>
      <Notify />
      <div className="App">
      { modal && modal.addChat && <CreateConversation />}
      { modal && modal.editChat && <EditConversation />}
      { modal && modal.editThumbnail && <UploadImage />}
      { modal && modal.uploadProfile && <UploadProfile />}
      { modal && modal.addMember && <AddMember />}
      { auth.isLogged && socket && <SocketClient />}
      { auth.isLogged && <Header /> }
        <Routes>
            <Route exact path='/' Component={auth.isLogged ? Home : Login}/>
            <Route exact path='/register' Component={Register} />
            <Route exact path='/auth/verify' Component={Verify} />
            <Route exact path='/:page' element={<PrivateRouter component={PageRender}/>}/>
            <Route exact path='/:page/:id' element={<PrivateRouter component={PageRender}/>}/>
            <Route exact path='/infor/edit' Component={EditProfile}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
