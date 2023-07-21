import { useState } from "react";
import Form from "../components/Form";
import TextField from '../components/TextField';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log({ email, password });
  }

  return (
    <div className='h-full flex justify-center items-center'>
      <div className='border rounded p-2 h-fit'>
        <Form onSubmit={handleSubmit} header="Signup">
          <TextField id='email' label='Email' name='email' placeholder='example@aol.com' value={email} onChange={e => setEmail(e.target.value)} />
          <TextField id='password' label='Password' name='password' type='password' value={password} onChange={e => setPassword(e.target.value)} />
          <button
            type='submit'
            className="py-3 rounded bg-amber-600 hover:bg-amber-700 text-white font-medium w-full"
          >Signup</button>
        </Form>
      </div>
    </div>
  )
}

export default Signup