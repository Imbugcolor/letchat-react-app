import { getDataAPI, postDataAPI } from "../../utils/fetchData"
import { GLOBALTYPES } from "../types/global.type"

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