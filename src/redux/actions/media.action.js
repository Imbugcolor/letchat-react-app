import { getDataAPI } from "../../utils/fetchData"
import { GLOBALTYPES } from "../types/global.type"
import { MEDIATYPES } from "../types/media.type"

export const getMedia = ({ auth, id, page = 1 }) => async(dispatch) => {
    try {
        const res = await getDataAPI(`conversations/photos/${id}`, auth.token, dispatch)

        dispatch({type: MEDIATYPES.GET_MEDIA, payload: { data: res.data.reverse(), id }})
    } catch (err) {
        console.log(err);
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.message}})
    }
}