import React, { useState} from 'react'
import { List, Datagrid, Edit, Create, SimpleForm, DateField, TextField, EditButton, TextInput, DateInput } from 'react-admin';

export default function RefreshTokenList(props) {
  const [users, setusers] = useState([]);
  console.log("Mewwww", props)
  return (
    <List {...props}>
      <Datagrid>
        <TextField source="userId" />
        <TextField source="expiresIn" />
        <TextField source="token" />
        <TextField source="revokedAt" />
        <DateField source="replacedByToken" />
        <TextField source="isActive" />
        {/* <EditButton basePath="/users" /> */}
      </Datagrid>
    </List>
  )
}
