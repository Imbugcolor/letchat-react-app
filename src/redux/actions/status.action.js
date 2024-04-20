import { getDataAPI } from "../../utils/fetchData";
import { GLOBALTYPES } from "../types/global.type";

export const getUsersOnline = ({ auth }) => async(dispatch) => {
    try {
        const res = await getDataAPI('users/online', auth.token, dispatch)

        dispatch({ type: GLOBALTYPES.GET_USERS_ONLINE, payload: res.data })
    } catch (err) {
        console.log(err);
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.message}})
    }
}