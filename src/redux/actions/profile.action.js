import { getDataAPI, patchDataAPI, patchFormDataAPI } from "../../utils/fetchData"
import { GLOBALTYPES } from "../types/global.type"
import { PROFILE_TYPES } from "../types/profile.type"

export const getUserProfile = ({id, auth})=> async (dispatch) =>{
    dispatch({type: PROFILE_TYPES.GET_ID, payload: id})
   
    try {
        dispatch({ type: PROFILE_TYPES.LOADING,  payload: true})
        const res = await getDataAPI(`users/profile/${id}`, auth.token, dispatch)
  
        dispatch({
            type: PROFILE_TYPES.GET_USER, 
            payload: { user: res.data }
        })

        dispatch({type:PROFILE_TYPES.LOADING, payload: false})
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT, 
            payload: {error: err.response.data.msg}
        })
    }
}

export const updateProfile = ({ auth, data }) => async (dispatch) => {
    try {
        await patchDataAPI('users/update', data, auth.token, dispatch )

        dispatch({type: GLOBALTYPES.UPDATE_PROFILE, payload: { data } })
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT, 
            payload: {error: err.response.data.msg}
        })
    }
}

export const updatePhotoProfile = ({ auth, image }) => async (dispatch) => {
    try {
        const formData = new FormData()

        formData.append("file", image)

        const res = await patchFormDataAPI('users/photo', formData , auth.token, dispatch) 

        dispatch({
            type: GLOBALTYPES.UPDATE_PHOTO_PROFILE, 
            payload: { url: res.data } 
        })
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT, 
            payload: {error: err.response.data.msg}
        })
    }
}