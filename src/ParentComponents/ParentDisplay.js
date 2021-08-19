import React from 'react'
import { Button, List } from 'antd';
import { useSelector } from 'react-redux'
import { withRouter} from 'react-router-dom'

function ParentDisplay({history}) {

    const students = useSelector(state => state.students)

    const handleClick = (item) => {
        history.push(`/students/${item.id}/report_card`)
    }

  return (
    <List dataSource={students} size='large' rowKey={item => item.id} renderItem={item => { 
        return (
            <List.Item id={item.id} name={item.id} 
            actions={[<Button data-id={item.id} onClick={()=>handleClick(item)} key="report_card">Report Card</Button>]}>
                {`${item.first_name} ${item.last_name}`}
            </List.Item>
        )
    }}/> 
  )
}
export default withRouter(ParentDisplay)
