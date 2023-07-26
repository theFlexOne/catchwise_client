import { useState } from "react";
import Form from "../components/Form";
import TextField from '../components/TextField';
import useAuth from "../contexts/AuthContext/useAuth";
import { Link, useLocation, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { state } = useLocation();
  const navigate = useNavigate();

  const { signup } = useAuth();


  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log({ email, password });
    const isSignedUp = await signup({ email, password });
    if (isSignedUp) {
      const redirectPath = state?.redirectPath || '/';
      navigate(redirectPath);
    }
  }

  return (
    <div className='h-full flex flex-col gap-8 justify-center items-center'>
      <Form onSubmit={handleSubmit} header="SignUp">
        <TextField id='email' label='Email' name='email' placeholder='example@aol.com' value={email} onChange={e => setEmail(e.target.value)} />
        <TextField id='password' label='Password' name='password' type='password' value={password} onChange={e => setPassword(e.target.value)} />
        <button
          type='submit'
          className="py-3 rounded bg-amber-600 hover:bg-amber-700 text-white font-medium w-full"
        >SignUp</button>
      </Form>
      <p>
        Already have an account?
        <Link to="/login" className="text-amber-600 hover:text-amber-700"> Log in here!</Link>
      </p>

    </div>
  )
}

export default SignUp