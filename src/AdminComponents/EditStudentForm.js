import React from 'react'
import { Form, Input, Button, Select, Row, Col, DatePicker, List } from 'antd'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateStudent } from './AdminSlice'
import { withRouter } from 'react-router-dom'
import moment from 'moment'

function EditStudentForm({routerProps, history}) {

    const {id} = routerProps.match.params
    const classes = useSelector(state => state.admin.klasses)
    const students = useSelector(state => state.admin.students) 
    const grade_categories = useSelector(state => state.admin.grade_categories) || []
    const token = useSelector(state => state.admin.token)
    // console.log(students)
    const dispatch = useDispatch()

    const student = students.find(student => student.id === parseInt(id)) || 
    {first_name: '' , last_name: '', birth_date: '', parent_id: 0, picture_url: '', classes: []}

    // const teacher = teachers.find(teacher => teacher.id === klass.teacher_id) || {id: "No teacher"}

    const studentClasses = grade_categories.filter(grade_category => grade_category.student_id === student.id) 
    const studentClassIds = studentClasses.map(studentClass => studentClass.klass_id)
    // console.log("class_students_ids:", class_students_ids)
    const [formData, setFormData] = useState({})
    useEffect(() => {setFormData({
        first_name: student.first_name,
        last_name: student.last_name,
        birth_date: moment('01/01/2015', 'MM/DD/YYYY'),
        parent_id: student.parent_id,
        picture_url: student.picture_url,
        addClasses: [],
        currentClasses: studentClassIds
    })},[student.birth_date, student.first_name, student.last_name, student.parent_id, student.picture_url])

      const classesDisplay =
        classes.length > 0 ? 
        classes.map(klass => {return {name: `${klass.grade} ${klass.subject}`, id: klass.id }}): []

      const handleChange = (e) => {
        //   console.log(e.target.value)
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }           

    const handleSubmit = (e) => {
        const {first_name, last_name, birth_date, parent_id, picture_url, currentClasses} = formData
        fetch(`http://localhost:3000/students/${id}`, {
            method: 'PATCH',
            headers: {
                "Content-type":"application/json",
                "Authorization" : `"Bearer ${token}"`
            },
            body: JSON.stringify({first_name, last_name, birth_date, parent_id, picture_url, currentClasses})
        })
        .then(res => res.json())
        .then(updatedObj => {
            // console.log(updatedObj)
            if (updatedObj.student) {
                dispatch(updateStudent(updatedObj))
                history.push('/home')
            } else {
                alert(updatedObj.errors)
            }
        })
    }

    const dateChange = (moment, string) =>{
        setFormData({
            ...formData,
            birth_date: moment
        })
    }

    const classChange = (e) => {
        console.log(e)
        setFormData({
            ...formData,
            addClasses: e,
            currentClasses: [...new Set([...formData.currentClasses, ...e])]
        })
    }

    const customFormat = value => {
        // console.log(value)
        return value ? value.format('MM/DD/YYYY') : ''
    }
    
    const options = classesDisplay.map(klass => {
            // console.log(klass.name)
            return (
                <Select.Option key={klass.id} value={klass.id}>{klass.name}</Select.Option>
        )
    })
     //   console.log(current_students) 

     const handleDelete = (e) => {
        // console.log("id to delete:",parseInt(e.currentTarget.dataset.id))
        const class_id = parseInt(e.currentTarget.dataset.id)
        const newCurrentClassesArray = formData.currentClasses.filter(currentClass => currentClass !== class_id)
        const newAddClassesArray = formData.addClasses.filter(addClass => addClass !== class_id)
        setFormData({
            ...formData,
            addClasses: newAddClassesArray,
            currentClasses: newCurrentClassesArray
        })
    }

  return (
      <>
      {/* <h1>{student.professional_title}</h1> */}
      <Form labelCol={{ span: 24, offset: 11 }} wrapperCol= {{ span: 7, offset: 8}} onFinish={handleSubmit}>
            <Form.Item label='Birth Date'>
                <DatePicker name='birth_date' id='birth_date' value={formData.birth_date} onChange={dateChange} format={customFormat}/>
            </Form.Item>
            <Form.Item label='Picture URL' >
                <Input name='picture_url' id='picture_url' value = {formData.picture_url} placeholder='picture_url' onChange={handleChange} />
            </Form.Item>
            <Form.Item label='Classes' >
                <Select allowClear mode='multiple' name='classes' id='classes' value={formData.classes} placeholder='Select classes' onChange={classChange}>
                {options}
                </Select>
            </Form.Item>
            <Row justify='center'>
                <Col span={6}>
                    <Form.Item label='First name' labelCol={{ span: 5, offset: 0}} wrapperCol= {{ span: 20, offset: 1}}>
                        <Input name='first_name' id='first_name' value = {formData.first_name} placeholder='First Name' onChange={handleChange} />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label='Last name' labelCol={{ span: 5, offset: 2 }} wrapperCol= {{ span: 20, offset: 1}}>
                        <Input name='last_name' id='last_name' value = {formData.last_name} placeholder='Last Name' onChange={handleChange} />
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item wrapperCol={{ offset: 11 }}>
                <Button type="primary" htmlType='submit'>Update</Button>
            </Form.Item>
        </Form>
        <List header= 'Current Classes:' dataSource={formData.currentClasses} size='small' rowKey={item => item} renderItem={currentClass => { 
        const klass = classes.find(klass => klass.id === currentClass)
        
            return (
                <List.Item id={klass.id} name={klass.id} actions={[<Button data-id={klass.id} onClick={handleDelete} key="delete">delete</Button>]}>
                    {`${klass.grade} ${klass.subject}`}
                </List.Item>
            )
        }}/> 
    </>
  )
}
export default withRouter(EditStudentForm)