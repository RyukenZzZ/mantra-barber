import { createFileRoute, Link } from '@tanstack/react-router';
import { Button, Label, TextInput } from 'flowbite-react';
import googleLogo from '../assets/G-google.png'; // Ganti dengan path logo Google yang kamu pakai

export const Route = createFileRoute('/login')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center px-4"
      style={{
        backgroundImage:
          'url("https://media.istockphoto.com/id/1244833615/id/foto/ilustrasi-3d-interior-tempat-kerja-barbershop.jpg?s=2048x2048&w=is&k=20&c=SBl6XLkMdH2RqlVA6JR0NDPUmbJfCmIJ3efY166zq_I=")',
      }}
    >
      {/* Form Container */}
      <div className="w-full max-w-md bg-gray-800 bg-opacity-90 rounded-lg shadow-md p-6">
        
        {/* Logo & Brand Name (di dalam form) */}
        <div className="flex flex-row justify-center items-center mb-5">
          <img src="https://flowbite.com/docs/images/logo.svg" alt="MantraBarber Logo" className="w-9 h-9" />
          <span className="text-white text-xl font-semibold ms-3">Mantra Barber</span>
        </div>

        <div className="mb-4 text-center">
          <h1 className="text-2xl font-bold text-white">
            Sign in to your Account
          </h1>
        </div>

        <form className="flex flex-col gap-4">
          <div>
            <Label htmlFor="email" className="text-white">
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
            <Label htmlFor="password" className="text-white">
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

          <p className="text-sm text-center text-white mt-2">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:underline">
              Sign up here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
