import React, {  } from 'react'
import { Form, Input, Button, Select, List, Modal } from 'antd'
import {useState, useEffect, useMemo} from 'react'
import { withRouter } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { updateParent } from '../redux/ParentSlice'
import apiHelper from '../api'

function EditParentForm({className, history, routerProps}) {
  const [formData, setFormData] = useState({})

  const {id} = routerProps.match.params
  const parents = useSelector(state => state.parents)
  const parent = parents.find(parent => parent.id === parseInt(id)) || {username: '', password: ''}
  const students = useSelector(state => state.students)
  const token = useSelector(state => state.user.token)
  const filteredStudentIds = useMemo(() => [...new Set(students.filter(student => student.parent_id === parseInt(id)).map(student => student.id))], [id, students])
  
  useEffect(() => {setFormData({
    username: parent.username,
    password: parent.password,
    addStudents: [],
    currentStudents: filteredStudentIds
})},[parent.username, parent.password, filteredStudentIds])

  const dispatch = useDispatch()

  const handleSubmit = () => {
      const defaultParent = parents.find(parent => parent.username === 'parent')
      const {username, password, currentStudents} = formData
    fetch(`${apiHelper()}/parents/${id}`, {
        method: 'PATCH',
        headers: {"Content-type":"application/json", "Authorization":`Bearer ${token}`},
        body: JSON.stringify({username, password, currentStudents})
    })
    .then(res => res.json())
    .then(responseObj => {
        console.log(responseObj)
        if (responseObj.parent) {
            const {parent, students} = responseObj
            dispatch(updateParent({parent, students, defaultParent}))
            history.push('/home')
        } else {
            alert(responseObj.errors)
        }
    })
  }

  const handleChange = (e) => {
      setFormData({
          ...formData,
          [e.target.name]: e.target.value
      })
  }

  const studentsChange = (e) => {
    // debugger
    // console.log('e:',e)
    setFormData({
        ...formData,
        addStudents: e,
        currentStudents: [...new Set([...formData.currentStudents, ...e])]
    })
  }

  const handleDelete = (e) => {
    // console.log("id to delete:",parseInt(e.currentTarget.dataset.id))
    const student_id = parseInt(e.currentTarget.dataset.id)
    const newCurrentStudentsArray = formData.currentStudents.filter(currentStudent => currentStudent !== student_id)
    const newAddStudentsArray = formData.addStudents.filter(addStudent => addStudent !== student_id)
    setFormData({
        ...formData,
        addStudents: newAddStudentsArray,
        currentStudents: newCurrentStudentsArray
    })
}

  const studentOptions = students.map(student => {
    // console.log(student.id)
    return <Select.Option key={student.id} value={student.id}>{`${student.first_name} ${student.last_name}`}</Select.Option>
  })
// console.log('addStudentArr:', formData.addStudents)
// console.log('currentStudents', formData.currentStudents)
  return (
    <>
        <Modal centered title={`Edit Parent: ${parent.username}`} visible={true} onCancel={()=>history.goBack()} footer={null}>
        <Form labelCol={{ offset: 2, span: 5}} wrapperCol= {{ span: 15}} onFinish={handleSubmit}>
            <Form.Item label='Username' >
                <Input name='username' id='username' value = {formData.username} placeholder='Username' onChange={handleChange} />
            </Form.Item>
            {/* <Form.Item label='Password'>
                <Input.Password name='password' id='password' value = {formData.password} placeholder='Password' onChange={handleChange} />
            </Form.Item > */}
            <Form.Item label='Add students' >
                <Select allowClear mode='multiple' name='students' id='students' value={formData.addStudents} placeholder='Select students' onChange={studentsChange}>
                    {studentOptions}
                </Select>
            </Form.Item>
            <Form.Item style={{position:'relative', top:'99%', left: '75%'}}>
                    <Button type="primary" htmlType='submit'>Update</Button>
            </Form.Item>
        </Form>
        <List 
        header= 'Current Students:' dataSource={formData.currentStudents} size='small' rowKey={item => item} renderItem={currentStudent => { 
        const student = students.find(student => student.id === currentStudent)
        // console.log(student)
        return (
            <List.Item id={student.id} name={student.id} actions={[<Button data-id={student.id} onClick={handleDelete} key="delete">delete</Button>]}>
                {`${student.first_name} ${student.last_name}`}
            </List.Item>
        )
    }}/> 
    </Modal>
    </>
  )
}
export default withRouter(EditParentForm)