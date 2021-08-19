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

const initialState = []

function reducer (state = initialState, action) {
    console.log(action)
    switch(action.type) {
        case "LOGIN":
            return action.payload.user.grade_categories
        case "TEACHER_LOGIN":
            return action.payload.grade_categories
        case "PARENT_LOGIN":
            return action.payload.user.grade_categories
        case 'LOGOUT':
            return initialState
        case "ADD_CLASS":
            return [...state, ...action.payload.grade_categories]
        case "UPDATE_CLASS":
            const unassignedGCFromClassArray = state.filter(grade_category => grade_category.klass_id !== action.payload.klass.id)
            const updatedClassGCArray = [...unassignedGCFromClassArray, ...action.payload.grade_categories]
            return updatedClassGCArray
        case "ADD_STUDENT":
            return [...state, ...action.payload.grade_categories]
        case "UPDATE_STUDENT":
            const removedGCFromStudentArray = state.filter(grade_category => grade_category.student_id !== action.payload.student.id)
            const updatedStudentGCArray = [...removedGCFromStudentArray, ...action.payload.grade_categories]
            return updatedStudentGCArray
        case "UPDATE_GRADE_CATEGORIES_BY_CLASS":
            // debugger
            // const klass = state.klasses.find(klass => klass.id === action.payload.class_id)
            // const classgGCToUpdate = state.grade_categories.filter(gc => gc.klass_id === action.payload.class_id).map(gc => gc.id)
            // const newClassGCArray = action.payload.grade_categories.map(gc => {
            //     if (classgGCToUpdate.includes(gc.id)) {
            //         return action.payload.gradeCategoriesArray.find(gradeC => gradeC.id === gc.id)
            //     } else {
            //         return gc
            //     }
            // })
            const cleanClassGCArray = state.filter(gc => gc.klass_id !== action.payload.class_id)
            const newClassGCArray = [...cleanClassGCArray, ...action.payload.gradeCategoriesArray]
            return newClassGCArray
            case "UPDATE_GRADE_CATEGORIES_BY_STUDENT":
                // const student = state.students.find(student => student.id === action.payload.student_id)
                // const studentGCToUpdate = state.grade_categories.filter(gc => gc.student_id === action.payload.student_id).map(gc => gc.id)
                // const newStudentGCArray = state.grade_categories.map(gc => {
                //     if (studentGCToUpdate.includes(gc.id)) {
                //         return action.payload.gradeCategoriesArray.find(gradeC => gradeC.id === gc.id)
                //     } else {
                //         return gc
                //     }
                // })
                const cleanStudentGCArray = state.filter(gc => gc.student_id !== action.payload.student_id)
                const newStudentGCArray = [...cleanStudentGCArray, ...action.payload.gradeCategoriesArray]
                return newStudentGCArray
        default:
            return state
    }
}

export default reducer