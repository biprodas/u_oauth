import React, { useState} from 'react'
import { List, Datagrid, Edit, Create, SimpleForm, DateField, TextField, EditButton, TextInput, DateInput } from 'react-admin';

export default function UserList(props) {
  const [users, setusers] = useState([]);
  console.log("Mewwww", props)
  return (
    <List {...props}>
      <Datagrid>
        <TextField source="id" />
        <TextField source="name" />
        <DateField source="username" />
        <TextField source="role" />
        <TextField source="phone" />
        <EditButton basePath="/users" />
      </Datagrid>
    </List>
  )
}
