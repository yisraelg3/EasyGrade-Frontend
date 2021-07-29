import React from 'react'
import { useSelector } from 'react-redux'
import { List } from 'antd';
import { withRouter, Link } from 'react-router-dom'

function SecondLevelResource({resourceName, routerProps, history }) {
    // console.log(routerProps)
    const state = useSelector(state => state.admin)

    const chooseResource = () => {
        switch(resourceName) {
            case 'teachers':
                const teachersClasses = state.klasses.filter(klass => klass.teacher_id === parseInt(routerProps.match.params.id))
                return teachersClasses
            case 'students':
                const filteredGradeCategories = state.grade_categories.filter(gradeCategory => gradeCategory.student_id === parseInt(routerProps.match.params.id))
                const classIds = filteredGradeCategories.map(gradeCategory => gradeCategory.klass_id)
                const studentsClasses = state.klasses.filter(klass => classIds.includes(klass.id))
                return studentsClasses
            default:
                return ''
        }
    }

  return (
    <>
    <h1>{resourceName}</h1>
    
    <List dataSource={chooseResource()} size='large' rowKey={item => item.id} renderItem={item => { 
            return (
                <List.Item id={item.id} name={item.id}>
                    <Link to={`class/${item.id}`}>{`${item.grade} ${item.subject}`}</Link>
                </List.Item>
            )
        }}/> 
    </>
  )
}
export default withRouter(SecondLevelResource)
