import React from 'react'
import { Form, Input, Button, Select } from 'antd'
import {useState} from 'react'
import { withRouter, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {addClass} from './AdminSlice'

function NewClassForm({history}) {

    const teachers = useSelector(state => state.admin.teachers)
    const students = useSelector(state => state.admin.students) 

    const [formData, setFormData] = useState({
        subject: '',
        grade: '',
        locked: false,
        teacher_id: "No teacher",
        gradeCategories: '',
        currentStudents: []
    })

    const dispatch = useDispatch()

    const handleSubmit = () => {
        // const {subject, grade, locked, teacher_id, gradeCategories} = formData
        // const newVals = values.gradeCategories ? [gradeCategories, ...values.gradeCategories] : []
        fetch(`http://localhost:3000/klasses`, {
            method: 'POST',
            headers: {"Content-type":"application/json", 
            "Authorization":`"Bearer ${localStorage.token}"`},
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
        history.push('/home')
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
      <>
       <Link to='/home'> ↩︎ Back</Link>
    <Form labelCol={{ span: 24, offset: 11 }} wrapperCol= {{ span: 7, offset: 8}} onFinish={handleSubmit}>
        <Form.Item label='Subject' >
            <Input id='subject' name='subject' value={formData.subject} onChange={handleChange}/>
        </Form.Item>
        <Form.Item label='Grade' >
            <Input id='grade' name='grade' value={formData.grade} onChange={handleChange}/>
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
        <Form.Item >
                <Button type="primary" htmlType='submit'>Add Class</Button>
        </Form.Item>
        <Form.Item >
                <Button type="primary" onClick={handleClick}>Close</Button>
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
    </>
  )
}
export default withRouter(NewClassForm)