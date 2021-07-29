import { combineReducers } from 'redux'
import adminReducer from '../AdminComponents/AdminSlice'

export default combineReducers({
    admin: adminReducer
})




