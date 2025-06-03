import { createFileRoute } from '@tanstack/react-router'
import SideBar from '../../components/SideBar/sidebar';

export const Route = createFileRoute('/admin/dashboard')({
  component: AdminDasboardComponent,
})

function AdminDasboardComponent() {
return (
    <SideBar>
      <h1 className="text-2xl font-bold">Welcome to Barberku Admin</h1>
      {/* Tambahkan statistik, grafik, dsb di sini */}
    </SideBar>
  );}
