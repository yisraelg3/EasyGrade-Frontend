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
            return sortKlass([...state, ...action.payload.user.klasses])
        case "TEACHER_LOGIN":
            return sortKlass([...state, ...action.payload.user.klasses])
        case "PARENT_LOGIN":
            return sortKlass([...state, ...action.payload.user.klasses])
        case 'LOGOUT':
            return initialState
        case "ADD_CLASS":
            return sortKlass([...state, action.payload.klass])
        case "UPDATE_CLASS":
            const updatedClassArray = state.map(klass => {
                if (klass.id === action.payload.klass.id) {
                    return action.payload.klass
                } else {
                    return klass
                }
            })
            return sortKlass(...state, ...updatedClassArray)
        case "DELETE_CLASS":
            // console.log("deleting Class...")
            const newClassArray = state.filter(klass => klass.id!== action.payload)
            return [
                ...state,
                ...newClassArray
            ]
        default:
            return state
    }
}

export default reducer