import React from 'react'
import { Table, Input, Button, Form,Typography, Switch } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import {numericSort} from './StudentsGrades'
import { useState, useEffect, useMemo } from 'react'
import { updateGradeCategoriesByClass } from './AdminSlice'

export default function ClassGrades({routerProps}) {

  const dispatch = useDispatch()

  const class_id = parseInt(routerProps.match.params.class_id)

  const classes = useSelector(state => state.admin.klasses)
  const token = useSelector(state => state.admin.token)
  const klass = classes.find(klass => klass.id === class_id)

  const gradeCategories = useSelector(state => state.admin.grade_categories)
  const classGrades = gradeCategories.filter(grade => grade.klass_id === class_id)

  const name = klass ? `${klass.grade} ${klass.subject}`  : ''
 
  const Semesters = numericSort([...new Set(classGrades.map(grade => grade.semester))])

  const [locked, setLocked] = useState(false)
  const [edit, setEdit] = useState(false)
  const [formData, setFormData] = useState({})

  const data = classGrades.map(grade => { 
    return {student: grade.name, grade: grade.student_grade, key: grade.id}});

    let newState = useMemo(()=> {return {}},[])
    data.forEach(element => Object.assign(newState, {[element.key]: element.grade}))
    
    // console.log(newState)

    const handleFinish = () =>{
      const submitData = () => {
        let submitArray = []
        for (let [key, value] of Object.entries(formData)) {
          submitArray.push({id: key, student_grade: value})
        }
        return submitArray
      }
      console.log(submitData())
      fetch('http://localhost:3000/grade_categories/update_class_grades',{
        method: 'PATCH',
        headers: {
          "Content-type":"application/json",
          "Authorization": `"Bearer ${token}"`
        },
        body: JSON.stringify({id: class_id, data: submitData(), locked})
      })
      .then(res => res.json())
      .then(gradeCategoriesArray => {
        if (!gradeCategoriesArray.errors) {
          dispatch(updateGradeCategoriesByClass({class_id, gradeCategoriesArray}))
          handleEdit()
        } else {
          alert(gradeCategoriesArray.errors)
        }
      })
    }

    useEffect(() => {
      setFormData(newState)
    },[newState])

    // console.log(formData)

    const handleEdit = () => {
      const toggle = !edit
      setEdit(toggle)
    }

    const handleLock = () => {
      const toggle = !locked
      setLocked(toggle)
    }

    const handleChange = (e,r) => {
      setFormData({
        ...formData,
        [r.key]: e.target.value
      })
    }

  const columns = [
    {
      title: 'Student',
      dataIndex: 'student',
      key: 'student',
      fixed: 'left',
      width: 200,
    },
    ...Semesters.map(semester => { return ({
      title: `Semester ${semester}`,
      children: [
        {
          title: 'Grade',
          dataIndex: 'grade',
          key: 'grade',
          render: (text, record, index) => {
            // console.log(text, record, index)
            return edit ? <Input size='small' onChange={(e) => handleChange(e, record)} value={formData[record.key]}/> 
            : <Typography.Text >{text}</Typography.Text>}
        }
      ]
    })})
  ]
  return (
    <div>
      <h1>{name}</h1>
      <Form onFinish={handleFinish}>
      <Table bordered columns={columns} dataSource={data} pagination={false} />
      { edit ? <> <Button type='primary' htmlType= 'submit'>Save</Button> <Button danger onClick={handleEdit}>Cancel</Button> </>: <Button type='primary' onClick={handleEdit}>Edit</Button>}
      </Form>
      <Switch checkedChildren="Unlocked" unCheckedChildren="Locked" checked={locked} onChange={handleLock}/>
    </div>
  )
}
