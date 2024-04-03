import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
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

function App() {
  const auth = useSelector(state => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
     // get new AccessToken everytime access/refresh page
     dispatch(refreshToken())
  },[dispatch])

  useEffect(() => {
    if (auth.isLogged) {
      // create new socket 
      const socket = io(BASE_URL, {
        extraHeaders: {
          Authorization: `Bearer ${auth.token}` // WARN: this will be ignored in a browser
        }
      })
      dispatch({type: GLOBALTYPES.SOCKET, payload: socket})
      return () => socket.close()
    }
  },[auth.isLogged, auth.token, dispatch])

  return (
    <Router>
      <Notify />
      <div className="App">
        <Routes>
            <Route exact path='/' Component={auth.isLogged ? Home : Login}/>
            <Route exact path='/register' Component={Register} />
            <Route exact path='/:page' element={<PrivateRouter component={PageRender}/>}/>
            <Route exact path='/:page/:id' element={<PrivateRouter component={PageRender}/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
