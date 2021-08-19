import React, { useState } from 'react'
import { Table, Input, Typography, Form, Button, Switch, Space } from 'antd';
import { useSelector,useDispatch } from 'react-redux'
import { withRouter} from 'react-router-dom'
import { updateGradeCategoriesByStudent } from '../redux/GradeCategorySlice'
import { DownloadOutlined, ExportOutlined } from '@ant-design/icons';
import jsPDF from "jspdf";
import "jspdf-autotable";

export function numericSort (array) {
  return (array.sort(function(a, b) {
    return a - b;
  }))
}
function StudentsGrades({routerProps, history}) {
// console.log(routerProps)
  const dispatch = useDispatch()

  const state = useSelector(state => state)
  const user = state.user
  const id = user.id
  const accountType = user.accountType
  const professional_title = user.professional_title
  // const class_id = parseInt(routerProps.match.params.class_id)
  const token = user.token
  const year = user.year

  const student_id = parseInt(routerProps.match.params.student_id)
  const teacher_id = accountType === 'Teacher' ? id : parseInt(routerProps.match.params.teacher_id)

  const teacher = state.teachers ? state.teachers.find(teacher => teacher_id === teacher.id) : ''
  const teachersKlassIds = state.klasses.filter(klass => klass.teacher_id === teacher_id).map(klass => klass.id)

  const teacherName = accountType === 'Teacher' ? professional_title : teacher ? teacher.professional_title : '' 

  
  // const studentGradesForIndClass = gradeCategories.filter(grade => grade.student_id === student_id && grade.klass_id === class_id && grade.year === year)
  const studentGradesForAllClasses = state.gradeCategories.filter(grade => grade.student_id === student_id && grade.year === year)
  console.log(studentGradesForAllClasses)

  const name = studentGradesForAllClasses[0] ? studentGradesForAllClasses[0].name : ''
  const grade = studentGradesForAllClasses[0] ? studentGradesForAllClasses[0].grade : ''
  
  const years = numericSort([...new Set(state.gradeCategories.map(gc => gc.year))])
  let Semesters = numericSort([...new Set(studentGradesForAllClasses.map(grade => grade.semester))]) || []

  const lastYear = Math.max(...years)
  const lastSemester = Math.max(...Semesters)

  const [locked, setLocked] = useState(false)
  const [edit, setEdit] = useState(false)
  const [newSemester, setNewSemester] = useState([])

// const dataForIndClass = studentGradesForIndClass.map(grade => { 
//   return {subject: grade.subject, grade: grade.student_grade, key: grade.id}
// })

// const dataForAllClasses = studentGradesForAllClasses.map(grade => { 
//   return {subject: grade.subject, grade: grade.student_grade, key: grade.id, class_id: grade.klass_id, semester: grade.semester}});

// const data = class_id ? dataForIndClass : dataForAllClasses

    const dataFunc = (addSemester=newSemester) => {
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
        // console.log(klass)
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
      cell = Object.assign({...cell}, {comments: grade.comment})
      cellData = cellData.filter(cd => cd.subject !== cell.subject)
      cellData = [...cellData, cell]
    })
    return cellData
  }

    let data = dataFunc()
    // console.log(data)
    const [formData, setFormData] = useState(data)

    const handleFinish = () =>{
      let submitData = [...formData]
      if (accountType === 'Teacher') {
        submitData = formData.filter(element => teachersKlassIds.includes(element.key))
      }
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
        body: JSON.stringify({student_id: student_id, data: submitData, locked, year: year})
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
    // console.log('data:',formData)
    // console.log('formData:',formData)

    const handleEdit = () => {
      if (formData.length < 1) {
        setFormData(data)
      }
      const toggle = !edit
      setEdit(toggle)
    }

    // const handleCancel = () => {
    //   const toggle = !edit
    //   setEdit(toggle)
    // }

    const handleLock = () => {
      const toggle = !locked
      setLocked(toggle)
    }

    const handleChange = (e,r,s,i) => {
      // console.log(e,r,s,i)
      // debugger
      // const newRecord = Object.assign({...r}, {[s]: e.target.value})
      const formDataCopy = [...formData]
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
console.log(data)
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
          dataIndex: semester,
          key: semester,
          render: (text, record, index) => {
            if (accountType === 'Admin') {
              return edit ? <Input size='small' onChange={(event) => handleChange(event, record, semester, index)} value={formData[index][semester]}/> 
              : <Typography.Text className={teachersKlassIds.includes(record.key) ? 'belongsTo' : ''}>{text}</Typography.Text>
            } else if (accountType === 'Teacher') {
              return edit && teachersKlassIds.includes(record.key) && year === lastYear && semester === lastSemester ? <Input size='small' onChange={(event) => handleChange(event, record, semester, index)} value={formData[index][semester]}/> 
              : <Typography.Text className={teachersKlassIds.includes(record.key) ? 'belongsTo' : ''}>{text}</Typography.Text>
            } else if (accountType === 'Parent') {
              return <Typography.Text >{text}</Typography.Text>
            } 
        }
  })}),
  {
    title: 'Comments',
    dataIndex: 'comments',
    key: 'comments',
    fixed: 'right',
    render: (text, record, index) => {
      if (accountType === 'Admin') {
        return edit ? <Input.TextArea size='small' onChange={(event) => handleCommentChange(event, index)} value={formData[index].comments}/> 
        : <Typography.Text className={teachersKlassIds.includes(record.key) ? 'belongsTo' : ''}>{text}</Typography.Text>
      } else if (accountType === 'Teacher') {
        return edit && teachersKlassIds.includes(record.key) ? <Input.TextArea size='small' onChange={(event) => handleCommentChange(event, index)} value={formData[index].comments}/> 
        : <Typography.Text className={teachersKlassIds.includes(record.key) ? 'belongsTo' : ''}>{text}</Typography.Text>
      } else if (accountType === 'Parent') {
        return <Typography.Text >{text}</Typography.Text>
      } 
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
   cell.push(data.subject)
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
  doc.autoTable(content);
    if (save) {
      doc.save("report.pdf")
    } else {
      doc.output('dataurlnewwindow', {})
    }

}

  return (
    <div className='grade-page'>
    {teacher_id ? <><h1>{teacherName}</h1>
    <h2>{grade}</h2>
    <h2>{name}</h2>
    <h4 className='belongsTo'>Subjects in this color indicate that {teacherName} teaches that subject.</h4></> 
    :<>
    <h2>{grade}</h2>  
    <h1>{name}</h1></>}
    {accountType === 'Admin' ? <><Button onClick={addSemester}>Add new Semester</Button> {newSemester.length > 0 ? <Button onClick={removeSemester}>Remove new Semester</Button> : ''} </>:''}
    <Space className='pdf-buttons'><Button type='primary' shape='round' onClick={() => exportPDF()} icon={<DownloadOutlined/>}>PDF</Button> <Button type='primary' shape='round' onClick={() => exportPDF(false)} icon={<ExportOutlined />}>PDF</Button></Space>
    <Form onFinish={handleFinish} >
      <Table bordered columns={columns} dataSource={formData.length > 0 && data.length > 0 ? formData : data} pagination={false} />
      {accountType !== 'Parent' ? edit ? <> <Button type='primary' htmlType= 'submit'>Save</Button> </>: <Button type='primary' onClick={handleEdit}>Edit</Button> : ''}
      {/* <Button danger onClick={handleCancel}>Cancel</Button>  */}
      </Form>
      {accountType === 'Admin' ? <Switch checkedChildren="Unlocked" unCheckedChildren="Locked" checked={locked} onChange={handleLock}/> : ''}
  </div>
  )
}
export default withRouter(StudentsGrades)