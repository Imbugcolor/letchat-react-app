import axios from 'axios'
import { jwtDecode } from "jwt-decode";
import { BASE_URL } from './config'
import { GLOBALTYPES } from '../redux/types/global.type'

export const checkTokenExp = async (token, dispatch) => {
    const decode = jwtDecode(token)

    if(decode.exp >= Date.now() / 1000) return;

    const res = await axios.get(`${BASE_URL}/auth/refreshtoken`, {
        headers: {"Content-Type": "application/json"},
        withCredentials: true
    })

    dispatch({ type: GLOBALTYPES.UPDATE_TOKEN, payload: res.data.accessToken })
    
    return res.data.accessToken
}