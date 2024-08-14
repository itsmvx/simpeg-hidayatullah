import { AdminUnitLayout } from '@/Layouts/AdminUnitLayout'
import { Head } from '@inertiajs/react'
import React from 'react'

const Index = () => {
  return (
    <>
      <Head title="Master - Pegawai" />
      <AdminUnitLayout>
        <section className="mb-1 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
          <h1>Rekap</h1>
        </section>
      </AdminUnitLayout>
    </>
  )
}

export default Index