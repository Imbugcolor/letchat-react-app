import axios from 'axios'
import { checkTokenExp } from './refreshToken'
import { BASE_URL } from './config';

export const getDataAPI = async (endpoint, token, dispatch) => {
    let res;
    if (token) {
        const result = await checkTokenExp(token, dispatch)
        const access_token = result ? result  : token
        res = await axios.get(`${BASE_URL}/${endpoint}`, {
            headers: {"Content-Type": "application/json", Authorization: access_token},
            withCredentials: true
        })
    } else {
        res = await axios.get(`${BASE_URL}/${endpoint}`, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true
        })
    }
    return res;
}

export const postDataAPI = async (endpoint, post, token, dispatch) => {
    let res;
    if (token) {
        const result = await checkTokenExp(token, dispatch)
        const access_token = result ? result  : token
        res = await axios.post(`${BASE_URL}/${endpoint}`, post, {
            headers: {"Content-Type": "application/json", Authorization: access_token},
            withCredentials: true
        })
    } else {
        res = await axios.post(`${BASE_URL}/${endpoint}`, post, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true
        })
    }
    return res;
}

export const putDataAPI = async (endpoint, post, token, dispatch) => {
    let res;
    if (token) {
        const result = await checkTokenExp(token, dispatch)
        const access_token = result ? result  : token
        res = await axios.put(`${BASE_URL}/${endpoint}`, post, {
            headers: {"Content-Type": "application/json", Authorization: access_token},
            withCredentials: true
        })
    } else {
        res = await axios.put(`${BASE_URL}/${endpoint}`, post, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true
        })
    }
    return res;
}

export const patchDataAPI = async (endpoint, post, token, dispatch) => {
    let res;
    if (token) {
        const result = await checkTokenExp(token, dispatch)
        const access_token = result ? result  : token
        res = await axios.patch(`${BASE_URL}/${endpoint}`, post, {
            headers: {"Content-Type": "application/json", Authorization: access_token},
            withCredentials: true
        })
    } else {
        res = await axios.patch(`${BASE_URL}/${endpoint}`, post, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true
        })
    }
    return res;
}

export const deleteDataAPI = async (endpoint, token, dispatch) => {
    let res;
    if (token) {
        const result = await checkTokenExp(token, dispatch)
        const access_token = result ? result  : token
        res = await axios.delete(`${BASE_URL}/${endpoint}`, {
            headers: {"Content-Type": "application/json", Authorization: access_token},
            withCredentials: true
        })
    } else {
        res = await axios.delete(`${BASE_URL}/${endpoint}`, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true
        })
    }
    return res;
}

export const postFormDataAPI = async (endpoint, post, token, dispatch) => {
    let res;
    if (token) {
        const result = await checkTokenExp(token, dispatch)
        const access_token = result ? result  : token
        res = await axios.post(`${BASE_URL}/${endpoint}`, post, {
            headers: {"Content-Type": "multipart/form-data", Authorization: access_token},
            withCredentials: true
        })
    } else {
        res = await axios.post(`${BASE_URL}/${endpoint}`, post, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true
        })
    }
    return res;
}

export const patchFormDataAPI = async (endpoint, data, token, dispatch) => {
    let res;
    if (token) {
        const result = await checkTokenExp(token, dispatch)
        const access_token = result ? result  : token
        res = await axios.patch(`${BASE_URL}/${endpoint}`, data, {
            headers: {"Content-Type": "multipart/form-data", Authorization: access_token},
            withCredentials: true
        })
    } else {
        res = await axios.patch(`${BASE_URL}/${endpoint}`, data, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true
        })
    }
    return res;
}
