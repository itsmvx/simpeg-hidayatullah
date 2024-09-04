import { Button } from "@material-tailwind/react";
import { generatePerjanjianKontrakKerja } from "@/Lib/SuratPerjanjianKontrakKerja";

export default function Test() {
    return (
        <>
            <Button onClick={generatePerjanjianKontrakKerja}>
                Tes Docx
            </Button>
        </>
    )
}
