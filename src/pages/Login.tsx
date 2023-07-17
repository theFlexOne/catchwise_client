import { useEffect, useState } from 'react';
import useAuth from '../contexts/AuthContext/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { login } = useAuth();
  const { state } = useLocation();



  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log('username', username);
    console.log('password', password);

    const isLoggedIn = await login({ username, password });
    if (isLoggedIn) {
      navigate(state?.from ?? '/');
    }
  }

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      navigate('/');
    }
  }, [navigate])

  return (
    <div className='h-full flex justify-center items-center'>
      <div className='border rounded p-2 h-fit'>
        <form onSubmit={onSubmit} className='flex flex-col gap-2 items-center text-white'>
          <div className="flex gap-2">
            <label htmlFor="username">Username</label>
            <input
              className='text-black'
              type="text"
              name="username"
              id="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <label htmlFor="password">Password</label>
            <input
              className='text-black'
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button
            type='submit'
            className="px-2 py-1 rounded bg-neutral-600 hover:bg-neutral-700"
          >Login</button>
        </form>
      </div>
    </div>
  )
}

export default Login