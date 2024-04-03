import { combineReducers } from 'redux'
import auth from './auth.reducer'
import alert from './alert.reducer'
import socket from './socket.reducer'

export default combineReducers({
    auth,
    alert,
    socket
})