import { combineReducers } from 'redux'
import loginReducer from './LoginSlice'
import teacherReducer from './TeacherSlice'
import parentReducer from './ParentSlice'
import studentReducer from './StudentSlice'
import classReducer from './ClassSlice'
import gradeCategoryReducer from './GradeCategorySlice'

export default combineReducers({
    user: loginReducer,
    teachers: teacherReducer,
    parents: parentReducer,
    students: studentReducer,
    klasses: classReducer,
    gradeCategories: gradeCategoryReducer
})




