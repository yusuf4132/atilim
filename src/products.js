const ayarFiyatlari = {
    14: 4000,  // 14 ayar gram başına fiyat
    22: 5600.2,  // 22 ayar gram başına fiyat
    24: 5800.2   // 24 ayar gram başına fiyat
};
const ürünFiyatHesapla = (ürün) => {
    // Ürünün ayar bilgisini alıyoruz
    const ayar = parseInt(ürün.özellikler.ayar); // 14, 22, 24 şeklinde olacak
    const gram = parseFloat(ürün.özellikler.gram); // 4.50 gibi
    const gramFiyat = ayarFiyatlari[ayar];
    return gramFiyat ? (gram * gramFiyat) : 0;
};

const rawProducts = [
    {
        id: '1',
        title: 'Altın Kolye',
        image: [
            '/u11.png',
            '/u12.png'
        ],
        özellikler: {
            ürün: 'Altın',
            renk: 'Sarı',
            gram: '4.50',
            ayar: '14'
        },
        mainCategory: 'yuzuk',
        subCategory: 'Çocuk',
        productCode: '001',
        popIndex: '',
        catIndex: '16',
        detail: 'Yüzüklerimizde Yüzük Ölçüsüne Göre +,- Gram Farkı Oluşabileceğinden Fiyatlar Cüzi Miktarda Değişiklik Gösterebilir.',
        discount: ''
    },
    {
        id: '2',
        title: 'Pırlanta Yüzük',
        image: [' /u21.png',
            '/u22.png'],
        özellikler: {
            ürün: 'Pırlanta',
            renk: 'Gri',
            gram: '2.10',
            ayar: '22'
        },
        mainCategory: 'yuzuk',
        subCategory: 'Çocuk',
        productCode: '002',
        popIndex: '8',
        catIndex: '15',
        detail: 'Yüzüklerimizde Yüzük Ölçüsüne Göre +,- Gram Farkı Oluşabileceğinden Fiyatlar Cüzi Miktarda Değişiklik Gösterebilir.',
        discount: '0.15'
    },
    {
        id: '3',
        title: 'Gümüş Bilezik',
        image: ['/u3.png'],
        özellikler: {
            ürün: 'Gümüş',
            renk: 'Gri',
            gram: '6.10',
            ayar: '24'
        },
        mainCategory: 'bilezik',
        subCategory: 'cocuk',
        productCode: '003',
        popIndex: '',
        catIndex: '14',
        detail: 'Bileziklerimizde Bilezik Ölçüsüne Göre +,- Gram Farkı Oluşabileceğinden Fiyatlar Cüzi Miktarda Değişiklik Gösterebilir.',
        discount: ''
    },
    {
        id: '4',
        title: 'Örnek Ürün 4',
        image: ['/u4.png'],
        özellikler: {
            ürün: 'Altın',
            renk: 'Sarı',
            gram: '6.90',
            ayar: '22'
        },
        mainCategory: 'bilezik',
        subCategory: 'özel',
        productCode: '004',
        popIndex: '7',
        catIndex: '13',
        detail: 'Bileziklerimizde Bilezik Ölçüsüne Göre +,- Gram Farkı Oluşabileceğinden Fiyatlar Cüzi Miktarda Değişiklik Gösterebilir.',
        discount: ''
    },
    {
        id: '5',
        title: 'Örnek Ürün 5',
        image: ['/u5.png'],
        özellikler: {
            ürün: 'Gümüş',
            renk: 'Gri',
            gram: '3.10',
            ayar: '24'
        },
        mainCategory: 'yuzuk',
        subCategory: 'Çocuk',
        productCode: '005',
        popIndex: '',
        catIndex: '12',
        detail: 'Bileziklerimizde Bilezik Ölçüsüne Göre +,- Gram Farkı Oluşabileceğinden Fiyatlar Cüzi Miktarda Değişiklik Gösterebilir.',
        discount: ''
    },
    {
        id: '6',
        title: 'Örnek Ürün 6',
        image: ['/u6.png'],
        özellikler: {
            ürün: 'Gümüş',
            renk: 'Gri',
            gram: '3.10',
            ayar: '24'
        },
        mainCategory: 'yuzuk',
        subCategory: 'Çocuk',
        productCode: '006',
        popIndex: '6',
        catIndex: '11',
        detail: 'Bileziklerimizde Bilezik Ölçüsüne Göre +,- Gram Farkı Oluşabileceğinden Fiyatlar Cüzi Miktarda Değişiklik Gösterebilir.',
        discount: ''
    },
    {
        id: '7',
        title: 'Örnek Ürün 7',
        image: ['/u7.png'],
        özellikler: {
            ürün: 'Gümüş',
            renk: 'Gri',
            gram: '3.10',
            ayar: '22'
        },
        mainCategory: 'yuzuk',
        subCategory: 'Çocuk',
        productCode: '007',
        popIndex: '',
        catIndex: '10',
        detail: 'Bileziklerimizde Bilezik Ölçüsüne Göre +,- Gram Farkı Oluşabileceğinden Fiyatlar Cüzi Miktarda Değişiklik Gösterebilir.',
        discount: ''
    },
    {
        id: '8',
        title: 'Örnek Ürün 8',
        image: ['/u8.png'],
        özellikler: {
            ürün: 'Gümüş',
            renk: 'Gri',
            gram: '3.10',
            ayar: '22'
        },
        mainCategory: 'yuzuk',
        subCategory: 'Çocuk',
        productCode: '008',
        popIndex: '5',
        catIndex: '9',
        detail: 'Bileziklerimizde Bilezik Ölçüsüne Göre +,- Gram Farkı Oluşabileceğinden Fiyatlar Cüzi Miktarda Değişiklik Gösterebilir.',
        discount: ''
    },
    {
        id: '9',
        title: 'Örnek ürün 9',
        image: [
            '/u11.png',
            '/u12.png'
        ],
        özellikler: {
            ürün: 'Altın',
            renk: 'Sarı',
            gram: '4.50',
            ayar: '14'
        },
        mainCategory: 'yuzuk',
        subCategory: 'Çocuk',
        productCode: '001',
        popIndex: '',
        catIndex: '8',
        detail: 'Yüzüklerimizde Yüzük Ölçüsüne Göre +,- Gram Farkı Oluşabileceğinden Fiyatlar Cüzi Miktarda Değişiklik Gösterebilir.',
        discount: ''
    },
    {
        id: '10',
        title: 'Örnek ürün 10',
        image: [' /u21.png',
            '/u22.png'],
        özellikler: {
            ürün: 'Pırlanta',
            renk: 'Gri',
            gram: '2.10',
            ayar: '14'
        },
        mainCategory: 'yuzuk',
        subCategory: 'Çocuk',
        productCode: '002',
        popIndex: '4',
        catIndex: '7',
        detail: 'Yüzüklerimizde Yüzük Ölçüsüne Göre +,- Gram Farkı Oluşabileceğinden Fiyatlar Cüzi Miktarda Değişiklik Gösterebilir.',
        discount: ''
    },
    {
        id: '11',
        title: 'Örnek ürün 11',
        image: ['/u3.png'],
        özellikler: {
            ürün: 'Gümüş',
            renk: 'Gri',
            gram: '6.10',
            ayar: '14'
        },
        mainCategory: 'yuzuk',
        subCategory: 'Çocuk',
        productCode: '003',
        popIndex: '',
        catIndex: '6',
        detail: 'Bileziklerimizde Bilezik Ölçüsüne Göre +,- Gram Farkı Oluşabileceğinden Fiyatlar Cüzi Miktarda Değişiklik Gösterebilir.',
        discount: ''
    },
    {
        id: '12',
        title: 'Örnek ürün 12',
        image: ['/u4.png'],
        özellikler: {
            ürün: 'Altın',
            renk: 'Sarı',
            gram: '6.90',
            ayar: '24'
        },
        mainCategory: 'yuzuk',
        subCategory: 'Çocuk',
        productCode: '004',
        popIndex: '3',
        catIndex: '5',
        detail: 'Bileziklerimizde Bilezik Ölçüsüne Göre +,- Gram Farkı Oluşabileceğinden Fiyatlar Cüzi Miktarda Değişiklik Gösterebilir.',
        discount: ''
    },
    {
        id: '13',
        title: 'Örnek ürün 13',
        image: ['/u5.png'],
        özellikler: {
            ürün: 'Gümüş',
            renk: 'Gri',
            gram: '3.10',
            ayar: '22'
        },
        mainCategory: 'yuzuk',
        subCategory: 'Çocuk',
        productCode: '005',
        popIndex: '',
        catIndex: '4',
        detail: 'Bileziklerimizde Bilezik Ölçüsüne Göre +,- Gram Farkı Oluşabileceğinden Fiyatlar Cüzi Miktarda Değişiklik Gösterebilir.',
        discount: ''
    },
    {
        id: '14',
        title: 'Örnek ürün 14',
        image: ['/u6.png'],
        özellikler: {
            ürün: 'Gümüş',
            renk: 'Gri',
            gram: '3.10',
            ayar: '22'
        },
        mainCategory: 'yuzuk',
        subCategory: 'Çocuk',
        productCode: '006',
        popIndex: '2',
        catIndex: '3',
        detail: 'Bileziklerimizde Bilezik Ölçüsüne Göre +,- Gram Farkı Oluşabileceğinden Fiyatlar Cüzi Miktarda Değişiklik Gösterebilir.',
        discount: ''
    },
    {
        id: '15',
        title: 'Örnek Ürün 15',
        image: ['/u7.png'],
        özellikler: {
            ürün: 'Gümüş',
            renk: 'Gri',
            gram: '3.10',
            ayar: '24'
        },
        mainCategory: 'yuzuk',
        subCategory: 'Çocuk',
        productCode: '007',
        popIndex: '',
        catIndex: '2',
        detail: 'Bileziklerimizde Bilezik Ölçüsüne Göre +,- Gram Farkı Oluşabileceğinden Fiyatlar Cüzi Miktarda Değişiklik Gösterebilir.',
        discount: ''
    },
    {
        id: '16',
        title: 'Örnek Ürün 16',
        image: ['/u8.png'],
        özellikler: {
            ürün: 'Gümüş',
            renk: 'Gri',
            gram: '3.10',
            ayar: '22'
        },
        mainCategory: 'yuzuk',
        subCategory: 'Çocuk',
        productCode: '008',
        popIndex: '1',
        catIndex: '1',
        detail: 'Bileziklerimizde Bilezik Ölçüsüne Göre +,- Gram Farkı Oluşabileceğinden Fiyatlar Cüzi Miktarda Değişiklik Gösterebilir.',
        discount: ''
    },
];
export const products = rawProducts.map((p) => ({
    ...p,
    price: ürünFiyatHesapla(p)  // hesaplanan fiyatı price alanına ekliyoruz
}));