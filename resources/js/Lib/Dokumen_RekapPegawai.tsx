import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { memo } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { calculateAge } from "@/Lib/Utils";
import TimesNewRoman from "@/Assets/Fonts/TimesNewRoman.ttf";
import { JenisKelamin } from "@/types";
import { MenAvatar, WomenAvatar } from "@/Lib/StaticImages";

export type PegawaiExportCV = {
    pegawai: {
        nip: string;
        nama: string;
        jenis_kelamin: JenisKelamin;
        foto: string | null;
        tanggal_masuk: string;
        tempat_lahir: string;
        tanggal_lahir: string;
        no_hp: string;
        alamat: string;
        pendidikan_formal: string;
        keahlian: string | null;
        unit: string | null;
        status_pegawai: string | null;
        marhalah: string | null;
        golongan: string | null;
    };
    rekapBulanan: {
        gaji: number,
        raport_profesi: string;
        kedisiplinan: string;
        ketuntasan_kerja: string;
        skill_manajerial: string | null;
        skill_leadership: string | null;
        prestasi: string | null;
        catatan_negatif: string | null;
        pembinaan: string | null;
    } | null;
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

const Dokumen_RekapPegawai = ({ data }: {
    data: PegawaiExportCV
}) => {
    const tahunMasuk = new Date(data.pegawai.tanggal_masuk).getFullYear();
    const lamaKerja = new Date().getFullYear() - tahunMasuk;

    const { years } = calculateAge(new Date(data.pegawai.tanggal_lahir));
    return (
        <>
            <Document>
                <Page style={styles.page} size="A4">
                    <View style={styles.imageContainer}>
                        <Image
                            style={styles.image}
                            src={data.pegawai.foto ? `/storage/${data.pegawai.foto}` : data.pegawai.jenis_kelamin === 'Laki-Laki' ? MenAvatar : WomenAvatar}
                        />
                        <Text style={{ marginTop: 10 }}>{data.pegawai.nama}</Text>
                    </View>
                    <View style={styles.section}>
                        {renderRow('No.Induk Pegawai', data.pegawai.nip)}
                        {renderRow('Unit', data.pegawai.unit)}
                        {renderRow('Tahun Masuk', format(new Date(data.pegawai.tanggal_masuk), 'dd/MM/yyyy'))}
                        {renderRow('Lama Kerja', `${String(lamaKerja)} Tahun`)}
                        {renderRow('Status Pegawai', data.pegawai.status_pegawai ?? '-')}
                        {renderRow('Status Marhalah', data.pegawai.marhalah ?? '-')}
                        {renderRow('Gaji', String(data.rekapBulanan?.gaji ?? '0'))}
                        {renderRow('Tempat, Tanggal Lahir', `${data.pegawai.tempat_lahir}, ${format(new Date(data.pegawai.tanggal_lahir), 'PPP', { locale: id })}`)}
                        {renderRow('Usia', years.toString())}
                        {renderRow('No HP', data.pegawai.no_hp)}
                        {renderRow('Alamat', data.pegawai.alamat)}
                        {renderRow('Pendidikan Terakhir', '')}
                        {renderRow('Rapor Profesi', data.rekapBulanan?.raport_profesi ?? null)}
                        {renderRow('Kedisiplinan', data.rekapBulanan?.kedisiplinan ?? null)}
                        {renderRow('Ketuntasan Kerja', data.rekapBulanan?.ketuntasan_kerja ?? null)}
                        {renderRow('Skill Manajerial', data.rekapBulanan?.skill_manajerial ?? null)}
                        {renderRow('Skill Leadership', data.rekapBulanan?.skill_leadership ?? null)}
                        {renderRow('Prestasi Terbaru', data.rekapBulanan?.prestasi ?? null)}
                        {renderRow('Catatan Negatif', data.rekapBulanan?.catatan_negatif ?? null)}
                        {renderRow('Keaktifan Pembinaan', data.rekapBulanan?.pembinaan ?? null)}
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

export default memo(Dokumen_RekapPegawai);
