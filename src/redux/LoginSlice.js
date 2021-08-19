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

export function changeYear(year) {
    return {
        type: "CHANGE_YEAR",
        payload: year 
    }
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
    accountType: '',
    id: 0,
    username: '',
    password: '',
    professional_title: '',
    token: '',
    year: 0}

function reducer (state = initialState, action) {
    console.log(action)
    switch(action.type) {
        case "LOGIN":
            let {user, token} = action.payload
            return {
                ...state,
                accountType: user.account_type,
                id: user.id,
                username: user.username,
                password: user.password,
                professional_title: user.professional_title || '',
                token: token
            }
        case "TEACHER_LOGIN":
            return {
                ...state,
                accountType: action.payload.user.account_type,
                id: action.payload.user.id,
                username: action.payload.user.username,
                password: action.payload.user.password,
                professional_title: action.payload.user.professional_title || '',
                token: action.payload.token
            }
        case "PARENT_LOGIN":
            return {
                ...state,
                accountType: action.payload.user.account_type,
                id: action.payload.user.id,
                username: action.payload.user.username,
                password: action.payload.user.password,
                token: action.payload.token
            }
        case 'LOGOUT':
            return {
                ...state,
                ...initialState
            }
        case "CHANGE_YEAR":
            return {
                 ...state,
                 year: state.year = action.payload
            } 
        default:
            return state
    }
}

export default reducer