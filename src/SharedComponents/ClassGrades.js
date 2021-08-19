import React from 'react'
import { Table, Input, Button, Form,Typography, Switch, Space } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import {numericSort} from './StudentsGrades'
import { useState} from 'react'
import { updateGradeCategoriesByClass } from '../redux/GradeCategorySlice'
import { DownloadOutlined, ExportOutlined } from '@ant-design/icons';
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function ClassGrades({routerProps}) {

  const dispatch = useDispatch()

  const classes = useSelector(state => state.klasses)
  const token = useSelector(state => state.user.token)
  const year = useSelector(state => state.user.year)
  const accountType = useSelector(state => state.user.accountType)
  const gradeCategories = useSelector(state => state.gradeCategories)

  const class_id = parseInt(routerProps.match.params.class_id)

  const klass = classes.find(klass => klass.id === class_id)

  const classGrades = gradeCategories.filter(grade => grade.klass_id === class_id && grade.year === year) || []

  const name = klass ? `${klass.grade} ${klass.subject}`  : ''

  const years = numericSort([...new Set(gradeCategories.map(gc => gc.year))])
  let Semesters = numericSort([...new Set(classGrades.map(grade => grade.semester))]) || []

  const lastYear = Math.max(...years)
  const lastSemester = Math.max(...Semesters)

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
      cell = Object.assign({...cell}, {comments: grade.comment})
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
      if (formData.length < 1) {
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

    const handleCommentChange = (event, index) => {
      const formDataCopy = [...formData]
      formDataCopy[index].comments = event.target.value 
      setFormData(formDataCopy)
  }
  console.log(formData)
    
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
            if (accountType === 'Admin') {  
              return edit ? <Input size='small' onChange={(event) => handleChange(event, record, semester, index)} value={formData[index][semester]}/> 
                : <Typography.Text>{text}</Typography.Text>
            } else  if (accountType === 'Teacher'){
              return edit && year === lastYear && semester === lastSemester ? <Input size='small' onChange={(event) => handleChange(event, record, semester, index)} value={formData[index][semester]}/> 
                : <Typography.Text>{text}</Typography.Text>
            }
          }
    })}),
    {
      title: 'Comments',
      dataIndex: 'comments',
      key: 'comments',
      fixed: 'right',
      render: (text, record, index) => {
        return edit ? <Input.TextArea size='small' onChange={(event) => handleCommentChange(event, index)} value={formData[index].comments}/> 
        : <Typography.Text>{text}</Typography.Text>
      }
    }
  ]

  const exportPDF = (save=true) => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    const title = `Report Card for ${name} - School year ${year}`;
    const headers = [columns.map(column => column.title)]
    const tableData = formData.length > 0 && data.length > 0 ? formData : data

   const dataArray = tableData.map(data => {
     const cell = []
     cell.push(data.student)
     if (data[1] !== undefined) {cell.push(data[1])} 
     if (data[2] !== undefined) {cell.push(data[2])} 
     if (data[3] !== undefined) {cell.push(data[3])} 
     if (data[4] !== undefined) {cell.push(data[4])} 
     if (data[5] !== undefined) {cell.push(data[5])} 
     if (data[6] !== undefined) {cell.push(data[6])}
     cell.push(data.comments)
    //  console.log(cell)
     return cell
   })
   console.log(dataArray)
    const exportData = dataArray

    let content = {
      startY: 50,
      head: headers,
      body: exportData
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    if (save) {
      doc.save("report.pdf")
    } else {
      doc.output('dataurlnewwindow', {})
    }
  }

  return (
    <div className='grade-page'>
      <h1>{name}</h1>
      {accountType === 'Admin' ? <><Button onClick={addSemester}>Add new Semester</Button> {newSemester.length > 0 ? <Button onClick={removeSemester}>Remove new Semester</Button> : ''}</>:''}
      <Space className='pdf-buttons'><Button type='primary' shape='round' onClick={() => exportPDF()} icon={<DownloadOutlined/>}>PDF</Button> <Button type='primary' shape='round' onClick={() => exportPDF(false)} icon={<ExportOutlined />}>PDF</Button></Space>
      <Form onFinish={handleFinish}>
      <Table bordered columns={columns} dataSource={formData.length > 0 && data.length > 0 ? formData : data} pagination={false} />
      { edit ? <> <Button type='primary' htmlType= 'submit'>Save</Button> </>: <Button type='primary' onClick={handleEdit}>Edit</Button>}
      {/* <Button danger onClick={handleEdit}>Cancel</Button>  */}
      </Form>
      {accountType === 'Admin' ?  <Switch checkedChildren="Unlocked" unCheckedChildren="Locked" checked={locked} onChange={handleLock}/> : ''}
    </div>
  )
}
