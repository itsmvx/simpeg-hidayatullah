import {
    AlignmentType,
    Document,
    IRunOptions,
    LevelFormat,
    Packer,
    Paragraph,
    TabStopPosition,
    TabStopType,
    TextRun
} from "docx";
import { saveAs } from "file-saver";
import { format } from "date-fns";
import { id } from "date-fns/locale";

type PihakPertama = {
    nama: string;
    amanah?: string;
};
type PihakKedua = {
    nama: string;
    amanah: string;
};
type Periode = {
    awal: string;
    akhir: string;
};
export const generatePerjanjianKontrakKerja = (pihakPertama: PihakPertama, pihakKedua: PihakKedua, tanggal: string, periode: Periode, lokasi = 'Surabaya') => {
    const data = {
        nama_pihak_pertama: pihakPertama.nama,
        amanah_pihak_pertama: pihakPertama.amanah ?? "Kepala SDI Pondok Pesantren Hidayatullah (PPH) Surabaya",
        nama_pihak_kedua: pihakKedua.nama,
        amanah_pihak_kedua: pihakKedua.amanah,
        tanggal: format(new Date(tanggal), 'PPP', { locale: id }),
        lokasi: lokasi,
        periode: {
            awal: periode.awal,
            akhir: periode.akhir
        }
    };
    const numbering = {
        config: [
            {
                reference: "kewajiban-pihak-pertama",
                levels: [
                    {
                        level: 0,
                        format: LevelFormat.DECIMAL,
                        text: "%1.",
                        alignment: AlignmentType.START,
                        style: {
                            paragraph: {
                                indent: { left: 240, hanging: 240 }
                            }
                        }
                    }
                ]
            }, {
                reference: "kewajiban-pihak-kedua",
                levels: [
                    {
                        level: 0,
                        format: LevelFormat.DECIMAL,
                        text: "%1.",
                        alignment: AlignmentType.START,
                        style: {
                            paragraph: {
                                indent: { left: 240, hanging: 240 }
                            }
                        }
                    }
                ]
            }
        ]
    };
    const textDefaultProps: IRunOptions = {
        size: '11pt',
        font: 'calibri'
    };

    const doc = new Document({
        numbering: numbering,
        sections: [
            {
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "PERJANJIAN KONTRAK KERJA",
                                ...textDefaultProps,
                                size: '15pt',
                                bold: true
                            }),
                        ],
                        heading: "Title",
                        alignment: "center",
                        spacing: { line: 240 }
                    }),
                    new Paragraph({
                        spacing: { line: 240 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Bismillahirrahmaanirrahim,",
                                italics: true,
                                ...textDefaultProps
                            }),
                        ],
                        alignment: "start",
                        spacing: { line: 240 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `Dalam rangka mendukung proses penyelenggaraan pendidikan di Pondok Pesantren Hidayatullah Surabaya maka bersama ini kami melakukan kontrak kerja antara pihak Sumber Daya Insani (SDI) dengan aktivis sebagai berikut bahwa`,
                                ...textDefaultProps,
                            }),
                        ],
                        alignment: 'both',
                        spacing: { after: 200 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Yang bertanda tangan di bawah ini:",
                                ...textDefaultProps
                            }),
                        ],
                        spacing: { line: 240 },
                        alignment: 'both',
                        indent: {
                            start: '0.75cm'
                        }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Nama\t: ",
                                ...textDefaultProps
                            }),
                            new TextRun({
                                text: data.nama_pihak_pertama,
                                ...textDefaultProps
                            }),
                        ],
                        alignment: 'both',
                        spacing: { line: 240 },
                        indent: {
                            start: '0.75cm'
                        }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Amanah\t: ",
                                ...textDefaultProps
                            }),
                            new TextRun({
                                text: data.amanah_pihak_pertama,
                                ...textDefaultProps
                            }),
                        ],
                        alignment: 'both',
                        spacing: { line: 240 },
                        indent: {
                            start: '0.75cm'
                        }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Yang bertindak dan mewakili Pondok Pesantren Hidayatullah Surabaya selanjutnya disebut Pihak Pertama.",
                                ...textDefaultProps
                            }),
                        ],
                        alignment: 'both',
                        spacing: { line: 240 },
                        indent: {
                            start: '0.75cm'
                        }
                    }),
                    new Paragraph({
                        spacing: { line: 240 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Selanjutnya yang bertanda tangan di bawah ini:",
                                ...textDefaultProps
                            }),
                        ],
                        spacing: { line: 240 },
                        indent: {
                            start: '0.75cm'
                        }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Nama\t: ",
                                ...textDefaultProps
                            }),
                            new TextRun({
                                text: data.nama_pihak_kedua,
                                ...textDefaultProps
                            }),
                        ],
                        alignment: 'both',
                        indent: {
                            start: '0.75cm'
                        }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Amanah\t: ",
                                ...textDefaultProps
                            }),
                            new TextRun({
                                text: data.amanah_pihak_kedua,
                                ...textDefaultProps
                            }),
                        ],
                        alignment: 'both',
                        spacing: { line: 240 },
                        indent: {
                            start: '0.75cm'
                        }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Yang bertindak dan mewakili diri pribadi selanjutnya disebut Pihak Kedua.",
                                ...textDefaultProps
                            }),
                        ],
                        alignment: 'both',
                        spacing: { line: 240 },
                        indent: {
                            start: '0.75cm'
                        }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `Sepakat untuk melakukan Kontrak Sebagai ${data.amanah_pihak_kedua} PPH Surabaya selama tahun pelajaran ${format(new Date(data.periode.awal), 'y')}-${format(new Date(data.periode.akhir), 'y')} (terhitung mulai ${format(new Date(data.periode.awal), 'PPP', { locale: id })} s.d ${format(new Date(data.periode.akhir), 'PPP', { locale: id })}) dengan ketentuan sebagai berikut: `,
                                ...textDefaultProps
                            }),
                        ],
                        alignment: 'both',
                        spacing: { line: 240, before: 120 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Pihak pertama berkewajiban:",
                                ...textDefaultProps
                            }),
                        ],
                        alignment: 'both',
                        spacing: { line: 240, before: 120 },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Menunaikan hak pihak kedua berupa kompensasi / gaji pada setiap akhir bulan sesuai dengan aturan yang berlaku atau yang telah disepakati di Pesantren Hidayatullah Surabaya,",
                                ...textDefaultProps
                            }),
                        ],
                        numbering: {
                            reference: "kewajiban-pihak-pertama",
                            level: 0
                        },
                        alignment: 'both',
                        spacing: { line: 240 },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Menyelenggarakan dan melakukan pembinaan dalam rangka peningkatan wawasan semua aktivis,",
                                ...textDefaultProps
                            }),
                        ],
                        numbering: {
                            reference: "kewajiban-pihak-pertama",
                            level: 0
                        },
                        alignment: 'both',
                        spacing: { line: 240 },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Mengontrol dan mengevaluasi pelaksanaan tugas seluruh aktivis secara berkisinambungan.",
                                ...textDefaultProps
                            }),
                        ],
                        numbering: {
                            reference: "kewajiban-pihak-pertama",
                            level: 0
                        },
                        alignment: 'both',
                        spacing: { line: 240 },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Pihak kedua berkewajiban:",
                                ...textDefaultProps
                            }),
                        ],
                        alignment: 'both',
                        spacing: { line: 240, before: 120 },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Melaksanakan tugas sesuai dengan yang diamanahkan oleh PPH dan pengelola unit tempat tugas dengan baik dan sepenuh hati,",
                                ...textDefaultProps
                            }),
                        ],
                        numbering: {
                            reference: "kewajiban-pihak-kedua",
                            level: 0
                        },
                        alignment: 'both',
                        spacing: { line: 240 },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Bertanggung jawab atas kesuksesan dari tugas yang diamanahkan,",
                                ...textDefaultProps
                            }),
                        ],
                        numbering: {
                            reference: "kewajiban-pihak-kedua",
                            level: 0
                        },
                        alignment: 'both',
                        spacing: { line: 240 },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Mengikuti setiap pebinaan yang dilakukan oleh PPH dan unit pengelola tempat bertugas,",
                                ...textDefaultProps
                            }),
                        ],
                        numbering: {
                            reference: "kewajiban-pihak-kedua",
                            level: 0
                        },
                        alignment: 'both',
                        spacing: { line: 240 },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Patuh dan taat terhadap aturan dan ketetapan yang diterapkan di PPH dan unit pengelola tempat tugas,",
                                ...textDefaultProps
                            }),
                        ],
                        numbering: {
                            reference: "kewajiban-pihak-kedua",
                            level: 0
                        },
                        spacing: { line: 240 },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Menjaga nama baik PPH dan unit tempat bertugas dan ikut untuk mensosialisasikannya di masyarakat.",
                                ...textDefaultProps
                            }),
                        ],
                        numbering: {
                            reference: "kewajiban-pihak-kedua",
                            level: 0
                        },
                        alignment: 'both',
                        spacing: { line: 240 },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Demikian surat perjanjian ini dibuat apabila terdapat hal-hal yang tidak sesuai dengan isi perjanjian ini maka akan dilakukan peninjauan kembali. Mudah-mudahan Allah swt meridloi niat dan amal kita, aamiin.",
                                ...textDefaultProps
                            }),
                        ],
                        spacing: { line: 240, before: 120 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `${data.lokasi}, ${data.tanggal}`,
                                ...textDefaultProps
                            }),
                        ],
                        alignment: "right",
                        spacing: { line: 240, after: 240, before: 120 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Pihak Pertama\tPihak Kedua",
                                ...textDefaultProps
                            }),
                        ],
                        alignment: "center",
                        spacing: { line: 240, after: 240, before: 240 },
                        tabStops: [
                            {
                                type: TabStopType.RIGHT,
                                position: TabStopPosition.MAX,
                            },
                        ],
                    }),
                    new Paragraph({
                        spacing: { line: 240, after: 340, before: 340 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `${data.nama_pihak_pertama}\t${data.nama_pihak_kedua}`,
                                ...textDefaultProps
                            }),
                        ],
                        alignment: "center",
                        spacing: { line: 240, before: 240 },
                        tabStops: [
                            {
                                type: TabStopType.RIGHT,
                                position: TabStopPosition.MAX,
                            },
                        ]
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Mengetahui",
                                ...textDefaultProps
                            }),
                        ],
                        alignment: "center",
                        spacing: { line: 240 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Ketua Badan Pengurus PP Hidayatullah Surabaya",
                                ...textDefaultProps
                            }),
                        ],
                        alignment: "center",
                        spacing: { line: 240, after: 240 }
                    }),
                    new Paragraph({
                        spacing: { line: 240, after: 340, before: 340 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "H. Samsudin S.E MM.",
                                ...textDefaultProps
                            }),
                        ],
                        alignment: "center",
                        spacing: { line: 240 }
                    }),
                ],
            },
        ],
    });

    Packer.toBlob(doc).then((blob) => {
        saveAs(blob, "Perjanjian_Kontrak_Kerja.docx");
    });
};
