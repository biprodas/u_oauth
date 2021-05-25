import React from 'react'
import { Admin, Resource, fetchUtils } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';
import Cookies from 'universal-cookie';

import authProvider from './AuthProvider';
import UserList from '../views/Users/List';
import RefreshTokenList from '../views/RefreshToken/List';


const apiUrl = 'http://localhost:3900/api';
const testApiUrl = 'https://jsonplaceholder.typicode.com';

const fetchJson = (url, options = {}) => {
  if (!options.headers) {
      options.headers = new Headers({ Accept: 'application/json' });
  }
  // add your own headers here
  options.headers.set('x-total-content', 'foobar');
  return fetchUtils.fetchJson(url, options);
}

const httpClient = (url, options = {}) => {
  if (!options.headers) {
      options.headers = new Headers({ Accept: 'application/json' });
  }
  const token = localStorage.getItem('token');
  const cookies = new Cookies();
  options.headers.set('Authorization', `Bearer ${cookies.get('accessToken')}`);
  return fetchUtils.fetchJson(url, options);
}

const dataProvider = simpleRestProvider('http://localhost:3900/api', httpClient);


export default function ReactAdmin() {
  return (
    <Admin 
      // dataProvider={jsonServerProvider(testApiUrl)}
      title="My Custom Admin"
      dataProvider={dataProvider}
      authProvider={authProvider}
    >
      <Resource 
        name="users" 
        options={{ label: 'Users' }}
        list={UserList} 
        // edit={UserEdit} 
        // create={UserCreate} 
        // icon={PostIcon}
      />
      <Resource 
        name="refreshtokens" 
        options={{ label: 'Refresh Tokens' }}
        list={RefreshTokenList} 
        // edit={UserEdit} 
        // create={UserCreate} 
        // icon={PostIcon}
      />
    </Admin>
  )
}
