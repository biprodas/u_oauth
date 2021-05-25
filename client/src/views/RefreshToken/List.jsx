import React, { useState} from 'react'
import { List, Datagrid, Edit, Create, SimpleForm, DateField, TextField, EditButton, TextInput, DateInput } from 'react-admin';

export default function RefreshTokenList(props) {
  
  return (
    <List {...props}>
      <Datagrid>
        <TextField source="user.name" />
        <DateField source="expiresIn" />
        <TextField source="token" />
        <DateField source="revokedAt" />
        <TextField source="replacedByToken" />
        <TextField source="isActive" />
        {/* <EditButton basePath="/users" /> */}
      </Datagrid>
    </List>
  )
}
