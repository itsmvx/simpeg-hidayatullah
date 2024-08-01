import { AdminLayout } from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";

export default function AdminDetailsPage({ admin }: {
    admin: {
        id: string;
        nama: string;
        username: string;
        created_at: string;
        unit: {
            id: string;
            nama: string;
            is_master: number
        }
    }
}) {
    return (
        <>
            <Head title="Master - Admin Details" />
            <AdminLayout>
                <div>
                    DETAILS Admin:
                    { Object.keys(admin).map(key => ((
                        <p key={key}>
                            { key !== 'unit' && admin[key] }
                        </p>
                    )))}
                </div>
            </AdminLayout>
        </>
    )
}
