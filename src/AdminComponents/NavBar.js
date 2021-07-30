import { Button } from 'antd'
import React from 'react'
import { useDispatch } from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'
import { logOut } from '../AdminComponents/AdminSlice'

function NavBar({history}) {

    const dispatch = useDispatch()

    const handleClick = () => {
        dispatch(logOut())
        localStorage.clear()
    }

  return (
      <div>
    <Button onClick={()=>history.goBack()}> ↩︎ Back</Button>
    <NavLink to="/home" activeStyle={{ fontWeight: "bold", color: "blue", position: 'absolute', top: '0%', left: '50%' }}>Home</NavLink>
    <NavLink to="/"><Button onClick={handleClick}>Log out</Button></NavLink>
    </div>
  )
}
export default withRouter(NavBar)