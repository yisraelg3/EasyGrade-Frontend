import { combineReducers } from 'redux'
import adminReducer from '../AdminComponents/AdminSlice'
import parentReducer from '../TeacherComponents/ParentSlice'

export default combineReducers({
    admin: adminReducer,
    parent: parentReducer
})




