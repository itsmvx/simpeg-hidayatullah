import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { memo } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { calculateAge } from "@/Lib/Utils";
import TimesNewRoman from "@/Assets/Fonts/TimesNewRoman.ttf";
import Meong from "@/Assets/Images/meong.jpg";

export type PegawaiExportCV = {
    pegawai: {
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
    rekapBulanan: {
        gaji: number,
        raport_profesi: string;
        kedisiplinan: string;
        ketuntasan_kerja: string;
        skill_manajerial: string | null,
        skill_leadership: string | null,
        prestasi: string | null,
        catatan_negatif: string | null
    };
    rekapTahunan: {
        amanah: string;
        periode: string;
        unit: string;
    }[]
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
        objectFit: 'cover'
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

const CV_PDFGenerator = ({ data }: {
    data: PegawaiExportCV
}) => {
    console.log(data);
    const tahunMasuk = new Date(data.pegawai.tanggalMasuk).getFullYear();
    const lamaKerja = new Date().getFullYear() - tahunMasuk;

    const { years } = calculateAge(new Date(data.pegawai.tanggalLahir));
    return (
        <>
            <Document>
                <Page style={styles.page} size="A4">
                    <View style={styles.imageContainer}>
                        <Image
                            style={styles.image}
                            src={data.pegawai.foto ? `/storage/${data.pegawai.foto}` : Meong}
                        />
                        <Text style={{ marginTop: 10 }}>{data.pegawai.nama}</Text>
                    </View>
                    <View style={styles.section}>
                        {renderRow('No.Induk Pegawai', data.pegawai.nip)}
                        {renderRow('Unit', data.pegawai.unit)}
                        {renderRow('Tahun Masuk', format(new Date(data.pegawai.tanggalMasuk), 'dd/MM/yyyy'))}
                        {renderRow('Lama Kerja', `${String(lamaKerja)} Tahun`)}
                        {renderRow('Status Pegawai', data.pegawai.statusPegawai ?? '-')}
                        {renderRow('Status Marhalah', data.pegawai.marhalah ?? '-')}
                        {renderRow('Gaji', String(data.rekapBulanan.gaji ?? '0'))}
                        {renderRow('Tempat, Tanggal Lahir', `${data.pegawai.tempatLahir}, ${format(new Date(data.pegawai.tanggalLahir), 'PPP', { locale: id })}`)}
                        {renderRow('Usia', years.toString())}
                        {renderRow('No HP', data.pegawai.noHp)}
                        {renderRow('Alamat', data.pegawai.alamat)}
                        {renderRow('Pendidikan Terakhir', '')}
                        {renderRow('Keahlian', data.pegawai.keahlian)}
                        {renderRow('Rapor Profesi', data.rekapBulanan.raport_profesi)}
                        {renderRow('Kedisiplinan', data.rekapBulanan.kedisiplinan)}
                        {renderRow('Ketuntasan Kerja', data.rekapBulanan.ketuntasan_kerja)}
                        {renderRow('Skill Manajerial', data.rekapBulanan.skill_manajerial)}
                        {renderRow('Skill Leadership', data.rekapBulanan.skill_leadership)}
                        {renderRow('Prestasi Terbaru', data.rekapBulanan.prestasi)}
                        {renderRow('Catatan Negatif', data.rekapBulanan.catatan_negatif)}
                        {renderRow('Keaktifan Pembinaan', '-')}
                        {data.rekapTahunan.map((rekap) => renderRow(`Amanah ${rekap.periode}`, `${rekap.unit}, ${rekap.amanah}`))}
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
        <Text style={styles.value}>:  {value ?? '-'}</Text>
    </View>
);

export default memo(CV_PDFGenerator);
