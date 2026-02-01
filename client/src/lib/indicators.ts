export interface Indicator {
  code: string;
  name: string;
  description?: string;
}

export interface SubDimension {
  id: string;
  name: string;
  indicators: Indicator[];
}

export interface Dimension {
  id: number;
  name: string;
  weight: number; // Percentage
  color: string;
  subDimensions: SubDimension[];
}

export const DIMENSIONS: Dimension[] = [
  {
    id: 1,
    name: "Layanan Dasar",
    weight: 26.77,
    color: "#2563EB",
    subDimensions: [
      {
        id: "1-A",
        name: "Pendidikan",
        indicators: [
          { code: "1.1", name: "Akses Terhadap PAUD/TK/Sederajat", description: "Ketersediaan, Kemudahan Akses, dan APM" },
          { code: "1.2", name: "Akses Terhadap SD/MI/Sederajat", description: "Kemudahan Akses dan APM" },
          { code: "1.3", name: "Akses Terhadap SMP/MTs/Sederajat", description: "Kemudahan Akses dan APM" },
          { code: "1.4", name: "Akses Terhadap SMA/SMK/MA/Sederajat", description: "Kemudahan Akses dan APM" },
        ]
      },
      {
        id: "1-B",
        name: "Kesehatan",
        indicators: [
          { code: "1.5", name: "Akses Terhadap Rumah Sakit", description: "Jarak dan waktu tempuh" },
          { code: "1.6", name: "Akses Terhadap Puskesmas", description: "Jarak dan waktu tempuh" },
          { code: "1.7", name: "Akses Terhadap Tenaga Kesehatan", description: "Keberadaan bidan/dokter" },
          { code: "1.8", name: "Kesehatan Masyarakat", description: "Keberadaan Posyandu" },
        ]
      },
      {
        id: "1-C",
        name: "Utilitas Dasar",
        indicators: [
          { code: "1.9", name: "Akses Air Minum", description: "Sumber air layak" },
          { code: "1.10", name: "Akses Jamban", description: "Kepemilikan jamban sehat" },
          { code: "1.11", name: "Akses Listrik", description: "Penerangan rumah tangga" },
          { code: "1.12", name: "Akses Informasi", description: "Sinyal telepon/internet" },
          { code: "1.13", name: "Manajemen Sampah", description: "Pengelolaan sampah desa" },
        ]
      }
    ]
  },
  {
    id: 2,
    name: "Sosial",
    weight: 13.39,
    color: "#16A34A",
    subDimensions: [
      {
        id: "2-A",
        name: "Aktivitas Masyarakat",
        indicators: [
          { code: "2.1", name: "Gotong Royong", description: "Kegiatan kerja bakti" },
          { code: "2.2", name: "Ruang Publik", description: "Ketersediaan taman/lapangan" },
          { code: "2.3", name: "Kelompok Olahraga", description: "Kegiatan olahraga rutin" },
          { code: "2.4", name: "Kegiatan Seni Budaya", description: "Kelompok kesenian" },
        ]
      },
      {
        id: "2-B",
        name: "Fasilitas Masyarakat",
        indicators: [
          { code: "2.5", name: "Fasilitas Olahraga", description: "Ketersediaan sarana" },
          { code: "2.6", name: "Fasilitas Kesenian", description: "Ketersediaan sanggar/balai" },
          { code: "2.7", name: "Keamanan Desa", description: "Siskamling/Pos kamling" },
          { code: "2.8", name: "Konflik Sosial", description: "Kejadian konflik antar warga" },
        ]
      }
    ]
  },
  {
    id: 3,
    name: "Ekonomi",
    weight: 25.20,
    color: "#D97706",
    subDimensions: [
      {
        id: "3-A",
        name: "Produksi Desa",
        indicators: [
          { code: "3.1", name: "Produk Unggulan", description: "Keberadaan komoditas utama" },
          { code: "3.2", name: "Industri Mikro", description: "Jumlah industri rumah tangga" },
          { code: "3.3", name: "BUMDes", description: "Status keaktifan BUMDes" },
        ]
      },
      {
        id: "3-B",
        name: "Fasilitas Pendukung Ekonomi",
        indicators: [
          { code: "3.4", name: "Pasar", description: "Ketersediaan pasar desa" },
          { code: "3.5", name: "Toko/Warung", description: "Jumlah sarana perdagangan" },
          { code: "3.6", name: "Lembaga Keuangan", description: "Akses Bank/Koperasi" },
          { code: "3.7", name: "Akses Kredit", description: "Kemudahan pinjaman modal" },
          { code: "3.8", name: "Layanan Transportasi", description: "Trayek angkutan umum" },
          { code: "3.9", name: "Konektivitas Ekonomi", description: "Hubungan perdagangan antar wilayah" },
          { code: "3.10", name: "Potensi Wisata", description: "Pengelolaan daya tarik wisata" },
          { code: "3.11", name: "Hotel/Penginapan", description: "Sarana akomodasi" },
          { code: "3.12", name: "Restoran/Rumah Makan", description: "Sarana kuliner" },
        ]
      }
    ]
  },
  {
    id: 4,
    name: "Lingkungan",
    weight: 14.17,
    color: "#0891B2",
    subDimensions: [
      {
        id: "4-A",
        name: "Pengelolaan Lingkungan",
        indicators: [
          { code: "4.1", name: "Pencemaran Air", description: "Tingkat polusi perairan" },
          { code: "4.2", name: "Pencemaran Tanah", description: "Tingkat polusi lahan" },
          { code: "4.3", name: "Pencemaran Udara", description: "Kualitas udara desa" },
        ]
      },
      {
        id: "4-B",
        name: "Penanggulangan Bencana",
        indicators: [
          { code: "4.4", name: "Mitigasi Bencana", description: "Upaya pencegahan" },
          { code: "4.5", name: "Kejadian Bencana", description: "Frekuensi bencana alam" },
        ]
      }
    ]
  },
  {
    id: 5,
    name: "Aksesibilitas",
    weight: 7.87,
    color: "#7C3AED",
    subDimensions: [
      {
        id: "5-A",
        name: "Kondisi Akses Jalan",
        indicators: [
          { code: "5.1", name: "Kualitas Jalan", description: "Jenis permukaan jalan utama" },
          { code: "5.2", name: "Lebar Jalan", description: "Kemampuan dilalui kendaraan" },
          { code: "5.3", name: "Kondisi Jembatan", description: "Kelayakan jembatan desa" },
        ]
      },
      {
        id: "5-B",
        name: "Kemudahan Akses",
        indicators: [
          { code: "5.4", name: "Akses ke Pusat Kota", description: "Jarak dan waktu tempuh" },
          { code: "5.5", name: "Transportasi Desa", description: "Moda angkutan yang tersedia" },
        ]
      }
    ]
  },
  {
    id: 6,
    name: "Tata Kelola",
    weight: 12.60,
    color: "#DB2777",
    subDimensions: [
      {
        id: "6-A",
        name: "Kelembagaan dan Pelayanan Desa",
        indicators: [
          { code: "6.1", name: "Kantor Desa", description: "Kelayakan gedung kantor" },
          { code: "6.2", name: "Layanan Administrasi", description: "Kecepatan pelayanan surat" },
          { code: "6.3", name: "Kualitas Perangkat", description: "Tingkat pendidikan perangkat desa" },
        ]
      },
      {
        id: "6-B",
        name: "Tata Kelola Keuangan Desa",
        indicators: [
          { code: "6.4", name: "Transparansi Dana", description: "Publikasi APBDes" },
          { code: "6.5", name: "Ketepatan Waktu", description: "Penyusunan laporan keuangan" },
        ]
      }
    ]
  }
];

export const getStatusColor = (status: string | null) => {
  switch (status?.toLowerCase()) {
    case 'mandiri': return 'bg-green-100 text-green-800 border-green-200';
    case 'maju': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'berkembang': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'tertinggal': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'sangat tertinggal': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};
