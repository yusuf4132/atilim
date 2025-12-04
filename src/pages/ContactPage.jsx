import { Box, Grid, Typography, Link, Paper } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { useEffect } from "react";

export default function ContactPage() {
    const settings = {
        dots: true,
        infinite: true,
        arrows: false,
        speed: 600,
        autoplay: true,
        autoplaySpeed: 2500,
        slidesToShow: 1,
        slidesToScroll: 1
    };
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <Box>
            <Sidebar showSearch={false} />
            <Box sx={{ p: 2, maxWidth: 1100, margin: "0 auto", pb: 10 }}>

                <Typography
                    variant="h4"
                    sx={{
                        textAlign: "center",
                        mb: 4,
                        fontWeight: "bold",
                        color: "#5c3d00",
                        fontFamily: 'Playfair Display'
                    }}
                >
                    İletişim
                </Typography>
                <Typography sx={{ textAlign: 'center', fontSize: '24px', fontWeight: '600' }}>1. Şubemiz</Typography>
                <Grid container spacing={2} sx={{ marginBottom: '55px' }}>
                    <Box component="img" src="/dukkan1.jpg" alt="Dükkan Foto 1" sx={{ width: { xs: '100%', sm: '49%' } }} />
                    <Box component="img" src="/dukkan2.jpg" alt="Dükkan Foto 2" sx={{ width: { xs: '100%', sm: '49%' } }} />
                </Grid>
                <Typography sx={{ textAlign: 'center', fontSize: '24px', fontWeight: '600' }}>2. Şubemiz</Typography>
                <Grid container spacing={2} sx={{ marginBottom: '55px' }}>
                    <Box component="img" src="/dukkan1.jpg" alt="Dükkan Foto 1" sx={{ width: { xs: '100%', sm: '49%' } }} />
                    <Box component="img" src="/dukkan2.jpg" alt="Dükkan Foto 2" sx={{ width: { xs: '100%', sm: '49%' } }} />
                </Grid>
                {/* Bilgi Kartı */}
                <Grid item xs={12} md={5} sx={{ marginBottom: '30px', width: '100%', textAlign: 'center' }}>
                    <Paper
                        elevation={4}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            height: "100%",
                            background: "linear-gradient(135deg, #fff, #f7f5f2)"
                        }}
                    >
                        <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", color: "#5c3d00" }}>
                            Atılım Sarrafiye
                        </Typography>

                        <Typography sx={{ mb: 1 }}>
                            <strong>Adres:</strong> Cumhuriyet Caddesi Karamürsel/Kocaeli
                        </Typography>

                        <Typography sx={{ mb: 1 }}>
                            <strong>Telefon:</strong>{" "}
                            <Link href="tel:+905071188010">0507 118 80 10</Link>
                        </Typography>

                        <Typography sx={{ mb: 1 }}>
                            <strong>Email:</strong>{" "}
                            <Link href="mailto:gokayy943@gmail.com">gokayy943@gmail.com</Link>
                        </Typography>

                        <Typography sx={{ mb: 1 }}>
                            <strong>Instagram:</strong>{" "}
                            <Link
                                href="https://instagram.com/atilimsarrafiye"
                                target="_blank"
                                sx={{ ml: 1 }}
                            >
                                @atilimsarrafiye
                            </Link>
                        </Typography>

                        <Typography sx={{ mt: 2, color: "#5c3d00", fontWeight: "bold" }}>
                            Çalışma Saatleri
                        </Typography>
                        <Typography>Hafta içi: 09:00 - 19:00</Typography>
                        <Typography>Cumartesi-Pazar: 09:00 - 18:00</Typography>
                    </Paper>
                </Grid>


                {/* Harita */}
                <Paper
                    elevation={4}
                    sx={{
                        mt: 5,
                        borderRadius: 3,
                        overflow: "hidden",
                        width: '100%'
                    }}
                >
                    <Typography sx={{ textAlign: 'center', fontSize: '24px', fontWeight: '600',paddingTop: '30px' }}>1. Şubemizin Konumu</Typography>
                    <iframe src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d189.07242557305352!2d29.615992258548804!3d40.6924999467197!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDDCsDQxJzMzLjEiTiAyOcKwMzYnNTcuOSJF!5e0!3m2!1str!2str!4v1763559091186!5m2!1str!2str" width="100%" height="450" style={{border:0,marginBottom:'20px'}} loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>

                    <Typography sx={{ textAlign: 'center', fontSize: '24px', fontWeight: '600' }}>
                        2. Şubemizin Konumu</Typography>
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d267.38832373286976!2d29.61612234471904!3d40.69261576509945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cb17ee0dfface5%3A0x8bebeae1226692da!2sCamiatik%2C%20Cumhuriyet%20Cd.%20No%3A16%2C%2041500%20Karam%C3%BCrsel%2FKocaeli!5e0!3m2!1str!2str!4v1763300767401!5m2!1str!2str" width="100%" height="450" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </Paper>
            </Box>
            <Footer />
        </Box>
    );
}
