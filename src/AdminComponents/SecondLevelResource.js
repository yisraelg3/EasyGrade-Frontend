import React from 'react'
import { List, Menu, Button } from 'antd';
import { withRouter } from 'react-router-dom'
import {useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { deleteTeacher, deleteClass, deleteStudent } from './AdminSlice'

function SecondLevelResource({resourceName, routerProps, history }) {
    // console.log(resourceName)
    
    const state = useSelector(state => state.admin)
    const year = useSelector(state => state.admin.year)
    const {id} = routerProps.match.params
    // const {teacher_id} = routerProps.match.params
    const [current, setCurrent] = useState('students')

    const token = useSelector(state => state.admin.token)    

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
                const teachersClassesPerYearIds = state.grade_categories.map(gradeCategory => {
                    if (klassIds.includes(gradeCategory.klass_id) && gradeCategory.year === year) {
                        return gradeCategory.klass_id
                    } else {
                        return ''
                    }
                })
                const teachersClassesPerYear = state.klasses.filter(klass => teachersClassesPerYearIds.includes(klass.id))

                const filteredGradeCategoryStudentIds = state.grade_categories.map(gradeCategory => {
                    if (klassIds.includes(gradeCategory.klass_id) && gradeCategory.year === year) {
                        return gradeCategory.student_id
                    } else {
                        return ''
                    }})
                const classStudents = state.students.filter(student => filteredGradeCategoryStudentIds.includes(student.id))
                // console.log(classStudents)
                return {klasses: teachersClassesPerYear, students: classStudents}
            case 'students':
                const filteredGradeCategories = state.grade_categories.filter(gradeCategory => gradeCategory.student_id === parseInt(routerProps.match.params.id) && gradeCategory.year === year)
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
    }
    
  return (
    <>
        {resourceName === 'teachers' ?
        <>
            <h1>Teachers</h1>
            {resourceTitle ? <><h2>{resourceTitle.professional_title}</h2> 
            <br/> </>: ''}
            <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
                <Menu.Item key="students">
                    Students
                </Menu.Item>
                <Menu.Item key="klasses">
                    Classes
                </Menu.Item>
            </Menu> 
            
            <List dataSource={chooseResource()[current]} size='large' rowKey={item => item.id} renderItem={item => { 
                return (
                    <List.Item id={item.id} name={item.id} actions={actions(item)}>
                        {mapCurrentArray(item)}
                    </List.Item>
                )
            }}/>
        </>
    :
        <>
            {resourceName === 'students' ? <h1>Students</h1> : ''}
            {resourceTitle ? <><h1>Parent: {resourceTitle.username}</h1> 
            <br/>
            <h2>Students</h2></> : ''}
            <List dataSource={chooseResource()} size='large' rowKey={item => item.id} renderItem={item => { 
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
