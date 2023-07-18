import { useState } from "react";

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log({ username, password });

  }

  return (
    <div className='h-full flex justify-center items-center'>
      <div className='border rounded p-2 h-fit'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-2 items-center text-white'>
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

export default Signup