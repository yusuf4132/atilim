import React from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Typography, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../hooks/FavoritesContext';

export default function ProductCard({ id, title, price,image, discountt }) {
    let formattedPrice = price.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    const navigate = useNavigate();
    const { toggleFavorite, isFavorite } = useFavorites();
    const discountedPrice = discountt
        ? (parseFloat(price) * (1 - discountt)).toFixed(2)
        : null;
    return (
        <Card sx={{ m: 0, height: "auto", width: '41vw', maxWidth: '358px', position: 'relative' }}>
            {/* ❤️ Kalp Butonu */}
            <IconButton
                onClick={(e) => {
                    e.stopPropagation(); // kart tıklamasına gitmesin
                    toggleFavorite({ id, image, title, price });
                }}
                sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    zIndex: 2,
                    background: 'white'
                }}
            >
                {isFavorite(id)
                    ? <FavoriteIcon sx={{ color: 'red' }} />
                    : <FavoriteBorderIcon />}
            </IconButton>
            <CardActionArea onClick={() => navigate(`/product/${id}`)}>
                {/* Ürün görseli */}
                <CardMedia
                    component="img"
                    sx={{
                        height: `calc(${55} * 1vw)`, // 'x' ile istediğiniz oranı çarpın
                        maxHeight: '470px'
                    }}
                    image={image || 'https://via.placeholder.com/250x140?text=Ürün+Görseli'}
                    alt={title || 'Ürün'}
                />
                {/* Açıklama ve fiyat */}
                <CardContent>
                    <Typography gutterBottom sx={{ fontSize: '15px', fontFamily: 'Playfair Display', fontWeight: '500' }} component="div">
                        {title || 'Ürün Adı'}
                    </Typography>
                    {/* Normal fiyat */}
                    <Typography variant="body2" color="textSecondary">
                        <span style={{ textDecoration: discountedPrice ? 'line-through' : 'none', fontSize: '18px' }}>
                            {formattedPrice} ₺
                        </span>
                    </Typography>

                    {/* İndirimli fiyat */}
                    {discountedPrice && (
                        <Typography variant="body2" color="red" sx={{ fontSize: '18px' }}>
                            {discountedPrice} ₺ (%{discountt * 100} indirim)
                        </Typography>
                    )}

                </CardContent>
            </CardActionArea>
        </Card>
    );
}
