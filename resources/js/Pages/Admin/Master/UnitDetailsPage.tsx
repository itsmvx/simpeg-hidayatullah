import { AdminLayout } from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";

export default function AdminDetailsPage({ unit }: {
    unit: {
        id: string;
        nama: string;
        keterangan: string;
        created_at: string;
    }
}) {

    return (
        <>
            <Head title="Master - Admin Details" />
            <AdminLayout>
                <div>
                    DETAILS Admin:
                    { Object.keys(unit).map(key => ((
                        <p key={key}>
                            { key !== 'unit' && unit[key] }
                        </p>
                    )))}
                </div>
            </AdminLayout>
        </>
    )
}
