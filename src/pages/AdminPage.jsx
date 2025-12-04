import React, { useState } from "react";
import {
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Box,
    Typography,
    IconButton,
    AppBar,
    useMediaQuery,
    CircularProgress,
    Button,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import CategoryIcon from "@mui/icons-material/Category";
import LayersIcon from "@mui/icons-material/Layers";
import InventoryIcon from "@mui/icons-material/Inventory";
import CollectionsIcon from "@mui/icons-material/Collections";
import ImageIcon from "@mui/icons-material/Image";
import ScaleIcon from "@mui/icons-material/Scale";
import SortIcon from "@mui/icons-material/Sort";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

import AdminCategoryPage from "./AdminCategoryPage";
import AdminKomisyonPage from "./AdminKomisyonPage";
import AdminGramPage from "./AdminGramPage";
import AdminFeaturePage from "./AdminFeaturePage";
import AdminCatalogPage from "./AdminCatalogPage";
import AdminProductsPage from "./AdminProductsPage";
import { supabase } from "../supabase";

const drawerWidth = 250;

export default function AdminPage() {
    const [activeMenu, setActiveMenu] = useState("Kategori");
    const [mobileOpen, setMobileOpen] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);

    // Telefon ekranını algılar
    const isMobile = useMediaQuery("(max-width:900px)");

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const menuItems = [
        { text: "Kategori", icon: <CategoryIcon /> },
        { text: "Ürün", icon: <InventoryIcon /> },
        { text: "Katalog", icon: <CollectionsIcon /> },
        { text: "Afiş", icon: <ImageIcon /> },
        { text: "Gram Fiyat", icon: <ScaleIcon /> },
        { text: "Komisyon", icon: <MonetizationOnIcon /> },
    ];
    const handleLogout = async () => {
        setLogoutLoading(true);
        const { error } = await supabase.auth.signOut();
        setLogoutLoading(false);

        if (error) {
            console.error('Çıkış hatası:', error);
            setSnackbar({
                open: true,
                message: 'Çıkış Yapılamadı!',
                severity: 'error',
            });
        } else {
            navigate('/');
        }
    };

    const drawerContent = (
        <Box sx={{}}>
            {logoutLoading && (
                <Box display="flex" alignItems="center" mb={2}>
                    <CircularProgress size={20} sx={{ mr: 1 }} color='black' />
                    <Typography variant="body2">Çıkış yapılıyor...</Typography>
                </Box>
            )}
            <Toolbar />
            <Box sx={{ p: 2, textAlign: "center" }}>
                <Typography sx={{ fontSize: 20, fontWeight: "bold", color: "#5c3d00" }}>
                    Admin Panel
                </Typography>
            </Box>

            <List>
                {menuItems.map((item) => (
                    <ListItemButton
                        key={item.text}
                        onClick={() => {
                            setActiveMenu(item.text);
                            if (isMobile) setMobileOpen(false);
                        }}
                        sx={{
                            borderRadius: 1,
                            mx: 1,
                            mb: 0.5,
                            backgroundColor:
                                activeMenu === item.text ? "rgba(149, 116, 59, 0.15)" : "transparent",
                            "&:hover": {
                                backgroundColor: "rgba(149, 116, 59, 0.20)",
                            },
                        }}
                    >
                        <ListItemIcon sx={{ color: "#5c3d00" }}>{item.icon}</ListItemIcon>
                        <ListItemText
                            primary={item.text}
                            primaryTypographyProps={{
                                fontWeight: activeMenu === item.text ? "bold" : "normal",
                                color: "#5c3d00",
                            }}
                        />
                    </ListItemButton>
                ))}
                <Button variant="contained" onClick={handleLogout} sx={{ mb: 2, backgroundColor: 'red', fontSize: '18px', width: '170px' ,marginLeft:'15px'}}>
                    Çıkış Yap
                </Button>
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: "flex" }}>
            {/* ÜSTTE HAMBURGER APP BAR (sadece mobilde) */}
            {isMobile && (
                <AppBar
                    position="fixed"
                    sx={{ backgroundColor: "#5c3d00", zIndex: 1300 }}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6">Admin Panel</Typography>
                    </Toolbar>
                </AppBar>
            )}

            {/* SOL MENÜ */}
            <Drawer
                variant={isMobile ? "temporary" : "permanent"}
                open={isMobile ? mobileOpen : true}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                        backgroundColor: "#f7f3ee",
                        borderRight: "1px solid #d8cfc4",
                    },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* SAĞ İÇERİK */}
            <Box
                sx={{
                    flexGrow: 1,
                    p: 2,
                    ml: isMobile ? 0 : `${drawerWidth}px`,
                }}
            >
                {isMobile && <Toolbar />}

                {/* Menü içerikleri */}
                {activeMenu === "Kategori" && <AdminCategoryPage />}
                {activeMenu === "Ürün" && <AdminProductsPage />}
                {activeMenu === "Katalog" && <AdminCatalogPage />}
                {activeMenu === "Afiş" && <AdminFeaturePage />}
                {activeMenu === "Gram Fiyat" && <AdminGramPage />}
                {activeMenu === "Komisyon" && <AdminKomisyonPage />}
            </Box>
        </Box>
    );
}
