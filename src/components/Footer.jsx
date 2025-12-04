import React from "react";
import { Box, Typography, Link, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#1E1E1E",
        width: "100%",
        color: "#FFFFFF",
        textAlign: "center",
        py: 1, // Vertical padding for the footer
        mt: 6, // Margin-top to add spacing from the content above
      }}
    >
      {/* Footer Content Layout */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",  // Elements will be spaced out
          alignItems: "center",  // Center vertically
          flexWrap: "wrap",  // Allow items to wrap if screen is too small
        }}
      >
        {/* 1. Logo (left) */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",  // Align logo to the left
            flex: 1,  // Take up remaining space
            paddingLeft: "2vw",  // Optional: Add some padding from the left
          }}
        >
          <img
            src="/atilim_logoo.png"
            alt="Atilim Sarrafiye"
            style={{
              height: `calc(2 * 9vw)`,
              maxHeight: '150px', // Responsive height based on viewport width
              width: "auto",
              maxwidth: "25vw"
            }}
          />
        </Box>

        {/* Middle Section: Firma Adı, İletişim, Sosyal Medya */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",  // Stack the content vertically
            alignItems: "center",  // Center text horizontally
            flex: 2,  // Take up more space in the middle
            padding: "0 1vw",  // Optional: Add padding on the sides
          }}
        >
          {/* Firma Adı */}
          <Typography
            sx={{
              fontWeight: "bold",
              mb: 1,
              fontSize: '21px',
              textAlign: "center", // Centered text
            }}
          >
            ATILIM SARRAFİYE KUYUMCULUK
          </Typography>

          {/* İletişim Bilgileri */}
          <Typography variant="body2" sx={{ mb: 1, fontSize: '14px' }}>
            Telefon: <Link href="tel:+905071188010" color="#25D366">+90 507 118 80 10</Link>
          </Typography>
          <Typography variant="body2" sx={{ mb: 1, fontSize: '14px' }}>
            E-posta: <Link href="mailto:gokayy943@gmail.com" color="#25D366">gokayy943@gmail.com</Link>
          </Typography>
          <Typography variant="body2" sx={{ mb: 0, fontSize: '14px' }}>
            Adres: Merkez, Karamürsel / Kocaeli
          </Typography>

          {/* Sosyal Medya İkonları */}
          <Box sx={{ fontSize: '21px', mb: 0 }}>
            <IconButton
              href="https://www.instagram.com/atilimsarrafiye/"
              target="_blank"
              sx={{ color: "#FFFFFF", "&:hover": { color: "#E1306C" } }}
            >
              <InstagramIcon />
            </IconButton>
          </Box>
        </Box>

        {/* 2. Logo (right) */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",  // Align logo to the right
            flex: 1,  // Take up remaining space
            paddingRight: "2vw",  // Optional: Add some padding from the right
          }}
        >
          <img
            src="/atilim_logoo.png"
            alt="Atilim Sarrafiye"
            style={{
              height: `calc(2 * 9vw)`,
              maxHeight: '150px',// Responsive height based on viewport width
              width: "auto",
              maxwidth: "25vw"
            }}
          />
        </Box>
      </Box>

      {/* Copyright */}
      <Typography variant="caption" sx={{ display: "block", mt: 0, color: "#AAAAAA" }}>
        © {new Date().getFullYear()} Atılım Sarrafiye Kuyumculuk. Tüm hakları saklıdır.
      </Typography>
    </Box>
  );
};

export default Footer;
