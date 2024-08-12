import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { memo } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { calculateAge } from "@/Lib/Utils";
import TimesNewRoman from "@/Assets/Fonts/TimesNewRoman.ttf";
import Meong from "@/Assets/Images/meong.jpg";

export type PegawaiExportCV = {
    nip: string;
    nama: string;
    foto: string | null;
    tanggalMasuk: string;
    tempatLahir: string;
    tanggalLahir: string;
    noHp: string;
    alamat: string;
    pendidikan_formal: string;
    keahlian: string | null;
    unit: string | null;
    statusPegawai: string | null;
    marhalah: string | null;
    golongan: string | null;
};

Font.register({ family: 'Times New Roman', src: TimesNewRoman });

const styles = StyleSheet.create({
    page: {
        padding: 80,
        fontFamily: 'Times New Roman',
        fontWeight: 'normal'
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 35,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 60,
        objectPosition: 'center',
    },
    section: {
        marginBottom: 10,
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 7,
    },
    label: {
        width: '35%',
        fontSize: 12,
        textAlign: 'left',
    },
    value: {
        width: '65%',
        fontSize: 12,
        textAlign: 'left',
    },
});

const CV_PDFGenerator = ({ pegawai }: {
    pegawai: PegawaiExportCV
}) => {
    const tahunMasuk = new Date(pegawai.tanggalMasuk).getFullYear();
    const lamaKerja = new Date().getFullYear() - tahunMasuk;

    const { years } = calculateAge(new Date(pegawai.tanggalLahir));
    return (
        <>
            <Document>
                <Page style={styles.page} size="A4">
                    <View style={styles.imageContainer}>
                        <Image
                            style={styles.image}
                            src={Meong}
                        />
                        <Text style={{ marginTop: 10 }}>{pegawai.nama}</Text>
                        <Text style={{ marginTop: 5, fontSize: 9 }}>Periode April 2024</Text>
                    </View>
                    <View style={styles.section}>
                        {renderRow('No.Induk Pegawai', pegawai.nip)}
                        {renderRow('Unit', pegawai.unit ?? '-')}
                        {renderRow('Tahun Masuk', format(new Date(pegawai.tanggalMasuk), 'dd/MM/yyyy'))}
                        {renderRow('Lama Kerja', `${String(lamaKerja)} Tahun`)}
                        {renderRow('Status Pegawai', pegawai.statusPegawai ?? '-')}
                        {renderRow('Status Marhalah', pegawai.marhalah ?? '-')}
                        {renderRow('Gaji', '')}
                        {renderRow('Tempat, Tanggal Lahir', `${pegawai.tempatLahir}, ${format(new Date(pegawai.tanggalLahir), 'PPP', { locale: id })}`)}
                        {renderRow('Usia', years.toString())}
                        {renderRow('No HP', pegawai.noHp)}
                        {renderRow('Alamat', pegawai.alamat)}
                        {renderRow('Pendidikan Terakhir', '')}
                        {renderRow('Keahlian', pegawai.keahlian ?? '-')}
                        {renderRow('Rapor Profesi', '')}
                        {renderRow('Kedisiplinan', '')}
                        {renderRow('Ketuntasan Kerja', '')}
                        {renderRow('Skill Manajerial', '')}
                        {renderRow('Skill Leadership', '')}
                        {renderRow('Prestasi Tahun ini', '')}
                        {renderRow('Catatan Negatif', '')}
                        {renderRow('Keaktifan Pembinaan', '')}
                        <View style={{
                            marginTop: 55,
                            marginLeft: 'auto',
                            fontSize: 12
                        }}>
                            <Text>Surabaya, { format(new Date(), 'PPP', { locale: id }) }</Text>
                            <Text style={{
                                marginTop: 60,
                                textDecoration: 'underline',
                            }}>
                                Faishal Abdullah, M.Pd.I
                            </Text>
                            <Text>
                                Ka. SDI Personalia
                            </Text>
                        </View>
                    </View>
                </Page>
            </Document>
        </>
    )
}

const renderRow = (label: string, value: string | null) => (
    <View style={styles.row} key={label}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>:  {value}</Text>
    </View>
);

export default memo(CV_PDFGenerator);
