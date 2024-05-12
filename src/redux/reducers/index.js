import { combineReducers } from 'redux'
import auth from './auth.reducer'
import alert from './alert.reducer'
import socket from './socket.reducer'
import message from './message.reducer'
import modal from './modal.reducer'
import media from './media.reducer'
import status from './status.reducer'
import profile from './profile.reducer'

export default combineReducers({
    auth,
    alert,
    socket,
    message,
    modal,
    media,
    status,
    profile
})