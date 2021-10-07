import React, {useState} from 'react'
import { Form, Input, Button, Select, Space } from 'antd'
import { withRouter } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {addClass} from '../redux/ClassSlice'

function NewClassForm({history}) {

    const teachers = useSelector(state => state.teachers)
    const students = useSelector(state => state.students) 
    const year = useSelector(state => state.user.year) 
    const token = useSelector(state => state.user.token) 

    const [formData, setFormData] = useState({
        subject: '',
        grade: '',
        locked: false,
        teacher_id: "No teacher",
        gradeCategories: '',
        currentStudents: [],
        year: year
    })

    const dispatch = useDispatch()

    const handleSubmit = () => {
        // const {subject, grade, locked, teacher_id, gradeCategories} = formData
        // const newVals = values.gradeCategories ? [gradeCategories, ...values.gradeCategories] : []
        fetch(`https://easygrade-backend.herokuapp.com/klasses`, {
            method: 'POST',
            headers: {"Content-type":"application/json", 
            "Authorization":`"Bearer ${token}"`},
            body: JSON.stringify(formData)
        })
        .then(res => res.json())
        .then(responseObj => {
            // console.log(responseObj)
            if (responseObj.klass) {
                dispatch(addClass(responseObj))
                setFormData({
                    subject: '',
                    grade: '',
                    locked: false,
                    teacher_id: "No teacher",
                    gradeCategories: '',
                    currentStudents: []
                })
            } else {
                alert(responseObj.errors)
            }
        })
      }
      
      const handleClick = () => {
        history.goBack()
      }
    
      const handleChange = (e) => {
        //   console.log(e)
          setFormData({
              ...formData,
              [e.target.name]: e.target.value
          })
      }

      const teacherChange = (teacher_id) => {
        //   console.log(teacher_id)
        setFormData({
            ...formData,
            teacher_id: teacher_id
        })
    }

    const studentsChange = (e) => {
        // debugger
        // console.log('e:',e)
        setFormData({
            ...formData,
            currentStudents: e
        })
    }

    // const handleDelete = (e) => {
    //     // console.log("id to delete:",parseInt(e.currentTarget.dataset.id))
    //     const student_id = parseInt(e.currentTarget.dataset.id)
    //     const newCurrentStudentsArray = formData.currentStudents.filter(currentStudent => currentStudent !== student_id)
    //     const newAddStudentsArray = formData.addStudents.filter(addStudent => addStudent !== student_id)
    //     setFormData({
    //         ...formData,
    //         addStudents: newAddStudentsArray,
    //         currentStudents: newCurrentStudentsArray
    //     })
    // }

    const options = teachers.map(teacher => {
        // console.log(teacher.id)
        return <Select.Option key={teacher.id} value={teacher.id}>{teacher.professional_title}</Select.Option>
    })

    const studentOptions = students.map(student => {
        // console.log(student.id)
        return <Select.Option key={student.id} value={student.id}>{`${student.first_name} ${student.last_name}`}</Select.Option>
    })

  return (
      <div align='center'>
      <h1>New Class</h1>
      <br/>
    <Form labelCol={{ offset: 3, span: 5}} wrapperCol= {{ span: 9}} onFinish={handleSubmit}>
        <Form.Item label='Grade' >
            <Input id='grade' name='grade' value={formData.grade} onChange={handleChange}/>
        </Form.Item>
        <Form.Item label='Subject' >
            <Input id='subject' name='subject' value={formData.subject} onChange={handleChange}/>
        </Form.Item>
        <Form.Item label='Teacher' >
            <Select name='teacher' id='teacher' value={formData.teacher_id} placeholder='Select Teacher' onChange={teacherChange}>
                {options}
            </Select>
        </Form.Item>
        <Form.Item label='Add students' >
            <Select allowClear mode='multiple' name='students' id='students' value={formData.currentStudents} placeholder='Select students' onChange={studentsChange}>
            {studentOptions}
            </Select>
        </Form.Item>
        <Form.Item style={{position:'relative', top:'99%', left: '28%'}}>
                <Space><Button type="primary" htmlType='submit'>Add Class</Button>  <Button type="primary" onClick={handleClick}>Close</Button></Space>
        </Form.Item>
    </Form>
    {/* <List 
    header= 'Current Students:' dataSource={formData.currentStudents} size='small' rowKey={item => item} renderItem={currentStudent => { 
        const student = students.find(student => student.id === currentStudent)
        return (
            <List.Item id={student.id} name={student.id} actions={[<Button data-id={student.id} onClick={handleDelete} key="delete">delete</Button>]}>
                {`${student.first_name} ${student.last_name}`}
            </List.Item>
        )
    }}/>  */}
    </div>
  )
}
export default withRouter(NewClassForm)