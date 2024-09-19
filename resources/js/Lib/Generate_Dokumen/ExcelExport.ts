import * as XLSX from 'xlsx';

export const exportToExcel = (props: {
    data: any[];
    headers?: string[];
    fileName?: string;
}) => {
    const { data, headers, fileName = `export.xlsx` } = props;

    if (data.length === 0) {
        console.error("Data tidak boleh kosong");
        return;
    }

    const worksheetHeaders = headers ?? Object.keys(data[0]);

    const worksheetData = [
        worksheetHeaders,
        ...data.map((item) => worksheetHeaders.map((header) => item[header] ?? '-')),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

    XLSX.writeFile(workbook, fileName);
};

