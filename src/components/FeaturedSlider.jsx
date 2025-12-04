import React from 'react';
import Slider from 'react-slick';
import { Box, Typography } from '@mui/material';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function FeaturedSlider({ items }) {
  const settings = {
    dots: true,             // alt kısımda navigasyon noktaları
    infinite: true,         // sonsuz döngü
    speed: 1100,             // geçiş animasyon süresi (ms)
    slidesToShow: 1,        // aynı anda 1 slide göster
    slidesToScroll: 1,
    autoplay: true,         // otomatik geçiş
    autoplaySpeed: 4000,    // 4 saniye
    arrows: false,          // ok tuşlarını gizle
  };
  const sortedSlider = items.sort((a, b) => a.slider_index - b.slider_index);

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Slider {...settings}>
        {sortedSlider.map((item, index) => (
          <Box
            key={index}
            sx={{
              height: { xs: 200, md: 400 }, // responsive yükseklik
              backgroundImage: `url(${item.image_url || 'https://via.placeholder.com/1200x400'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              textShadow: '0px 0px 10px rgba(0,0,0,0.6)',
              marginTop: '1px',
              marginBottom: '-5px'
            }}
          >
          </Box>
        ))}
      </Slider>
    </Box>
  );
}
