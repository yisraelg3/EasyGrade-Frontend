import React, { useState } from 'react'
import { List, Menu, Button } from 'antd';
import { withRouter, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { deleteClass } from '../redux/ClassSlice'
import { deleteStudent } from '../redux/StudentSlice'
import { deleteTeacher } from '../redux/TeacherSlice'
import SearchBar from './SearchBar';

function SecondLevelResource({resourceName, routerProps, history }) {
    // console.log(resourceName)
    
    const state = useSelector(state => state)
    const year = useSelector(state => state.user.year)
    const {id} = routerProps.match.params
    // const {teacher_id} = routerProps.match.params
    const [current, setCurrent] = useState('students')
    const [searchTerm, setSearchTerm] = useState('')

    const token = useSelector(state => state.user.token)    

    const dispatch = useDispatch()

    const listForTitle = () => {
        if (resourceName === 'teachers') {
            return state.teachers
        } else if (resourceName === 'students') {
            return state.students
        } else if (resourceName === 'parents') {
            return state.parents
        }
    }

    const resourceTitle = listForTitle().find(resource => resource.id === parseInt(routerProps.match.params.id))
    
    const filteredResource = () => {
        if (resourceName === 'teachers') {
            switch (current) {
                case 'klasses':
                    return chooseResource()[current].filter(row => mapCurrentArray(row).toLowerCase().includes(searchTerm.toLowerCase()))
                case 'students':
                    return chooseResource()[current].filter(row => mapCurrentArray(row).toLowerCase().includes(searchTerm.toLowerCase()))
                default:
                    return ''
            }
        } else if (resourceName === 'parents') {
            return chooseResource().filter(row => (`${row.first_name} ${row.last_name}`).toLowerCase().includes(searchTerm.toLowerCase()))
        }
    }

    const mapCurrentArray = (item) => {
        switch (current) {
            case 'klasses':
                // console.log(item)
                return `${item.grade} ${item.subject}`
            case 'students':
                return `${item.first_name} ${item.last_name}`
            default:
                return ''
        }
    }

    const handleEdit = (e) => {
        const id = parseInt(e.currentTarget.dataset.id)
        if (resourceName === 'teachers') {
            history.push(`/edit/${current}/${id}`)
        } else if (resourceName === 'parents') {
            history.push(`/edit/parents/${id}`)
        }
    }

    const handleDelete = (e) => {
        // console.log(parseInt(e.currentTarget.dataset.id))
        const id = parseInt(e.currentTarget.dataset.id)
        if (resourceName === 'teachers' && state.klasses.find(klass => klass.teacher_id === id)) {
            if (!window.confirm("This teacher is still assigned to a class. "+
            "If deleted the class will be \nunassigned and will have no teacher, continue?")) {
                return
            }
        }
        fetch(`http://localhost:3000/${resourceName}/${id}`, {
            method: 'DELETE',
            headers: {
                "Content-type":"application/json",
                "Authorization" : `"Bearer ${token}"`
            }
        })
        .then(res => res.json())
        .then(deletedObj => {
            if (deletedObj.id) {
                forDispatch(id)
            } else {
                alert(deletedObj.errors)
            }
        })
    }

    const forDispatch = (id) => {
        switch (resourceName) {
            case 'teachers':
               return dispatch(deleteTeacher(id))
            case 'klasses':
                return dispatch(deleteClass(id))
            case 'students':
                return dispatch(deleteStudent(id))
            default: 
                return ''
        }
    }


    const actions = (item) => {
        if (resourceName === 'teachers') {
            if (current === 'students') {
                return ([
                <Button data-id={item.id} onClick={()=> history.push(`/teachers/${id}/students/${item.id}/report_card`)} key="report_card">Report Card</Button>,
                // <Button data-id={item.id} onClick={()=> history.push(`/teachers/${id}/students/${item.id}/classes`)} key="classes">Subjects</Button>,
                // <Button data-id={item.id} onClick={()=> history.push(`/students/${item.id}/report_card`)} key="report_card">Report Card</Button>,
                // <Button data-id={item.id} onClick={()=> history.push(`/students/${item.id}/classes`)} key="classes">Subjects</Button>,
                <Button data-id={item.id} onClick={handleEdit} key="edit">edit</Button>,
                <Button data-id={item.id} onClick={handleDelete} key="delete">delete</Button>
                ])
            } else if (current === 'klasses'){
                return ([
                    // <Button data-id={item.id} onClick={()=> history.push(`/teachers/${id}/classes/${item.id}/report_card`)} key="report_card">Report Card</Button>,
                    <Button data-id={item.id} onClick={()=> history.push(`/classes/${item.id}/report_card`)} key="report_card">Report Card</Button>,
                    <Button data-id={item.id} onClick={handleEdit} key="edit">edit</Button>,
                    <Button data-id={item.id} onClick={handleDelete} key="delete">delete</Button>
                ])
            }
        } else if (resourceName === 'students') {
            return ([
                <Button data-id={item.id} onClick={()=> history.push(`/students/${id}/classes/${item.id}/report_card`)} key="report_card">Report Card</Button>,
                <Button data-id={item.id} onClick={handleEdit} key="edit">edit</Button>,
                <Button data-id={item.id} onClick={handleDelete} key="delete">delete</Button>
            ])
        } else if (resourceName === 'parents') {
            return ([
                <Button data-id={item.id} onClick={()=> history.push(`/students/${item.id}/report_card`)} key="report_card">Report Card</Button>
                // <Button data-id={item.id} onClick={handleEdit} key="edit">edit</Button>,
                // <Button data-id={item.id} onClick={handleDelete} key="delete">delete</Button>
            ])
        }
    }

    const chooseResource = () => {
        switch(resourceName) {
            case 'teachers':
                const teachersClasses = state.klasses.filter(klass => klass.teacher_id === parseInt(routerProps.match.params.id))
                const klassIds = teachersClasses.map(klass => klass.id)
                const teachersClassesPerYearIds = state.gradeCategories.map(gradeCategory => {
                    if (klassIds.includes(gradeCategory.klass_id) && gradeCategory.year === year) {
                        return gradeCategory.klass_id
                    } else {
                        return ''
                    }
                })
                const teachersClassesPerYear = state.klasses.filter(klass => teachersClassesPerYearIds.includes(klass.id))

                const filteredGradeCategoryStudentIds = state.gradeCategories.map(gradeCategory => {
                    if (klassIds.includes(gradeCategory.klass_id) && gradeCategory.year === year) {
                        return gradeCategory.student_id
                    } else {
                        return ''
                    }})
                const classStudents = state.students.filter(student => filteredGradeCategoryStudentIds.includes(student.id))
                // console.log(classStudents)
                return {klasses: teachersClassesPerYear, students: classStudents}
            case 'students':
                const filteredGradeCategories = state.gradeCategories.filter(gradeCategory => gradeCategory.student_id === parseInt(routerProps.match.params.id) && gradeCategory.year === year)
                const classIds = filteredGradeCategories.map(gradeCategory => gradeCategory.klass_id)
                const studentsClasses = state.klasses.filter(klass => classIds.includes(klass.id))
                return studentsClasses
            case 'parents':
                const filteredStudents = state.students.filter(student => student.parent_id === parseInt(routerProps.match.params.id))
                return filteredStudents
            default:
                return ''
        }
    }
    
    const handleClick = (e) => {
        // console.log(e)
        setCurrent(e.key)
        setSearchTerm('')
    }
    
  return (
    <>
        {resourceName === 'teachers' ?
        <>
            <h1>Teachers</h1>
            <div className='home-containers'>
            <div id='add-buttons'>
                <h2 className='new-h2'>New</h2>
                <Button type='primary' shape='round'size='large'><Link to='/add_teacher'>New Teacher</Link></Button>
                <Button type='primary' shape='round'size='large'><Link to='/add_class'>New Class</Link></Button>
                <Button type='primary' shape='round'size='large'><Link to='/add_student'>New Student</Link></Button>
                <Button type='primary' shape='round'size='large'><Link to='/add_parent'>New Parent</Link></Button>
                <span style={{borderTop:'solid', borderStyle:'groove'}}></span>
                <Button type='primary' shape='round'size='large' style={{backgroundColor:'blueviolet'}}><Link to='/add_semester'>New Semester</Link></Button>
                <Button type='primary' shape='round'size='large' style={{backgroundColor:'darkblue'}}><Link to='/add_year'>New School Year</Link></Button>
            </div>
            <div className='home-menu'>
            {resourceTitle ? <><h2>{resourceTitle.professional_title}</h2> 
            <br/> </>: ''}
            <span style={{paddingRight:'200px'}}><SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} /></span>
            <br/>
            <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal" style={{fontSize:'13pt', justifyContent: 'normal', fontWeight:'bold'}}>
                <Menu.Item key="students">
                    Students
                </Menu.Item>
                <Menu.Item key="klasses">
                    Classes
                </Menu.Item>
            </Menu> 
            
            <List dataSource={filteredResource()} size='large' rowKey={item => item.id} renderItem={item => { 
                return (
                    <List.Item id={item.id} name={item.id} actions={actions(item)}>
                        {mapCurrentArray(item)}
                    </List.Item>
                )
            }}/>
            </div>
            </div>
        </>
    :
        <>
            {resourceName === 'students' ? <h1>Students</h1> : ''}
            {resourceTitle ? <><h1>Parent: {resourceTitle.username}</h1> 
            <br/>
            <h2>Students</h2></> : ''}
            <List dataSource={filteredResource()} size='large' rowKey={item => item.id} renderItem={item => { 
                return (
                    <List.Item id={item.id} name={item.id} actions={actions(item)}>
                        {`${item.first_name} ${item.last_name}`}
                    </List.Item>
                )
            }}/>
        </> 
        }
    </>
  )
}
export default withRouter(SecondLevelResource)
