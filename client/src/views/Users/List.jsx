import React, { useState} from 'react'
import { List, Datagrid, Edit, Create, SimpleForm, DateField, TextField, EditButton, TextInput, DateInput } from 'react-admin';

export default function UserList(props) {

  return (
    <List {...props}>
      <Datagrid>
        {/* <TextField source="id" /> */}
        <TextField source="name" />
        <TextField source="username" />
        <TextField source="role" />
        <TextField source="status" />
        {/* <EditButton basePath="/users" /> */}
      </Datagrid>
    </List>
  )
}
