import React from "react";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Box, IconButton, Tooltip } from "@mui/material";

const WhatsAppButton = ({ phoneNumber, bottom }) => {
  // numara başında ülke kodu olmalı, örneğin Türkiye için 905xxxxxxxxx formatında
  const message = "Merhaba!";
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <Tooltip title="WhatsApp ile iletişime geç">
      <Box
        sx={{
          position: "fixed",
          bottom: `${bottom}px`, // 💡 fiyat barının hemen üstünde olacak
          right: "5px",
          zIndex: 1100,
        }}
      >
        <IconButton
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            backgroundColor: "#25D366",
            color: "white",
            width: 66,
            height: 66,
            "&:hover": { backgroundColor: "#1EBE5D" },
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          }}
        >
          <WhatsAppIcon sx={{ fontSize: 30 }} />
        </IconButton>
      </Box>
    </Tooltip>
  );
};

export default WhatsAppButton;
