import React from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import SignUpForm from './AdminComponents/SharedComponents/SignUpForm'
import LoginForm from './AdminComponents/SharedComponents/LoginForm'
import SecondLevelResource from './AdminComponents/SecondLevelResource'
import NewClassForm from './AdminComponents/NewClassForm'
import NewStudentForm from './AdminComponents/NewStudentForm'
import EditTeacherForm from './AdminComponents/EditTeacherForm'
import EditClassForm from './AdminComponents/EditClassForm'
import EditStudentForm from './AdminComponents/EditStudentForm'
import Home from './AdminComponents/Home'
import { useEffect } from 'react'
import { login } from './AdminComponents/AdminSlice'
import { useDispatch, useSelector } from 'react-redux'
import NavBar from './AdminComponents/NavBar'
import StudentsGrades from './AdminComponents/StudentsGrades'
import ClassGrades from './AdminComponents/ClassGrades'
import ParentTeacherHome from './TeacherComponents/ParentTeacherHome'
import { parentLogin } from './TeacherComponents/ParentSlice'
import NewParentForm from './AdminComponents/NewParentForm'
import EditParentForm from './AdminComponents/EditParentForm'


function App(props) {

  const dispatch = useDispatch()
  const accountType = useSelector(state => state.admin.accountType)

  useEffect(() => {
    if (localStorage.token) {
    fetch(`http://localhost:3000/me`, {
      headers: {"authorization": `"Bearer ${localStorage.token}"`}
    })
    .then(res => res.json())
    .then(res => {
      if (res.user) {
        if (res.user.account_type === 'Parent') {
          dispatch(parentLogin(res))
        } else {
          dispatch(login(res))
        }
      } else {
        alert("Please Login")
      }
    })
  }
  },[dispatch, accountType])

  return (
    <>
    {localStorage.token ? <NavBar/> : ''}
    <img src='/IMG-20210804-WA0072.jpg' alt='logo' className='logo'/>
    <img src='/pencil-304559_1280.png' alt='pencil' className='image'/>
    <Switch>
      <Route exact path='/'>
        <LoginForm/>
      </Route>
      <Route exact path='/admin_signup'>
        <SignUpForm className='admins'/>
      </Route>
      <Route exact path='/add_teacher'>
        <SignUpForm className='teachers'/>
      </Route>
      <Route exact path='/add_student'>
        <NewStudentForm className='students'/>
      </Route>
      <Route exact path='/add_class'>
        <NewClassForm className='klasses'/>
      </Route>
      <Route exact path='/add_parent'>
        <NewParentForm className='parents'/>
      </Route>
      <Route path='/home'>
        {accountType === 'Admin' ? <Home/> : <ParentTeacherHome/>}
      </Route>
      <Route exact path='/teachers/:id' render={routerProps => {
        return <SecondLevelResource routerProps={routerProps} resourceName='teachers'/>}}
      />
      <Route exact path='/students/:id/classes' render={routerProps => {
        return <SecondLevelResource routerProps={routerProps} resourceName='students'/>}}
      />
      <Route exact path='/teachers/:teacher_id/students/:id/classes' render={routerProps => {
        return <SecondLevelResource routerProps={routerProps} resourceName='students'/>}}
      />
      <Route exact path='/parents/:id' render={routerProps => {
        return <SecondLevelResource routerProps={routerProps} resourceName='parents'/>}}
      />
      <Route exact path='/edit/teachers/:id' render={routerProps => <EditTeacherForm routerProps={routerProps} />}/>
      <Route exact path='/edit/klasses/:id' render={routerProps => <EditClassForm routerProps={routerProps} />}/>
      <Route exact path='/edit/students/:id' render={routerProps => <EditStudentForm routerProps={routerProps} />}/>
      <Route exact path='/edit/parents/:id' render={routerProps => <EditParentForm routerProps={routerProps} />}/>

      <Route exact path='/teachers/:teacher_id/students/:student_id/report_card' render={routerProps => <StudentsGrades routerProps={routerProps} />}/>
      <Route exact path='/students/:student_id/classes/:class_id/report_card' render={routerProps => <StudentsGrades routerProps={routerProps} />}/>
      <Route exact path='/students/:student_id/report_card' render={routerProps => <StudentsGrades routerProps={routerProps} />}/>
      
      <Route exact path='/classes/:class_id/report_card' render={routerProps => <ClassGrades routerProps={routerProps} />}/>
      {/* <Route exact path='/teachers/:teacher_id/classes/:id/report_card' render={routerProps => <ClassGrades routerProps={routerProps} />}/> */}
    </Switch>
    </>
  )
}
export default withRouter(App)
