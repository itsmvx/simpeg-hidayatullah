import { Button } from "@material-tailwind/react";
import { generatePerjanjianKontrakKerja } from "@/Lib/Generate_Dokumen/SuratPerjanjianKontrakKerja";

export default function Test() {
    return (
        <>
            <Button onClick={generatePerjanjianKontrakKerja}>
                Tes Docx
            </Button>
        </>
    )
}
