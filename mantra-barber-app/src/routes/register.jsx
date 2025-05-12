import { createFileRoute, Link } from "@tanstack/react-router";
import { Button, Label, TextInput } from "flowbite-react";
import googleLogo from "../assets/G-google.png";

export const Route = createFileRoute("/register")({
  component: Register,
});

function Register() {
  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          'url("https://media.istockphoto.com/id/1244833615/id/foto/ilustrasi-3d-interior-tempat-kerja-barbershop.jpg?s=2048x2048&w=is&k=20&c=SBl6XLkMdH2RqlVA6JR0NDPUmbJfCmIJ3efY166zq_I=")',
      }}
    >
      <div className="w-full max-w-md bg-gray-800 bg-opacity-90 rounded-lg shadow-md p-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-white">
            Create your Free Account
          </h1>
        </div>
        <form className="flex flex-col gap-4">
          <div>
            <Label htmlFor="name" className="text-white">
              Your Name
            </Label>
            <TextInput
              id="name"
              type="text"
              placeholder="Put your name here"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-white">
              Your Phone Number
            </Label>
            <TextInput
              id="phone"
              type="tel"
              placeholder="08XXXXXXXXXX"
              required
            />
          </div>

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

          <div>
            <Label htmlFor="confirm-password" className="text-white">
              Confirm Password
            </Label>
            <TextInput
              id="confirm-password"
              type="password"
              placeholder="*************"
              required
            />
          </div>

          <Button type="submit" id="submit">
            Create an account
          </Button>
          <Button
            type="button"
            color="light"
            className="flex items-center justify-center gap-2 border border-gray-300 "
          >
            <img src={googleLogo} alt="Google" className="w-5 h-5" />
            Sign up with Google
          </Button>

          <p className="text-sm text-center text-white mt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-400 hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
