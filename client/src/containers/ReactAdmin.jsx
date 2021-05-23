import React from 'react'
import { Admin, Resource } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';
import jsonServerProvider from 'ra-data-json-server';

import authProvider from './AuthProvider';

import UserList from '../views/Users/List';
import RefreshTokenList from '../views/RefreshToken/List';

const apiUrl = 'http://localhost:3900/api/v1';
const testApiUrl = 'https://jsonplaceholder.typicode.com';


export default function ReactAdmin() {
  return (
    <Admin 
      dataProvider={jsonServerProvider(testApiUrl)}
      authProvider={authProvider}
    >
      <Resource 
        name="users" 
        list={UserList} 
        // edit={UserEdit} 
        // create={UserCreate} 
        // icon={PostIcon}
      />
      <Resource 
        name="refreshtokens" 
        list={RefreshTokenList} 
        // edit={UserEdit} 
        // create={UserCreate} 
        // icon={PostIcon}
      />
    </Admin>
  )
}
