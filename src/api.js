export default function apiHelper(){
    if (process.env.REACT_APP_API_URL){
        return process.env.REACT_APP_API_URL
    } else {
        return 'https://easygrade-backend.herokuapp.com'
    }
}
