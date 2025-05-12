import { createFileRoute, Link } from '@tanstack/react-router';
import { Button, Label, TextInput } from 'flowbite-react';
import googleLogo from '../assets/G-google.png'; // Ganti dengan path logo Google yang kamu pakai
import mantraLogo from "../assets/mantraLogo.png"
import bgBarber from "../assets/BG.jpg"

export const Route = createFileRoute('/login')({
  component: Login,
});

function Login() {
  return (
<div
  className="flex justify-center items-center min-h-screen bg-cover bg-center px-4"
style={{
  backgroundImage: `url(${bgBarber})`,
}}

>
  {/* Form Container */}
  <div className="w-full max-w-md bg-gray-200 rounded-lg shadow-md p-6 border border-gray-200">
    
    {/* Logo & Brand Name */}
    <div className="flex flex-row justify-center items-center mb-5">
      <img src={mantraLogo} alt="MantraBarber Logo" className="w-27 h-20" />
      <p className='font-bold text-xl ms-2'>MANTRA BARBER</p>
    </div>

    <div className="mb-4 text-center">
      <h1 className="text-2xl font-bold text-black">
        Sign in to your Account
      </h1>
    </div>

    <form className="flex flex-col gap-4">
      <div>
        <Label htmlFor="email" color='gray'>
          Your Email
        </Label>
        <TextInput
          id="email"
          type="email"
          placeholder="example@gmail.com"
          required
        />
      </div>

      <div>
        <Label htmlFor="password" color='gray'>
          Password
        </Label>
        <TextInput
          id="password"
          type="password"
          placeholder="*************"
          required
        />
      </div>

      <Button type="submit" id="submit">
        Log in to your account
      </Button>

      <Button
        type="button"
        color="light"
        className="flex items-center justify-center gap-2 border border-gray-300"
      >
        <img src={googleLogo} alt="Google" className="w-5 h-5" />
        Sign in with Google
      </Button>

      <p className="text-sm text-center text-black mt-2">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-600 hover:underline">
          Sign up here
        </Link>
      </p>
    </form>
  </div>
</div>
  );
}
