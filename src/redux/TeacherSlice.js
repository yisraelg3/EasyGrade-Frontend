export function login (user) {
    if (user.user.account_type === 'Teacher') {
        return ({
            type: "TEACHER_LOGIN",
            payload: user
        })
    }
}

export function logOut () {
    return({
        type: "LOGOUT"
    })
}

export function addTeacher (teacher) {
    return({
        type: "ADD_TEACHER",
        payload: teacher
    })
}

export function updateTeacher (teacher) {
    return({
        type: "UPDATE_TEACHER",
        payload: teacher
    })
}

export function deleteTeacher (id) {
    return({
        type: "DELETE_TEACHER",
        payload: id
    })
}

const initialState = []

function reducer (state = initialState, action) {
    console.log(action)
    switch(action.type) {
        case "LOGIN":
            return [
                ...state,
                ...action.payload.user.teachers
            ]
        case 'LOGOUT':
            return initialState
        case "ADD_TEACHER":
            return [
                ...state,
                action.payload
            ]
        case "UPDATE_TEACHER":
            const updatedTeacherArray = state.map(teacher => {
                if (teacher.id === action.payload.id) {
                    return action.payload
                } else {
                    return teacher
                }
            })
            return [
                ...state,
                ...updatedTeacherArray
            ]
        case "DELETE_TEACHER":
            const newTeacherArray = state.filter(teacher => teacher.id !== action.payload)
            return [
                ...state,
                ...newTeacherArray
            ]
        default:
            return state
    }
}

export default reducer