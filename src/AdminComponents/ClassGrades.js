import React from 'react'
import { Table, Input, Button, Form,Typography, Switch } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import {numericSort} from './StudentsGrades'
import { useState} from 'react'
import { updateGradeCategoriesByClass } from './AdminSlice'

export default function ClassGrades({routerProps}) {

  const dispatch = useDispatch()

  const class_id = parseInt(routerProps.match.params.class_id)

  const classes = useSelector(state => state.admin.klasses)
  const token = useSelector(state => state.admin.token)
  const klass = classes.find(klass => klass.id === class_id)
  const year = useSelector(state => state.admin.year)

  const gradeCategories = useSelector(state => state.admin.grade_categories)
  const classGrades = gradeCategories.filter(grade => grade.klass_id === class_id && grade.year === year) || []

  const name = klass ? `${klass.grade} ${klass.subject}`  : ''
 
  let Semesters = numericSort([...new Set(classGrades.map(grade => grade.semester))]) || []

  const [locked, setLocked] = useState(false)
  const [edit, setEdit] = useState(false)
  const [newSemester, setNewSemester] = useState([])
  
  const dataFunc = (addSemester=newSemester) => {
      // console.log(classGrades)
    let cellData = []
    classGrades.forEach((grade) => { 
      // console.log('celldata:', cellData)
      const existingStudent = cellData.find(celld => celld.student === grade.name) 
      let cell 
      if (addSemester.length > 0 && Semesters[Semesters.length-1] !== addSemester[addSemester.length-1]) {
        Semesters = Semesters.concat(addSemester)
      }
      // console.log(Semesters) 
      Semesters.forEach((semester, idx) =>  {
        cell = cell || existingStudent 
        const student = cell || {student: grade.name, key: grade.student_id}
        // console.log(student)
        if (grade.semester === semester) {
          cell = Object.assign({...student}, {[semester]: grade.student_grade})
          // console.log(cell)
        } else if (grade.semester !== semester && !student[semester]){
          cell = Object.assign({...student}, {[semester]: ''})
          // console.log(cell)
          // debugger
        } 
        // console.log(cell)
      })
      // console.log('sems:',sems)
      cellData = cellData.filter(cd => cd.student !== cell.student)
      cellData = [...cellData, cell]
    })
    return cellData
  }

    const data = dataFunc()
    const [formData, setFormData] = useState(data)
    
    // console.log(formData)
    const handleFinish = () =>{

      // console.log(formData)
      // const submitData = () => {
      //   let submitArray = []
      //   for (let [key, value] of Object.entries(formData)) {
      //     submitArray.push({student_id: student_id, student_grade: value})
      //   }
      //   return submitArray
      // }
      fetch('http://localhost:3000/grade_categories/update_class_grades',{
        method: 'PATCH',
        headers: {
          "Content-type":"application/json",
          "Authorization": `"Bearer ${token}"`
        },
        body: JSON.stringify({class_id: class_id, data:[...formData], locked, year: year})
      })
      .then(res => res.json())
      .then(gradeCategoriesArray => {
        console.log(gradeCategoriesArray)
        if (!gradeCategoriesArray.errors) {
          dispatch(updateGradeCategoriesByClass({class_id, gradeCategoriesArray}))
          handleEdit()
        } else {
          alert(gradeCategoriesArray.errors)
        }
      })
    }

    // console.log(formData)

    const handleEdit = () => {
      if (!edit) {
        setFormData(data)
      }
      const toggle = !edit
      setEdit(toggle)
    }

    const handleLock = () => {
      const toggle = !locked
      setLocked(toggle)
    }

    const handleChange = (e,r,s,i) => {
      // console.log(e, r, s, i)
      // debugger
      // const newRecord = Object.assign({...r}, {[s]: e.target.value})
      const formDataCopy = [...formData]
      // const newRecord = Object.assign({...formDataCopy[i]}, {[s]: e.target.value})
      formDataCopy[i][s] = e.target.value 
      setFormData(formDataCopy)
    }
    
    const addSemester = () => {
      const currentNewSemesters = [...newSemester]
      const lastSemester = currentNewSemesters.length > 0 ? currentNewSemesters[currentNewSemesters.length-1] : Semesters[Semesters.length-1]
      currentNewSemesters.push(lastSemester+1 || 1)
      // console.log(currentNewSemesters)
      setNewSemester(currentNewSemesters)
    }

    const removeSemester = () => {
      const currentNewSemesters = [...newSemester]
      currentNewSemesters.pop()
      // console.log(currentNewSemesters)
      setNewSemester(currentNewSemesters)
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
          dataIndex: `${semester}`,
          key: `${semester}`,
          render: (text, record, index) => {
            // console.log(text)
              return edit ? <Input size='small' onChange={(event) => handleChange(event, record, semester, index)} value={formData[index][semester]}/> 
              : <Typography.Text>{text}</Typography.Text>
            }
    })})
  ]

  return (
    <div className='grade-page'>
      <h1>{name}</h1>
      <Button onClick={addSemester}>Add new Semester</Button> {newSemester.length > 0 ? <Button onClick={removeSemester}>Remove new Semester</Button> : ''}
      <Form onFinish={handleFinish}>
      <Table bordered columns={columns} dataSource={formData.length > 0 && data.length > 0 ? formData : data} pagination={false} />
      { edit ? <> <Button type='primary' htmlType= 'submit'>Save</Button> <Button danger onClick={handleEdit}>Cancel</Button> </>: <Button type='primary' onClick={handleEdit}>Edit</Button>}
      </Form>
      <Switch checkedChildren="Unlocked" unCheckedChildren="Locked" checked={locked} onChange={handleLock}/>
    </div>
  )
}
