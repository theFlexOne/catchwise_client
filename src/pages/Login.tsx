import { useEffect, useState } from 'react';
import useAuth from '../contexts/AuthContext/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import Form from '../components/Form';
import TextField from '../components/TextField';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { login } = useAuth();
  const { state } = useLocation();



  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log('username', email);
    console.log('password', password);

    const isLoggedIn = await login({ email, password });
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
    <div className='h-full flex flex-col gap-8 justify-center items-center'>
      <Form onSubmit={onSubmit} header="Log In">
        <TextField id='email' label='Email' name='email' placeholder='example@aol.com' value={email} onChange={e => setEmail(e.target.value)} />
        <TextField id='password' label='Password' name='password' type='password' value={password} onChange={e => setPassword(e.target.value)} />
        <button
          type='submit'
          className="py-3 rounded bg-amber-600 hover:bg-amber-700 text-white font-medium w-full"
        >Log In</button>
      </Form>
      <p>
        New to Catchwise?
        <a href="/signup" className="text-amber-600 hover:text-amber-700"> Sign up here!</a>
      </p>
    </div>
  )
}

export default Login