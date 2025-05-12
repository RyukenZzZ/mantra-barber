import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/create-booking')({
  component: CreateBooking,
})

function CreateBooking() {
  return <div>Hello "/create-booking"!</div>
}
