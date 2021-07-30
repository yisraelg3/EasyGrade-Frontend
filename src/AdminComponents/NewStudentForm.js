import React from 'react'
import { Form, Input, Button, Row, Col, DatePicker, Select } from 'antd'
import moment from 'moment'
import {useState} from 'react'
import { withRouter } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {addStudent} from './AdminSlice'

function NewStudentForm({className, history}) {

    const classes = useSelector(state => state.admin.klasses)
    const token = useSelector(state => state.admin.token)

    const classesDisplay =
        classes.length > 0 ? 
        classes.map(klass => {return {name: `${klass.grade} ${klass.subject}`, id: klass.id }}): []

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        birth_date: moment('01/01/2015', 'MM/DD/YYYY'),
        parent_id: 0,
        picture_url: '',
        currentClasses: []
    })

    const dispatch = useDispatch()

    const handleSubmit = () => {
        fetch(`http://localhost:3000/students`, {
            method: 'POST',
            headers: {"Content-type":"application/json", 
            "Authorization":`Bearer ${token}`},
            body: JSON.stringify(formData)
        })
        .then(res => res.json())
        .then(responseObj => {
            // console.log(responseObj)
            if (responseObj.student) {
                dispatch(addStudent(responseObj))
                setFormData({
                    first_name: '',
                    last_name: '',
                    birth_date: moment('01/01/2015', 'MM/DD/YYYY'),
                    parent_id: 0,
                    picture_url: '',
                    currentClasses: []
                })
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
            currentClasses: e
        })
    }

    const handleClick = () => {
        history.push('/home')
      }

    const customFormat = value => value.format('MM/DD/YYYY')
    
    const options = classesDisplay.map(klass => <Select.Option key={klass.id} value={klass.id}>{klass.name}</Select.Option>)

  return (
      <>
      <Form labelCol={{ span: 24, offset: 11 }} wrapperCol= {{ span: 7, offset: 8}} onFinish={handleSubmit}>
            <Form.Item label='Birth Date'>
                <DatePicker name='birth_date' id='birth_date' value={formData.birth_date} onChange={dateChange} format={customFormat}/>
            </Form.Item>
            <Form.Item label='Picture URL' >
                <Input name='picture_url' id='picture_url' value = {formData.picture_url} placeholder='picture_url' onChange={handleChange} />
            </Form.Item>
            <Form.Item label='Classes' >
                <Select allowClear mode='multiple' name='classes' id='classes' value={formData.currentClasses} placeholder='Select classes' onChange={classChange}>
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
                <Button type="primary" htmlType='submit'>{className==='admins' ? 'Sign up' : `Add ${className}`}</Button>
            </Form.Item>
            <Form.Item >
                <Button type="primary" onClick={handleClick}>Close</Button>
            </Form.Item>
        </Form>
        </>
  )
}
export default withRouter(NewStudentForm)