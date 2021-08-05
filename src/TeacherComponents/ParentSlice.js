export function parentLogin (user) {
    return ({
        type: "PARENT_LOGIN",
        payload: user
    })
}

export function changeYear(year) {
    return {
        type: "CHANGE_YEAR",
        payload: year 
    }
}
export function parentLogOut () {
    return({
        type: "LOGOUT"
    })
}

const initialState = {
    accountType: '',
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
    switch(action.type) {
        case "PARENT_LOGIN":
            console.log(action)
            return {
                ...state,
                accountType: action.payload.user.account_type,
                id: action.payload.user.id,
                username: action.payload.user.username,
                password: action.payload.user.password,
                students: action.payload.user.students || [],
                klasses: action.payload.user.klasses || [],
                grade_categories: action.payload.user.grade_categories || [],
                token: action.payload.token
            }
        case "CHANGE_YEAR":
           return {
                ...state,
                year: state.year = action.payload
           } 
        case 'LOGOUT':
            return{
                ...state,
                ...initialState
            }
        default:
            return {
                ...state
            }
    }
}
export default reducer