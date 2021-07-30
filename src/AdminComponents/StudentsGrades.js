import React from 'react'
import { Table, Input, Typography, Form, Button, Switch } from 'antd';
import { useSelector,useDispatch } from 'react-redux'
import { withRouter} from 'react-router-dom'
import { useState, useEffect, useMemo } from 'react'
import { updateGradeCategoriesByStudent } from './AdminSlice'

export function numericSort (array) {
  return (array.sort(function(a, b) {
    return a - b;
  }))
}
function StudentsGrades({routerProps, history}) {
// console.log(routerProps)
  const dispatch = useDispatch()

  const student_id = parseInt(routerProps.match.params.student_id)
  const teacher_id = parseInt(routerProps.match.params.teacher_id)
  const class_id = parseInt(routerProps.match.params.class_id)
  const token = useSelector(state => state.admin.token)

  const gradeCategories = useSelector(state => state.admin.grade_categories)
  const teachersKlassIds = useSelector(state => state.admin.klasses).filter(klass => klass.teacher_id === teacher_id).map(klass => klass.id)
  console.log(teachersKlassIds)
  const studentGradesForIndClass = gradeCategories.filter(grade => grade.student_id === student_id && grade.klass_id === class_id)
  const studentGradesForAllClasses = gradeCategories.filter(grade => grade.student_id === student_id)
  const name = studentGradesForAllClasses[0] ? studentGradesForAllClasses[0].name : ''
  
  const Semesters = numericSort([...new Set(studentGradesForAllClasses.map(grade => grade.semester))])
  // const years = yearsAndSemesters.map(set => set.year)
  // const semesters = yearsAndSemesters.map(set => set.semester)
// console.log(Semesters)

const dataForIndClass = studentGradesForIndClass.map(grade => { 
  return {subject: grade.subject, grade: grade.student_grade, key: grade.id, style:{color:'red'}}});

const dataForAllClasses = studentGradesForAllClasses.map(grade => { 
  return {subject: grade.subject, grade: grade.student_grade, key: grade.id, class_id: grade.klass_id}});
console.log(dataForAllClasses)
const data = class_id ? dataForIndClass : dataForAllClasses

let newState = useMemo(()=> {return {}},[])
    data.forEach(element => Object.assign(newState, {[element.key]: element.grade}))
    
    // console.log(newState)

    const [edit, setEdit] = useState(false)
    const [locked, setLocked] = useState(false)
    const [formData, setFormData] = useState({})

    const handleFinish = () =>{
      const submitData = () => {
        let submitArray = []
        for (let [key, value] of Object.entries(formData)) {
          submitArray.push({id: key, student_grade: value})
        }
        return submitArray
      }
      // console.log(submitData())
      fetch('http://localhost:3000/grade_categories/update_student_grades',{
        method: 'PATCH',
        headers: {
          "Content-type":"application/json",
          "Authorization": `"Bearer ${token}"`
        },
        body: JSON.stringify({id: student_id, data: submitData(), locked})
      })
      .then(res => res.json())
      .then(gradeCategoriesArray => {
        if (!gradeCategoriesArray.errors) {
          // console.log(gradeCategoriesArray)
          dispatch(updateGradeCategoriesByStudent({student_id, gradeCategoriesArray}))
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
    title: 'Subject',
    dataIndex: 'subject',
    key: 'subject',
    fixed: 'left',
    width: 100,
    render: (text, record, index) => {
    return <Typography.Text className={teachersKlassIds.includes(record.class_id) ? 'belongsTo' : ''}>{text}</Typography.Text>}
  },
  ...Semesters.map(semester => { return ({
    title: `Semester ${semester}`,
    children: [
      {
        title: 'Grade',
        dataIndex: 'grade',
        key: 'grade',
        render: (text, record, index) => {
          return edit ? <Input size='small' onChange={(e) => handleChange(e, record)} value={formData[record.key]}/> 
          : <Typography.Text className={teachersKlassIds.includes(record.class_id) ? 'belongsTo' : ''}>{text}</Typography.Text>}
      }
    ]
  })})
]

// console.log(columns)

  return (
    <>
    <h1>{name}</h1>
    <Form onFinish={handleFinish}>
      <Table bordered columns={columns} dataSource={data} pagination={false} />
      { edit ? <> <Button type='primary' htmlType= 'submit'>Save</Button> <Button danger onClick={handleEdit}>Cancel</Button> </>: <Button type='primary' onClick={handleEdit}>Edit</Button>}
      </Form>
      <Switch checkedChildren="Unlocked" unCheckedChildren="Locked" checked={locked} onChange={handleLock}/>
  </>
  )
}
export default withRouter(StudentsGrades)