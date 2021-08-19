import React from 'react'
import { Form, Input, Button, Select, List, Modal } from 'antd'
import { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateClass } from '../redux/ClassSlice'
import { withRouter } from 'react-router-dom'

function EditClassForm({routerProps, history}) {

    const {id} = routerProps.match.params
    const klasses = useSelector(state => state.klasses)
    const teachers = useSelector(state => state.teachers)
    const students = useSelector(state => state.students) 
    const grade_categories = useSelector(state => state.gradeCategories) 
    const token = useSelector(state => state.user.token)
    const year = useSelector(state => state.user.year)
    // console.log(students)
    const dispatch = useDispatch()

    const klass = klasses.find(klass => klass.id === parseInt(id)) || 
    {subject: '' , grade: '', locked: false, teacher_id: "", gradeCategories: '', students: []}

    const teacher = teachers.find(teacher => teacher.id === klass.teacher_id) || {id: "No teacher"}
    // debugger
    
    const class_students_ids = useMemo(() => {
        const class_students = grade_categories.filter(grade_category => grade_category.klass_id === klass.id && grade_category.year === year)
        return [...new Set(class_students.map(class_student => class_student.student_id))]
    },[grade_categories, klass.id, year])

    const [formData, setFormData] = useState({})
    // console.log(formData) 
    useEffect(() => {setFormData({
        subject: klass.subject,
        grade: klass.grade,
        locked: false,
        teacher_id: teacher.id,
        gradeCategories: '',
        addStudents: [],
        currentStudents: [...class_students_ids]
    })},[teacher.id, klass.grade, klass.subject, year, class_students_ids])

      const handleChange = (e) => {
        //   console.log(e.target.value)
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }           

    const handleSubmit = (e) => {
        const {subject, grade, locked, teacher_id, gradeCategories, currentStudents} = formData
        fetch(`http://localhost:3000/klasses/${id}`, {
            method: 'PATCH',
            headers: {
                "Content-type":"application/json",
                "Authorization" : `"Bearer ${token}"`
            },
            body: JSON.stringify({subject, grade, locked, teacher_id, gradeCategories, currentStudents, year: year})
        })
        .then(res => res.json())
        .then(updatedObj => {
            console.log(updatedObj)
            if (updatedObj.klass) {
                dispatch(updateClass(updatedObj))
                history.push('/home')
            } else {
                alert(updatedObj.errors)
            }
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
            addStudents: e,
            currentStudents: [...new Set([...formData.currentStudents, ...e])]
        })
    }

    const teacherOptions = teachers.map(teacher => {
        // console.log(teacher.id)
        return <Select.Option key={teacher.id} value={teacher.id}>{teacher.professional_title}</Select.Option>
    })

    const studentOptions = students.map(student => {
        // console.log(student.id)
        return <Select.Option key={student.id} value={student.id}>{`${student.first_name} ${student.last_name}`}</Select.Option>
    })
     //   console.log(current_students) 

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

// console.log("currentStudents:", formData.currentStudents)
  return (
      <>
      <Modal centered title={`Edit Class: ${klass.grade} ${klass.subject}`} visible={true} onCancel={()=>history.goBack()} footer={null}>
      <Form labelCol={{ offset: 2, span: 5}} wrapperCol= {{ span: 15}} onFinish={handleSubmit}>
        <Form.Item label='Grade' >
            <Input id='grade' name='grade' value={formData.grade} onChange={handleChange}/>
        </Form.Item>
        <Form.Item label='Subject' >
            <Input id='subject' name='subject' value={formData.subject} onChange={handleChange}/>
        </Form.Item>
        <Form.Item label='Teacher' >
            <Select name='teacher' id='teacher' value={formData.teacher_id} placeholder='Select Teacher' onChange={teacherChange}>
                {teacherOptions}
            </Select>
        </Form.Item>
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
        console.log(student)
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
export default withRouter(EditClassForm)