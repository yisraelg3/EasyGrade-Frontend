import React from 'react'
import { Button, List } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { deleteTeacher, deleteClass, deleteStudent } from './AdminSlice'

function TopLevelResource({currentResource, history}) {
    
    const state = useSelector(state => state.admin)
    const token = useSelector(state => state.admin.token)    

    const dispatch = useDispatch()

    const mapCurrentArray = (item) => {
        switch (currentResource) {
            case 'teachers':
                return item.professional_title
            case 'klasses':
                const teacher = state.teachers.find(teacher => teacher.id === item.teacher_id)
                return `${item.grade} ${item.subject} — ${teacher.professional_title}`
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
            default: 
                return ''
        }
    }

    const handleDelete = (e) => {
        // console.log(parseInt(e.currentTarget.dataset.id))
        const id = parseInt(e.currentTarget.dataset.id)
        if (currentResource === 'teachers' && state.klasses.find(klass => klass.teacher_id === id)) {
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
                return ([
                    <Button data-id={item.id} onClick={()=> history.push(`/students/${item.id}/report_card`)} key="report_card">Report Card</Button>,
                    <Button data-id={item.id} onClick={()=> history.push(`/students/${item.id}/classes`)} key="classes">Subjects</Button>,
                    <Button data-id={item.id} onClick={handleEdit} key="edit">edit</Button>,
                    <Button data-id={item.id} onClick={handleDelete} key="delete">delete</Button>
                ])
            case 'klasses':
                return ([
                    <Button data-id={item.id} onClick={()=> history.push(`/classes/${item.id}/report_card`)} key="report_card">Report Card</Button>,
                    <Button data-id={item.id} onClick={handleEdit} key="edit">edit</Button>,
                    <Button data-id={item.id} onClick={handleDelete} key="delete">delete</Button>
                ])
            case 'parents':
                return ([
                <Button data-id={item.id} onClick={handleEdit} key="edit">edit</Button>,
                <Button data-id={item.id} onClick={handleDelete} key="delete">delete</Button>
                ])
                default:
                    return ''
        }
    }

  return (
    <>
        <List dataSource={state[currentResource]} size='large' rowKey={item => item.id} renderItem={item => { 
            if (item.professional_title !== "No teacher") {
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