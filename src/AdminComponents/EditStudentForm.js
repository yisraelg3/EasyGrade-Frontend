import React from 'react'
import { Form, Input, Button, Select, List, Divider, Modal } from 'antd'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateStudent } from '../redux/StudentSlice'
import { withRouter } from 'react-router-dom'
import moment from 'moment'

function EditStudentForm({routerProps, history}) {

    const {id} = routerProps.match.params
    const classes = useSelector(state => state.klasses)
    const students = useSelector(state => state.students) 
    const grade_categories = useSelector(state => state.gradeCategories) || []
    const token = useSelector(state => state.user.token)
    const year = useSelector(state => state.user.year)
    // console.log(students)
    const dispatch = useDispatch()

    const student = students.find(student => student.id === parseInt(id)) || 
    {first_name: '' , last_name: '', birth_date: '', parent_id: 0, picture_url: '', classes: []}

    // const teacher = teachers.find(teacher => teacher.id === klass.teacher_id) || {id: "No teacher"}

    const studentClasses = grade_categories.filter(grade_category => grade_category.student_id === student.id && grade_category.year === year) 
    const studentClassIds = [...new Set(studentClasses.map(studentClass => studentClass.klass_id))]
    // console.log("class_students_ids:", studentClassIds)
    const [formData, setFormData] = useState({})
    useEffect(() => {setFormData({
        first_name: student.first_name,
        last_name: student.last_name,
        birth_date: moment('01/01/2015', 'MM/DD/YYYY'),
        parent_id: student.parent_id,
        picture_url: student.picture_url,
        addClasses: [],
        currentClasses: studentClassIds
    })},[student.birth_date, student.first_name, student.last_name, student.parent_id, student.picture_url, year])

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
            body: JSON.stringify({first_name, last_name, birth_date, parent_id, picture_url, currentClasses, year: year})
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

    // const dateChange = (moment, string) =>{
    //     setFormData({
    //         ...formData,
    //         birth_date: moment
    //     })
    // }

    const classChange = (e) => {
        console.log(e)
        setFormData({
            ...formData,
            addClasses: e,
            currentClasses: [...new Set([...formData.currentClasses, ...e])]
        })
    }

    // const customFormat = value => {
    //     // console.log(value)
    //     return value ? value.format('MM/DD/YYYY') : ''
    // }
    
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
      <Modal centered title={`Edit Student: ${student.first_name} ${student.last_name}`} visible={true} onCancel={()=>history.goBack()} footer={null}>
        <Form labelCol={{ offset: 2, span: 5}} wrapperCol= {{ span: 15}} onFinish={handleSubmit}>
                <Form.Item label='First name'>
                    <Input name='first_name' id='first_name' value = {formData.first_name} placeholder='First Name' onChange={handleChange} />
                </Form.Item>
                <Form.Item label='Last name'>
                    <Input name='last_name' id='last_name' value = {formData.last_name} placeholder='Last Name' onChange={handleChange} />
                </Form.Item>
                <Divider/>
                {/* <Form.Item label='Birth Date'>
                    <DatePicker name='birth_date' id='birth_date' value={formData.birth_date} onChange={dateChange} format={customFormat}/>
                </Form.Item> */}
                {/* <Form.Item label='Picture URL' >
                    <Input name='picture_url' id='picture_url' value = {formData.picture_url} placeholder='picture_url' onChange={handleChange} />
                </Form.Item> */}
                <Form.Item label='Add Classes' >
                    <Select allowClear mode='multiple' name='classes' id='classes' value={formData.classes} placeholder='Select classes' onChange={classChange}>
                    {options}
                    </Select>
                </Form.Item>
                <Form.Item style={{position:'relative', top:'99%', left: '75%'}}>
                    <Button type="primary" htmlType='submit'>Update</Button>
                </Form.Item>
            </Form>
            <List header= 'Current Classes:' dataSource={formData.currentClasses} size='small' rowKey={item => item} renderItem={currentClass => { 
            const klass = classes.find(klass => klass.id === currentClass)
            console.log(klass)
                return (
                    <List.Item id={klass.id} name={klass.id} actions={[<Button data-id={klass.id} onClick={handleDelete} key="delete">delete</Button>]}>
                        {`${klass.grade} ${klass.subject}`}
                    </List.Item>
                )
            }}/> 
        </Modal>
    </>
  )
}
export default withRouter(EditStudentForm)