import { getDataAPI, postDataAPI } from "../../utils/fetchData"
import { GLOBALTYPES } from "../types/global.type"

export const register = (data) => async (dispatch) => {
    try {
        await postDataAPI('users', {...data, phone: "+84" + data.phone.replace(/\s/g, "")})

        window.location.href = `/auth/verify?phone=${data.phone}&email=${data.email}`
    } catch (err) {
        if (!err.response) {
            dispatch({ 
                type: GLOBALTYPES.ALERT, 
                payload: {
                    error: 'Server lost connection.'
                } 
            })
        } else {
            dispatch({ 
                type: GLOBALTYPES.ALERT, 
                payload: {
                    error: err.response.data.message
                } 
            })
        }
    }
}

export const login = (data) => async (dispatch) => {
    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} })
        const res = await postDataAPI('auth', data)

        const { accessToken, ...user } = res.data

        dispatch({ 
            type: GLOBALTYPES.AUTH, 
            payload: {
                token: accessToken,
                user
            } 
        })

        localStorage.setItem("firstLogin", true)

        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: {
                success: "Login Success!"
            } 
        })

        
    } catch (err) {
        if (!err.response) {
            dispatch({ 
                type: GLOBALTYPES.ALERT, 
                payload: {
                    error: 'Server lost connection.'
                } 
            })
        } else {
            dispatch({ 
                type: GLOBALTYPES.ALERT, 
                payload: {
                    error: err.response.data.message
                } 
            })
        }
    }
}

export const refreshToken = () => async (dispatch) => {
    const firstLogin = localStorage.getItem("firstLogin")

    if(firstLogin){
        dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} })

        try {
            const res = await getDataAPI('auth/refreshtoken')

            const { accessToken, ...user } = res.data
            dispatch({ 
                type: GLOBALTYPES.AUTH, 
                payload: {
                    token: accessToken,
                    user
                } 
            })

            dispatch({ type: GLOBALTYPES.ALERT, payload: {} })

        } catch (err) {
            if (!err.response) {
                dispatch({ 
                    type: GLOBALTYPES.ALERT, 
                    payload: {
                        error: 'Server lost connection.'
                    } 
                })
            } else {
                dispatch({ 
                    type: GLOBALTYPES.ALERT, 
                    payload: {
                        error: err.response.data.message
                    } 
                })
            }
        }
    }
}

export const signOut = ({ auth }) => async (dispatch) => {
    try {
        await getDataAPI('auth/logout', auth.token, dispatch)

        localStorage.removeItem("firstLogin")

        window.location.href = "/"
    } catch (err) {
        if (!err.response) {
            dispatch({ 
                type: GLOBALTYPES.ALERT, 
                payload: {
                    error: 'Server lost connection.'
                } 
            })
        } else {
            dispatch({ 
                type: GLOBALTYPES.ALERT, 
                payload: {
                    error: err.response.data.message
                } 
            })
        }
    }
}

export const resend = ({ email, phone }) => async (dispatch) => {
    try {
        if (phone) {
            await postDataAPI('auth/resend', { phone })
        } else {
            await postDataAPI('auth/resend', { email })
        }
        dispatch({ type: GLOBALTYPES.ALERT, payload: { success: 'Send OK.' } })
    } catch (err) {
        console.log(err)
        if (!err.response) {
            dispatch({ 
                type: GLOBALTYPES.ALERT, 
                payload: {
                    error: 'Server lost connection.'
                } 
            })
        } else {
            dispatch({ 
                type: GLOBALTYPES.ALERT, 
                payload: {
                    error: err.response.data.message
                } 
            })
        }
    }
}

export const verify = (data) => async (dispatch) => {
    try {
        if (data.phone) {
            await postDataAPI('auth/active/phone', { phone: data.phone, code: data.code })
        } else {
            await postDataAPI('auth/active/mail', { email: data.email, otp: data.code })
        }
        dispatch({ type: GLOBALTYPES.VERIFY, payload: { ...data, isVerify: true }})
    } catch (err) {
        console.log(err)
        dispatch({ type: GLOBALTYPES.VERIFY, payload: { ...data, isVerify: false }})
        if (!err.response) {
            dispatch({ 
                type: GLOBALTYPES.ALERT, 
                payload: {
                    error: 'Server lost connection.'
                } 
            })
        } else {
            dispatch({ 
                type: GLOBALTYPES.ALERT, 
                payload: {
                    error: err.response.data.message
                } 
            })
        }
    }
}