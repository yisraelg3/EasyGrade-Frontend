import React from 'react'
import { useSelector } from 'react-redux'
import { List, Menu } from 'antd';
import { withRouter, Link } from 'react-router-dom'
import {useState} from 'react'

function SecondLevelResource({resourceName, routerProps, history }) {
    console.log(resourceName)
    const state = useSelector(state => state.admin)
    const {id} = routerProps.match.params
    const {teacher_id} = routerProps.match.params
    const [current, setCurrent] = useState('klasses')

    const listForTitle = () => {
        if (resourceName === 'teachers') {
            return state.teachers
        } else {
            return state.students
        }
    }
    const resourceTitle = listForTitle().find(resource => resource.id === parseInt(routerProps.match.params.id))
    console.log(resourceTitle)
    const mapCurrentArray = (item) => {
        switch (current) {
            case 'klasses':
                console.log(item)
                const teacher = state.teachers.find(teacher => teacher.id === item.teacher_id)
                return `${item.grade} ${item.subject}`
            case 'students':
                return `${item.first_name} ${item.last_name}`
            default:
                return ''
        }
    }

    const chooseResource = () => {
        switch(resourceName) {
            case 'teachers':
                const teachersClasses = state.klasses.filter(klass => klass.teacher_id === parseInt(routerProps.match.params.id))

                const klassIds = teachersClasses.map(klass => klass.id)
                const filteredGradeCategoryStudentIds = state.grade_categories.map(gradeCategory => {
                    if (klassIds.includes(gradeCategory.klass_id)) {
                        return gradeCategory.student_id
                    }})
                const classStudents = state.students.filter(student => filteredGradeCategoryStudentIds.includes(student.id))
                // console.log(classStudents)
                return {klasses: teachersClasses, students: classStudents}
            case 'students':
                const filteredGradeCategories = state.grade_categories.filter(gradeCategory => gradeCategory.student_id === parseInt(routerProps.match.params.id))
                const classIds = filteredGradeCategories.map(gradeCategory => gradeCategory.klass_id)
                const studentsClasses = state.klasses.filter(klass => classIds.includes(klass.id))
                return studentsClasses
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
            <Link to='/home'> ↩︎ Back</Link>
            <h1>Teachers</h1>
            {resourceTitle ? <><h2>{resourceTitle.professional_title}</h2> 
            <br/> </>: ''}
            <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
                <Menu.Item key="klasses">
                    Classes
                </Menu.Item>
                <Menu.Item key="students">
                    Students
                </Menu.Item>
            </Menu> 
            
            <List dataSource={chooseResource()[current]} size='large' rowKey={item => item.id} renderItem={item => { 
                return (
                    <List.Item id={item.id} name={item.id}>
                        <Link to={`/teachers/${id}/${current}/${item.id}`}>{mapCurrentArray(item)}</Link>
                    </List.Item>
                )
            }}/>
        </>
    :
        <>
            <Link to={`/teachers/${teacher_id}`}> ↩︎ Back</Link>
            {resourceName === 'students' ? <h1>Students</h1> : ''}
            {resourceTitle ? <><h2>{`${resourceTitle.first_name} ${resourceTitle.last_name}`}</h2> 
            <br/></> : ''}
            <List dataSource={chooseResource()} size='large' rowKey={item => item.id} renderItem={item => { 
                return (
                    <List.Item id={item.id} name={item.id}>
                        <Link to={`/students/${id}/classes/${item.id}`}>{`${item.grade} ${item.subject}`}</Link>
                    </List.Item>
                )
            }}/>
        </> 
        }
    </>
  )
}
export default withRouter(SecondLevelResource)
