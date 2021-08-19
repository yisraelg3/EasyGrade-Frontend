export function login (user) {
    if (user.user.account_type === 'Teacher') {
        return ({
            type: "TEACHER_LOGIN",
            payload: user
        })
    } else if (user.user.account_type === 'Parent'){
        return ({
            type: "PARENT_LOGIN",
            payload: user
        })
    } else {
        return ({
            type: "LOGIN",
            payload: user
        })
    }
}
export function logOut () {
    return({
        type: "LOGOUT"
    })
}

export function addStudent (student) {
    return({
        type: "ADD_STUDENT",
        payload: student
    })
}

export function updateStudent (student) {
    return({
        type: "UPDATE_STUDENT",
        payload: student
    })
}

export function deleteStudent (id) {
    return({
        type: "DELETE_STUDENT",
        payload: id
    })
}

export function addParent (parent) {
    return({
        type: "ADD_PARENT",
        payload: parent
    })
}

export function updateParent (parent) {
    return({
        type: "UPDATE_PARENT",
        payload: parent
    })
}

export function deleteParent (parent) {
    return({
        type: "DELETE_PARENT",
        payload: parent
    })
}

export function sortKlass(array) {
    const sorted_array = array.sort(function (a, b) {
        if (a.grade < b.grade) {
            return -1;
        } else { 
            return 1;
        }
    })
    return sorted_array
}

const initialState = []

function reducer (state = initialState, action) {
    console.log(action)
    switch(action.type) {
        case "LOGIN":
            return [
                ...state,
                ...action.payload.user.students
            ]
        case "TEACHER_LOGIN":
            return [
                ...state,
                ...action.payload.user.students
            ]
        case "PARENT_LOGIN":
            return [
                ...state,
                ...action.payload.user.students
            ]
        case 'LOGOUT':
            return initialState
        case "ADD_STUDENT":
            return [
                ...state,
                action.payload.student
            ]
        case "UPDATE_STUDENT":
            const updatedStudentArray = state.map(student => {
                if (student.id === action.payload.student.id) {
                    return action.payload.student
                } else {
                    return student
                }
            })
            return [
                ...state,
                ...updatedStudentArray
            ]
        case "DELETE_STUDENT":
            // console.log("deleting Student...")
            const newStudentArray = state.filter(student => student.id!== action.payload)
            return [
                ...state,
                ...newStudentArray
            ]
        case "ADD_PARENT":
            const studentIds = action.payload.students.map(student => student.id)
            const newStudentFromParentArray = state.map(oldStudent => {
                if (studentIds.includes(oldStudent.id)) {
                    return action.payload.students.find(updatedStudent => updatedStudent.id === oldStudent.id)
                } else {
                    return oldStudent
                }
            })
            return [
                ...state,
                ...newStudentFromParentArray
            ] 
        case "UPDATE_PARENT":
            const updatedStudentIds = action.payload.students.map(student => student.id)
            const updatedStudentsFromParentArray = state.map(oldStudent => {
                if (oldStudent.id === action.payload.parent.id && !updatedStudentIds.includes(oldStudent.id)) {
                    const updatedStudent = {...oldStudent}
                    updatedStudent.parent_id = action.payload.defaultParent.id
                    return updatedStudent
                } else if (updatedStudentIds.includes(oldStudent.id)){
                    return action.payload.students.find(updatedStudent => updatedStudent.id === oldStudent.id)
                } else {
                    return oldStudent
                }
            })
            return [
                ...state,
                ...updatedStudentsFromParentArray
            ]
        case "DELETE_PARENT":
            const studentsToUnassign = state.map(oldStudent => {
                if (oldStudent.id === action.payload.id) {
                    const updatedStudent = {...oldStudent}
                    updatedStudent.parent_id = action.payload.defaultParent.id
                    return updatedStudent
                } else {
                    return oldStudent
                }
            })
            return [
                ...state,
                ...studentsToUnassign
            ]
        default:
            return state
    }
}
export default reducer