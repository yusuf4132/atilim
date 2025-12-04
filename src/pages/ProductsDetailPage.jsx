import React, { useState, useEffect } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableRow, Paper, IconButton, Tab } from "@mui/material";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useParams } from "react-router-dom";
import akbankLogo from '../assets/Akbank_logo.svg';
import isbankLogo from '../assets/Türkiye_İş_Bankası_logo.svg';
import Divider from '@mui/material/Divider';
import WhatsAppButton from "../components/WhatsAppButton";
import Footer from "../components/Footer";
import Sidebar from '../components/Sidebar';
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useFavorites } from "../hooks/FavoritesContext";
import { supabase } from '../supabase';
import LoadingScreen from "../components/LoadingScreen";

export default function ProductDetailPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState(null);
    const [isKom, setIsKom] = useState(0.0);
    const [akKom, setAkKom] = useState(0.0);
    useEffect(() => {
        const fetchProduct = async () => {
            const { data, error } = await supabase
                .from("products")
                .select("*")
                .eq("id", id)
                .single();

            if (!error) {
                setProduct(data);
            }
        };

        fetchProduct();
    }, []);
    useEffect(() => {
        const fetchIsKom = async () => {
            const { data, error } = await supabase
                .from("komisyon")
                .select("*")
                .eq("bank", "isbank").single();

            if (!error) {
                setIsKom(data);
            }
        };
        fetchIsKom();
    }, []);
    useEffect(() => {
        const fetchAkKom = async () => {
            const { data, error } = await supabase
                .from("komisyon")
                .select("*")
                .eq("bank", "akbank").single();

            if (!error) {
                setAkKom(data);
            }
        };
        fetchAkKom();
    }, []);

    useEffect(() => {
        if (product?.image?.length > 0) {
            setMainImage(product.image[0]);
        }
    }, [product]);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const [value, setValue] = React.useState('1');
    const { toggleFavorite, isFavorite } = useFavorites();
    if (!product) return <LoadingScreen />;
    if (!isKom) return <LoadingScreen />;
    if (!akKom) return <LoadingScreen />;

    let formattedPrice = (product.price).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");



    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    const isFav = isFavorite(product.id);
    const discountedPrice = product.discount
        ? (parseFloat(product.price) * (1 - product.discount)).toFixed(2)
        : null;

    // Komisyon hesaplamaları
    const calculateCommission = (price, installment, banka) => {
        if (!isKom || !akKom) return 0;
        if (banka == "isbank") {
            switch (installment) {
                case 3:
                    return price * isKom.three;
                case 2:
                    return price * isKom.two;
                default:
                    return price * isKom.one;
            }
        }
        else {
            switch (installment) {
                case 3:
                    return price * akKom.three;
                case 2:
                    return price * akKom.two;
                default:
                    return price * akKom.one;
            }
        }

    };
    const calculateAmount = (price, installment) => {
        switch (installment) {
            case 3:
                return price / 3;
            case 2:
                return price / 2;
            default:
                return price;
        }
    }

    return (
        <Box sx={{ width: "100%", paddingBottom: '9vh' }}>
            <Sidebar showSearch={false}
            />
            <Box sx={{ p: 3, maxWidth: 1200, margin: "0 auto", paddingBottom: '15vh' }}>
                <Typography variant="h7" sx={{ color: '#ABA7A7' }}>
                    {"Ana Menü > "}{product.main_category}{"> "}{product.sub_category}
                </Typography>
                <Divider sx={{ my: 1, bgcolor: 'rgba(0,0,0,0.1)' }} />
                <Box sx={{
                    display: "block",
                    mx: "auto",
                    width: "100%", borderColor: 'black', border: '2px solid #ccc', padding: '0px', textAlign: "center"
                    , mb: 2, position: "relative", margin: '0 auto'
                }}>
                    {/* ❤️ FAVORİ BUTONU */}
                    <IconButton
                        onClick={() =>
                            toggleFavorite({
                                id: product.id,
                                image: mainImage,
                                title: product.title,
                                price: product.price,
                            })
                        }
                        sx={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            zIndex: 10,
                            backgroundColor: "white",
                            borderRadius: "50%",
                            boxShadow: 2,
                            border: '1px solid grey'
                        }}
                    >
                        {isFav
                            ? <FavoriteIcon sx={{ color: "red" }} />
                            : <FavoriteBorderIcon />}
                    </IconButton>
                    {/* Ürün Resmi ve Başlık */}
                    <Box sx={{ mb: 0 }}>
                        <Box
                            component="img"
                            src={mainImage}
                            alt={product.title}
                            sx={{
                                width: "78%",
                                maxWidth: 500,
                                minHeight: 'auto',
                                border: '1px solid #ccc',
                                borderColor: 'black',
                                borderRadius: 0,
                                boxShadow: 3,
                                mb: 1
                            }}
                        />
                    </Box>
                    {/* Küçük Resimler */}
                    <Box sx={{ display: 'flex', mb: 1 }}>
                        {product.image.map((image, index) => (
                            <Box
                                key={index}
                                sx={{
                                    width: 80,
                                    height: 80,
                                    margin: 1,
                                    cursor: 'pointer',
                                    borderRadius: 1,
                                    boxShadow: 1,
                                    overflow: 'hidden',
                                    border: mainImage === image ? '2px solid #1976d2' : '1px solid #ccc', // 🔹 Seçili resim mavi kenarlıklı
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        border: '2px solid #1976d2'
                                    }
                                }}
                                onClick={() => setMainImage(image)} // Küçük resme tıklanınca büyük resim değişir
                            >
                                <Box
                                    component="img"
                                    src={image}
                                    alt={`Resim ${index + 1}`}
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            </Box>
                        ))}
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', fontFamily: 'Playfair Display' }}>
                        {product.title}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, backgroundColor: '#d1cfcf', width: '170px', borderRadius: '3px' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Ürün Kodu: {product.product_code}
                    </Typography>
                </Box>

                {/* Özellik Tablosu */}
                <Paper sx={{ p: 2, mb: 4, boxShadow: 3, backgroundColor: '#d1cfcf' }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Ürün Özellikleri</Typography>
                    <Table sx={{ width: "100%" }}>
                        <TableBody>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Ürün</TableCell>
                                <TableCell>{product.product}</TableCell>
                            </TableRow>
                            {/* Gram */}
                            {product.gram !== null && product.gram !== undefined && (
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Gram</TableCell>
                                    <TableCell>{product.gram}</TableCell>
                                </TableRow>
                            )}

                            {/* Ayar */}
                            {product.ayar !== null && product.ayar !== undefined && (
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Ayar</TableCell>
                                    <TableCell>{product.ayar}</TableCell>
                                </TableRow>
                            )}

                            {/* Detay (yeni eklenecek) */}
                            {product.description && (
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Detay</TableCell>
                                    <TableCell>{product.description}</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Paper>

                {/* Ödeme Seçenekleri */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ display: 'inline-block', fontWeight: 'bold', mb: 2, marginRight: '30px' }}>
                        Ödeme Seçenekleri
                    </Typography>
                    <Typography sx={{ display: 'inline-block', fontWeight: 'bold', mb: 2, color: '#5C5C5C' }}>
                        (Ödeme Yapabileceğiniz Bankalar Akbank ve İşBankası'dır)
                    </Typography>
                    <Typography>
                        <img src={akbankLogo} alt="Akbank Logo" width={130} height={50} style={{ marginRight: '30px' }} />
                    </Typography>
                    <Box
                        component="table"
                        sx={{
                            width: "100%",
                            borderCollapse: "collapse",
                            textAlign: "center",
                            boxShadow: 3,
                            borderRadius: 2,
                            overflow: "hidden"
                        }}
                    >
                        <thead>
                            <tr style={{ backgroundColor: "#f5f5f5" }}>
                                <th style={{ border: "1px solid #ccc", padding: "12px" }}>Taksit Seçeneği</th>
                                <th style={{ border: "1px solid #ccc", padding: "12px" }}>Komisyon Oranı</th>
                                <th style={{ border: "1px solid #ccc", padding: "12px" }}>Taksit Tutarı</th>
                                <th style={{ border: "1px solid #ccc", padding: "12px" }}>Toplam Tutar</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ border: "1px solid #ccc", padding: "12px" }}>Tek Çekim</td>
                                <td style={{ border: "1px solid #ccc", padding: "12px" }}>% {((akKom.one*100)-100).toFixed(2)}</td>
                                <td style={{ border: "1px solid #ccc", padding: "12px" }}>{calculateAmount(calculateCommission(product.price, 1, "akbank"), 1).toFixed(2)} x 1</td>
                                <td style={{ border: "1px solid #ccc", padding: "12px" }}>
                                    {calculateCommission(product.price, 1, "akbank").toFixed(2)} TL
                                </td>
                            </tr>
                            <tr>
                                <td style={{ border: "1px solid #ccc", padding: "12px" }}>2 Taksit</td>
                                <td style={{ border: "1px solid #ccc", padding: "12px" }}>% {((akKom.two*100)-100).toFixed(2)}</td>
                                <td style={{ border: "1px solid #ccc", padding: "12px" }}>{calculateAmount(calculateCommission(product.price, 2, "akbank"), 2).toFixed(2)} x 2</td>
                                <td style={{ border: "1px solid #ccc", padding: "12px" }}>
                                    {calculateCommission(product.price, 2, "akbank").toFixed(2)} TL
                                </td>
                            </tr>
                            <tr>
                                <td style={{ border: "1px solid #ccc", padding: "12px" }}>3 Taksit</td>
                                <td style={{ border: "1px solid #ccc", padding: "12px" }}>% {((akKom.three*100)-100).toFixed(2)}</td>
                                <td style={{ border: "1px solid #ccc", padding: "12px" }}>{calculateAmount(calculateCommission(product.price, 3, "akbank"), 3).toFixed(2)} x 3</td>
                                <td style={{ border: "1px solid #ccc", padding: "12px" }}>
                                    {calculateCommission(product.price, 3, "akbank").toFixed(2)} TL
                                </td>
                            </tr>
                        </tbody>
                    </Box>
                    <Typography>
                        <img src={isbankLogo} alt="İşBankası Logo" width={130} height={50} />
                    </Typography>
                    <Box
                        component="table"
                        sx={{
                            width: "100%",
                            borderCollapse: "collapse",
                            textAlign: "center",
                            boxShadow: 3,
                            borderRadius: 2,
                            overflow: "hidden"
                        }}
                    >
                        <thead>
                            <tr style={{ backgroundColor: "#f5f5f5" }}>
                                <th style={{ border: "1px solid #ccc", padding: "12px" }}>Taksit Seçeneği</th>
                                <th style={{ border: "1px solid #ccc", padding: "12px" }}>Komisyon Oranı</th>
                                <th style={{ border: "1px solid #ccc", padding: "12px" }}>Taksit Tutarı</th>
                                <th style={{ border: "1px solid #ccc", padding: "12px" }}>Toplam Tutar</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ border: "1px solid #ccc", padding: "12px" }}>Tek Çekim</td>
                                <td style={{ border: "1px solid #ccc", padding: "12px" }}>% {((isKom.one*100)-100).toFixed(2)}</td>
                                <td style={{ border: "1px solid #ccc", padding: "12px" }}>{calculateAmount(calculateCommission(product.price, 1, "isbank"), 1).toFixed(2)} x 1</td>
                                <td style={{ border: "1px solid #ccc", padding: "12px" }}>
                                    {calculateCommission(product.price, 1, "isbank").toFixed(2)} TL
                                </td>
                            </tr>
                            <tr>
                                <td style={{ border: "1px solid #ccc", padding: "12px" }}>2 Taksit</td>
                                <td style={{ border: "1px solid #ccc", padding: "12px" }}>% {((isKom.two*100)-100).toFixed(2)}</td>
                                <td style={{ border: "1px solid #ccc", padding: "12px" }}>{calculateAmount(calculateCommission(product.price, 2, "isbank"), 2).toFixed(2)} x 2</td>
                                <td style={{ border: "1px solid #ccc", padding: "12px" }}>
                                    {calculateCommission(product.price, 2, "isbank").toFixed(2)} TL
                                </td>
                            </tr>
                            <tr>
                                <td style={{ border: "1px solid #ccc", padding: "12px" }}>3 Taksit</td>
                                <td style={{ border: "1px solid #ccc", padding: "12px" }}>% {((isKom.three*100)-100).toFixed(2)}</td>
                                <td style={{ border: "1px solid #ccc", padding: "12px" }}>{isKom && akKom ? (
                                    calculateAmount(
                                        calculateCommission(product.price, 3, "isbank"),
                                        3
                                    ).toFixed(2)
                                ) : (
                                    "Hesaplanıyor..."
                                )} x 3</td>
                                <td style={{ border: "1px solid #ccc", padding: "12px" }}>
                                    {calculateCommission(product.price, 3, "isbank").toFixed(2)} TL
                                </td>
                            </tr>
                        </tbody>
                    </Box>
                </Box>
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange} aria-label="lab API tabs example">
                                <Tab label="Açıklama" value="1" />
                            </TabList>
                        </Box>
                        <TabPanel value="1" sx={{ color: 'red' }}>{product.detail}</TabPanel>
                    </TabContext>
                </Box>
                {/* Satın Al Butonu */}
                <Box sx={{ textAlign: "center" }}>
                    <WhatsAppButton phoneNumber="905071188010" bottom="100" />
                </Box>
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '9vh',
                        backgroundColor: 'white',
                        color: 'black',
                        display: 'inline-block',
                        justifyContent: 'space-between',
                        alignItems: 'end',
                        padding: '12px 20px',
                        boxShadow: 3,
                        zIndex: 1000,
                        borderTop: '2px solid #5C5C5C',
                    }}
                >
                    <Typography component='div' sx={{ fontSize: '24px', fontFamily: 'Montserrat', display: "inline-block" }}>
                        {product.title}{<p style={{ display: 'inline-block', marginRight: '40px', marginTop: '0px' }}></p>}
                    </Typography>
                    {/* Normal fiyat */}
                    <Typography variant="body2" color="textSecondary" sx={{ display: "inline-block" }}>
                        <span style={{ textDecoration: discountedPrice ? 'line-through' : 'none', fontSize: '18px' }}>
                            {formattedPrice} ₺
                        </span>
                    </Typography>

                    {/* İndirimli fiyat */}
                    {discountedPrice && (
                        <Typography variant="body2" color="red" sx={{ fontSize: '18px' }}>
                            {discountedPrice} ₺ (%{product.discount * 100} indirim)
                        </Typography>
                    )}
                </Box>
            </Box>
            <Footer />
        </Box>
    );
}