export function changeYear(year) {
    return {
        type: "CHANGE_YEAR",
        payload: year 
    }
}

export function login (user) {
    return ({
        type: "LOGIN",
        payload: user
    })
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

export function addClass (klass) {
    return({
        type: "ADD_CLASS",
        payload: klass
    })
}

export function updateClass (klass) {
    return({
        type: "UPDATE_CLASS",
        payload: klass
    })
}

export function deleteClass (id) {
    return({
        type: "DELETE_CLASS",
        payload: id
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

export function updateGradeCategoriesByClass (gradeCategories) {
    return({
        type: "UPDATE_GRADE_CATEGORIES_BY_CLASS",
        payload: gradeCategories
    })
}

export function updateGradeCategoriesByStudent (gradeCategories) {
    return({
        type: "UPDATE_GRADE_CATEGORIES_BY_STUDENT",
        payload: gradeCategories
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

const initialState = {
    id: 0,
    username: '',
    password: '',
    professional_title: '',
    teachers: [],
    parents: [],
    students: [],
    klasses: [],
    grade_categories: [],
    year: 0}

function reducer (state = initialState, action) {
    console.log(action)
    
    switch(action.type) {
        case "CHANGE_YEAR":
           return{
            ...state,
            year: state.year = action.payload
           } 
        case "LOGIN":
            const {user, token} = action.payload
            return {
                ...state,
                id: user.id,
                username: user.username,
                password: user.password,
                professional_title: user.name || '',
                teachers: user.teachers || [],
                parents: user.parents || [],
                students: user.students || [],
                klasses: sortKlass(user.klasses) ||[],
                grade_categories: user.grade_categories || [],
                token: token
            }
        case 'LOGOUT':
            return{
                ...state,
                ...initialState
            }
        case "ADD_TEACHER":
            return {
                ...state,
                teachers: [...state.teachers, action.payload]
            }
        case "UPDATE_TEACHER":
            const updatedTeacherArray = state.teachers.map(teacher => {
                if (teacher.id === action.payload.id) {
                    return action.payload
                } else {
                    return teacher
                }
            })
            return {
                ...state,
                teachers: updatedTeacherArray
            }
        case "DELETE_TEACHER":
        // console.log("deleting teacher...")
        const newTeacherArray = state.teachers.filter(teacher => teacher.id!== action.payload)
        return {
            ...state,
            teachers: newTeacherArray
        }
        case "ADD_CLASS":
            console.log(state.klasses)
            return {
                ...state,
                klasses: sortKlass([...state.klasses, action.payload.klass]),
                grade_categories: [...state.grade_categories, ...action.payload.grade_categories]
            }
        case "UPDATE_CLASS":
            const updatedClassArray = state.klasses.map(klass => {
                if (klass.id === action.payload.klass.id) {
                    return action.payload.klass
                } else {
                    return klass
                }
            })
            const removedFromClass = state.grade_categories.filter(grade_category => grade_category.klass_id !== action.payload.klass.id)
            const addedToClass = [...removedFromClass, ...action.payload.grade_categories]
            return {
                ...state,
                klasses: sortKlass(updatedClassArray),
                grade_categories: addedToClass
            }   
        case "DELETE_CLASS":
            // console.log("deleting Class...")
            const newClassArray = state.klasses.filter(klass => klass.id!== action.payload)
            return {
                ...state,
                klasses: newClassArray
            }
        case "ADD_STUDENT":
            return {
                ...state,
                students: [...state.students, action.payload.student],
                grade_categories: [...state.grade_categories, ...action.payload.grade_categories]
            } 
        case "UPDATE_STUDENT":
            const updatedStudentArray = state.students.map(student => {
                if (student.id === action.payload.student.id) {
                    return action.payload.student
                } else {
                    return student
                }
            })
            const removedFromStudent = state.grade_categories.filter(grade_category => grade_category.student_id !== action.payload.student.id)
            const addedToStudent = [...removedFromStudent, ...action.payload.grade_categories]
            return {
                ...state,
                students: updatedStudentArray,
                grade_categories: addedToStudent
            }   
        case "DELETE_STUDENT":
            // console.log("deleting Student...")
            const newStudentArray = state.students.filter(student => student.id!== action.payload)
            return {
                ...state,
                students: newStudentArray
            }
        case "UPDATE_GRADE_CATEGORIES_BY_CLASS":
            // debugger
            const klass = state.klasses.find(klass => klass.id === action.payload.class_id)
            const classgGCToUpdate = state.grade_categories.filter(gc => gc.klass_id === klass.id).map(gc => gc.id)
            const newClassGCArray = state.grade_categories.map(gc => {
                if (classgGCToUpdate.includes(gc.id)) {
                    return action.payload.gradeCategoriesArray.find(gradeC => gradeC.id === gc.id)
                } else {
                    return gc
                }
            })
            return {
                ...state,
                grade_categories: newClassGCArray
            }
            case "UPDATE_GRADE_CATEGORIES_BY_STUDENT":
                const student = state.students.find(student => student.id === action.payload.student_id)
                const studentGCToUpdate = state.grade_categories.filter(gc => gc.student_id === student.id).map(gc => gc.id)
                const newStudentGCArray = state.grade_categories.map(gc => {
                    if (studentGCToUpdate.includes(gc.id)) {
                        return action.payload.gradeCategoriesArray.find(gradeC => gradeC.id === gc.id)
                    } else {
                        return gc
                    }
                })
                return {
                    ...state,
                    grade_categories: newStudentGCArray
                }
        default:
            return state
    }
}

export default reducer