import React, { useEffect,useState } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [name,setName] = useState('');
  const [token,setToken] = useState('');
  const [expiredToken,setExpiredToken] = useState('');
  const [users,setUsers] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    refreshtoken();
    getUser();
  },[]);

  const refreshtoken = async() => {
    try {
      const response = await axios.get('http://localhost:5000/token');
      setToken(response.data.accessToken);
      const decode = jwt_decode(response.data.accessToken);
      setName(decode.name);
      setExpiredToken(decode.exp);
    } catch (error) {
      if(error.response){
        navigate('/');
      }
    }
  }
  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(async(config) => {
    const curentDate = new Date().getTime();
    if (expiredToken * 1000 < curentDate) {
        const response = await axios.get('http://localhost:5000/token');
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        const decode = jwt_decode(response.data.accessToken);
        setName(decode.name);
        setExpiredToken(decode.exp);
      }
      return config;
  }, (error) => {
    return Promise.reject(error);
  });

  const getUser = async() => {
    const response =  await axiosJWT.get('http://localhost:5000/users',{
      headers: {
        Autorization: `Bearer ${token}`
      }
    });
    setUsers(response.data);
      
  }
  return (
    <div className='container mt-5'>
      <h1 >Wellcome Back: {name} </h1>
      <a onClick={getUser} className="button is-info">Get Users</a>
      <table className='table is-striped is-fullwidth'>
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user,index) => (  
          <tr key={user.id}>
            <td>{index+1}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
          </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Dashboard
