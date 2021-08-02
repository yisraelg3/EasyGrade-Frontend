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
  const year = useSelector(state => state.admin.year)

  const teacher = useSelector(state => state.admin.teachers).find(teacher => teacher_id === teacher.id)
  const teacherName = teacher ? teacher.professional_title : ''
  const gradeCategories = useSelector(state => state.admin.grade_categories)
  const teachersKlassIds = useSelector(state => state.admin.klasses).filter(klass => klass.teacher_id === teacher_id).map(klass => klass.id)
  // console.log(teachersKlassIds)
  const studentGradesForIndClass = gradeCategories.filter(grade => grade.student_id === student_id && grade.klass_id === class_id && grade.year === year)
  const studentGradesForAllClasses = gradeCategories.filter(grade => grade.student_id === student_id && grade.year === year)
  const name = studentGradesForAllClasses[0] ? studentGradesForAllClasses[0].name : ''
  
  let Semesters = numericSort([...new Set(studentGradesForAllClasses.map(grade => grade.semester))]) || []

  const [locked, setLocked] = useState(false)
  const [edit, setEdit] = useState(false)
  const [newSemester, setNewSemester] = useState([])

// const dataForIndClass = studentGradesForIndClass.map(grade => { 
//   return {subject: grade.subject, grade: grade.student_grade, key: grade.id}
// })

const dataForAllClasses = studentGradesForAllClasses.map(grade => { 
  return {subject: grade.subject, grade: grade.student_grade, key: grade.id, class_id: grade.klass_id, semester: grade.semester}});

// const data = class_id ? dataForIndClass : dataForAllClasses

    const dataFunc = (addSemester=newSemester) => {
      // console.log(classGrades)
    let cellData = []
    studentGradesForAllClasses.forEach((grade) => { 
      // console.log('celldata:', cellData)
      const existingClass = cellData.find(celld => celld.subject === grade.subject) 
      let cell 
      if (addSemester.length > 0 && Semesters[Semesters.length-1] !== addSemester[addSemester.length-1]) {
        Semesters = Semesters.concat(addSemester)
      }
      // console.log(Semesters) 
      Semesters.forEach((semester, idx) =>  {
        cell = cell || existingClass 
        const klass = cell || {subject: grade.subject, key: grade.klass_id}
        // console.log(student)
        if (grade.semester === semester) {
          cell = Object.assign({...klass}, {[semester]: grade.student_grade})
          // console.log(cell)
        } else if (grade.semester !== semester && !klass[semester]){
          cell = Object.assign({...klass}, {[semester]: ''})
          // console.log(cell)
          // debugger
        } 
        // console.log(cell)
      })
      // console.log('sems:',sems)
      cellData = cellData.filter(cd => cd.subject !== cell.subject)
      cellData = [...cellData, cell]
    })
    return cellData
  }

    const data = dataFunc()
    const [formData, setFormData] = useState(data)

    const handleFinish = () =>{
      // const submitData = () => {
      //   let submitArray = []
      //   for (let [key, value] of Object.entries(formData)) {
      //     submitArray.push({id: key, student_grade: value})
      //   }
      //   return submitArray
      // }
      // console.log(submitData())
      fetch('http://localhost:3000/grade_categories/update_student_grades',{
        method: 'PATCH',
        headers: {
          "Content-type":"application/json",
          "Authorization": `"Bearer ${token}"`
        },
        body: JSON.stringify({student_id: student_id, data:[...formData], locked, year: year})
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
      const newRecord = Object.assign({...r}, {[s]: e.target.value})
      const formDataCopy = [...formData]
      formDataCopy[i] = newRecord
      setFormData(formDataCopy)
    }

    const addSemester = () => {
      const currentNewSemesters = [...newSemester]
      const lastSemester = currentNewSemesters.length > 0 ? currentNewSemesters[currentNewSemesters.length-1] : Semesters[Semesters.length-1]
      currentNewSemesters.push(lastSemester+1 || 1)
      console.log(currentNewSemesters)
      setNewSemester(currentNewSemesters)
    }

    const removeSemester = () => {
      const currentNewSemesters = [...newSemester]
      currentNewSemesters.pop()
      console.log(currentNewSemesters)
      setNewSemester(currentNewSemesters)
    }

const columns = [
  {
    title: 'Subject',
    dataIndex: 'subject',
    key: 'subject',
    fixed: 'left',
    width: 100,
    render: (text, record, index) => {
    return <Typography.Text className={teachersKlassIds.includes(record.key) ? 'belongsTo' : ''}>{text}</Typography.Text>}
  },
  ...Semesters.map(semester => { return ({
          title: `Semester ${semester}`,
          dataIndex: `${semester}`,
          key: `${semester}`,
          render: (text, record, index) => {
            console.log(record)
            return edit ? <Input size='small' onChange={(event) => handleChange(event, record, semester, index)} value={formData[index][semester]}/> 
            : <Typography.Text className={teachersKlassIds.includes(record.key) ? 'belongsTo' : ''}>{text}</Typography.Text>
        }
  })})
]

// console.log(columns)

  return (
    <div className='grade-page'>
    {teacher_id ? <><h1>{teacherName}</h1>
    <h2>{name}</h2>
    <h4 className='belongsTo'>Subjects in this color indicate that {teacherName} teaches that subject.</h4></> 
    :  <h1>{name}</h1>}
    <Button onClick={addSemester}>Add new Semester</Button> {newSemester.length > 0 ? <Button onClick={removeSemester}>Remove new Semester</Button> : ''}
    <Form onFinish={handleFinish} >
      <Table bordered columns={columns} dataSource={data} pagination={false} />
      { edit ? <> <Button type='primary' htmlType= 'submit'>Save</Button> <Button danger onClick={handleEdit}>Cancel</Button> </>: <Button type='primary' onClick={handleEdit}>Edit</Button>}
      </Form>
      <Switch checkedChildren="Unlocked" unCheckedChildren="Locked" checked={locked} onChange={handleLock}/>
  </div>
  )
}
export default withRouter(StudentsGrades)