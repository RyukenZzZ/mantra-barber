import { createFileRoute } from '@tanstack/react-router'
import { Button } from 'flowbite-react'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
   return (
   <>
    <h1 className="text-3xl font-bold underline">
      Hello world!
    </h1>
    
    <Button>CONTOL me</Button>;

    </>
   )
}