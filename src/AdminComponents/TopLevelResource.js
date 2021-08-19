import React from 'react'
import { Button, List } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { deleteStudent } from '../redux/StudentSlice'
import { deleteParent } from '../redux/ParentSlice'
import { deleteClass } from '../redux/ClassSlice'
import { deleteTeacher } from '../redux/TeacherSlice'

function TopLevelResource({currentResource, history, searchTerm}) {
    
    const state = useSelector(state => state)
    const token = useSelector(state => state.user.token) 
    const accountType = useSelector(state => state.user.accountType)    

    const dispatch = useDispatch()
    
    const filteredresource = () => {
        switch (currentResource) {
            case 'teachers':
                return state.teachers.filter(row => mapCurrentArray(row).toLowerCase().includes(searchTerm.toLowerCase()))
            case 'klasses':
                return state.klasses.filter(row => mapCurrentArray(row).toLowerCase().includes(searchTerm.toLowerCase()))
            case 'students':
                return state.students.filter(row => mapCurrentArray(row).toLowerCase().includes(searchTerm.toLowerCase()))
            case 'parents':
                return state.parents.filter(row => mapCurrentArray(row).toLowerCase().includes(searchTerm.toLowerCase()))
            default:
                return ''
        }
    }

    const mapCurrentArray = (item) => {
        switch (currentResource) {
            case 'teachers':
                return item.professional_title
            case 'klasses':
                const teacher = state.teachers.find(teacher => teacher.id === item.teacher_id)
                return `${item.grade} ${item.subject} ${accountType === 'Admin' && teacher ?`- ${teacher.professional_title}` : ''}`
            case 'students':
                return `${item.first_name} ${item.last_name}`
            case 'parents':
                return item.username
            default:
                return ''
        }
    }

    const forDispatch = (id) => {
        switch (currentResource) {
            case 'teachers':
               return dispatch(deleteTeacher(id))
            case 'klasses':
                return dispatch(deleteClass(id))
            case 'students':
                return dispatch(deleteStudent(id))
            case 'parents':
                const defaultParent = state.parent.find(parent => parent.username === 'parent')
                return dispatch(deleteParent({id: id, defaultParent}))
            default: 
                return ''
        }
    }

    const handleDelete = (e) => {
        // console.log(parseInt(e.currentTarget.dataset.id))
        const id = parseInt(e.currentTarget.dataset.id)
        if (currentResource === 'teachers' && state.klass.find(klass => klass.teacher_id === id)) {
            if (!window.confirm("This teacher is still assigned to a class. "+
            "If deleted the class will be \nunassigned and will have no teacher, continue?")) {
                return
            }
        }
        fetch(`http://localhost:3000/${currentResource}/${id}`, {
            method: 'DELETE',
            headers: {
                "Content-type":"application/json",
                "Authorization" : `"Bearer ${token}"`
            }
        })
        .then(res => res.json())
        .then(deletedObj => {
            console.log(currentResource)
            if (deletedObj.id) {
                forDispatch(id)
            } else {
                alert(deletedObj.errors)
            }
        })
    }

    
    const handleEdit = (e) => {
        const id = parseInt(e.currentTarget.dataset.id)
        history.push(`/edit/${currentResource}/${id}`)
    }

    const actions = (item) => {
        switch (currentResource) {
            case 'teachers': return ([
                <Button data-id={item.id} onClick={() => history.push(`/teachers/${item.id}`)} key="more">More...</Button>,
                <Button data-id={item.id} onClick={handleEdit} key="edit">edit</Button>,
                <Button data-id={item.id} onClick={handleDelete} key="delete">delete</Button>
            ])
            case 'students':
                return (accountType === 'Admin' ?  [
                    <Button data-id={item.id} onClick={()=> history.push(`/students/${item.id}/report_card`)} key="report_card">Report Card</Button>,
                    // <Button data-id={item.id} onClick={()=> history.push(`/students/${item.id}/classes`)} key="classes">Subjects</Button>,
                    <Button data-id={item.id} onClick={handleEdit} key="edit">edit</Button>,
                    <Button data-id={item.id} onClick={handleDelete} key="delete">delete</Button> ]
                    :
                    [<Button data-id={item.id} onClick={()=> history.push(`/students/${item.id}/report_card`)} key="report_card">Report Card</Button>]
                )
            case 'klasses':
                return (accountType === 'Admin' ? [
                    <Button data-id={item.id} onClick={()=> history.push(`/classes/${item.id}/report_card`)} key="report_card">Report Card</Button>,
                    <Button data-id={item.id} onClick={handleEdit} key="edit">edit</Button>,
                    <Button data-id={item.id} onClick={handleDelete} key="delete">delete</Button>]
                    : 
                    [<Button data-id={item.id} onClick={()=> history.push(`/classes/${item.id}/report_card`)} key="report_card">Report Card</Button>]
                    )
            case 'parents':
                return ([
                <Button data-id={item.id} onClick={()=> history.push(`/parents/${item.id}`)} key="students">Students</Button>,
                <Button data-id={item.id} onClick={handleEdit} key="edit">edit</Button>,
                <Button data-id={item.id} onClick={handleDelete} key="delete">delete</Button>
                ])
                default:
                    return ''
        }
    }

  return (
    <>
        <List dataSource={filteredresource()} size='large' rowKey={item => item.id} renderItem={item => { 
            if (item.professional_title !== "No teacher" && item.username !== 'parent') {
            return (
                <List.Item id={item.id} name={item.id} actions={actions(item)}>
                    {mapCurrentArray(item)}
                </List.Item>
            )}
        }}/> 
    </>
  )
}
export default withRouter(TopLevelResource)