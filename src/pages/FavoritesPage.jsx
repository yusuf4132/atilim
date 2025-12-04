import React,{useEffect} from "react";
import {useFavorites} from "../hooks/FavoritesContext";
import ProductCard from "../components/ProductCard";
import {
    Box, Grid, Typography
} from '@mui/material'
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

export default function FavoritesPage() {
    const { favorites } = useFavorites();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <Box sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column"
        }}>
            <Sidebar
                showSearch={false} />
            <Box sx={{
                flexGrow: 1,
                p: 1, paddingLeft: { xs: 0, sm: '50px' }, // xs ve sm arası cihazlarda padding sol sıfır, sm ve sonrasında 50px
                paddingRight: { xs: 0, sm: '50px' }, textAlign: 'center', backgroundColor: '#EDE8E8', marginBottom: '-48px', paddingBottom: '50px'
            }}>
                <Typography sx={{ fontFamily: 'Playfair Display', fontSize: '26px', fontWeight: '600' }}>Favori Ürünleriniz</Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 3, marginTop: '20px' }}>
                </Box>
                <Grid container spacing={2} sx={{ justifyContent: 'center', marginTop: '20px' }}>
                    {favorites.map((product) => (
                        <ProductCard
                            key={product.id} {...product}
                        />
                    ))}
                </Grid>
            </Box>
            <Footer sx={{}} />
        </Box>
    );
}