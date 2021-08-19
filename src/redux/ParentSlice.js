export function login (user) {
    if (user.user.account_type === 'Parent'){
        return ({
            type: "PARENT_LOGIN",
            payload: user
        })
    }
}

export function logOut () {
    return({
        type: "LOGOUT"
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

const initialState = []

function reducer (state = initialState, action) {
    switch(action.type) {
        case "LOGIN":
            return action.payload.user.parents
        case 'LOGOUT':
            return initialState
        case "ADD_PARENT":
            return [
                ...state,
                action.payload.parent
            ]
        case "UPDATE_PARENT":
            const updatedParentArray = state.map(parent => {
                if (parent.id === action.payload.parent.id) {
                    return action.payload.parent
                } else {
                    return parent
                }
            })
            return updatedParentArray
        case "DELETE_PARENT":
            // console.log("deleting Student...")
            const newParentArray = state.filter(parent => parent.id !== action.payload.id)
            return newParentArray
        default:
            return state
    }
}
export default reducer