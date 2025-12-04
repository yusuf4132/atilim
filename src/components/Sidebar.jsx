import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { HomeOutlined } from '@mui/icons-material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { alpha, styled } from '@mui/material/styles';
import ContactMailIcon from "@mui/icons-material/ContactMail";
import { useNavigate } from "react-router-dom";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Link } from 'react-router-dom';
import { supabase } from "../supabase";
import LoadingScreen from './LoadingScreen';

const drawerWidth = 240;

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.black, 0.05),
    '&:hover': { backgroundColor: alpha(theme.palette.common.black, 0.1) },
    marginLeft: 0,
    width: '100%',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    },
}));

export default function Sidebar({ searchTerm, setSearchTerm, handleSearch, showSearch }) {
    const navigate = useNavigate();
    const theme = useTheme();
    const [openDrawer, setOpenDrawer] = React.useState(false);
    const [openSubmenu, setOpenSubmenu] = React.useState({
        urunler: false,
        musteriler: false,
    });
    const [categories, setCategories] = React.useState(null);
    const [subcategories, setSubcategories] = React.useState(null);

    React.useEffect(() => {
        const fetchMenuData = async () => {
            const { data: categoriesData } = await supabase
                .from("categories")
                .select("*");

            const { data: subcatsData } = await supabase
                .from("subcategories")
                .select("*");

            setCategories(categoriesData || []);
            setSubcategories(subcatsData || []);
        };

        fetchMenuData();
    }, []);
    if (!categories) return <LoadingScreen />;
    if (!subcategories) return <LoadingScreen />;
    const handleCategoryClick = (cat) => {
        navigate(`/kategori/${cat}`);
    };

    const handleDrawerToggle = () => setOpenDrawer((prev) => !prev);
    const handleSubmenuToggle = (key) => {
        setOpenSubmenu((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            {/* AppBar */}
            <AppBar
                position="fixed"
                sx={{
                    backgroundColor: "white !important",
                    color: "#5c3d00",
                    boxShadow: "0 0 0 rgba(0,0,0,0)",
                    zIndex: theme.zIndex.drawer + 1,
                    borderBottom: '1px solid grey',
                    width: '100%'
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 3 }}
                    >
                        {openDrawer ? <ChevronLeftIcon /> : <MenuIcon />}
                    </IconButton>
                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'start' }}>
                        <img
                            src="/atilim_logoo.png"  // Buraya logo resminizin yolunu yazın
                            alt="Atilim Sarrafiye"
                            style={{ height: '60px', width: 'auto', padding: '2px' }} // Yüksekliği ayarlayın
                        />
                    </Box>
                    <IconButton color="inherit" onClick={() => navigate("/")} sx={{ marginRight: '15px' }}>
                        <HomeOutlined />
                    </IconButton>
                    <IconButton component={Link} to="/favorites">
                        <FavoriteIcon />
                    </IconButton>

                    {showSearch && (
                        <Search sx={{ maxWidth: 'calc(65px + 18vw)' }}>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Ürün ara.."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => { if (e.key === 'Enter') handleSearch(); }}
                            />
                        </Search>
                    )}
                    <IconButton color="inherit" onClick={() => navigate('/iletisim')}>
                        <ContactMailIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Drawer */}
            <Drawer
                variant="temporary"
                anchor="left"
                open={openDrawer}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true, sx: { backgroundColor: "transparent", backdropFilter: "none" } }}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        backgroundColor: 'white',
                        overflowX: 'hidden',
                        color: '#5c3d00',
                    },
                }}
            >
                <Box
                    sx={{
                        width: drawerWidth,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {/* Üst kısım (kategoriler) */}
                    <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
                        <Typography variant="h6" sx={{ p: 2, fontWeight: 'bold', textAlign: 'center' }}>
                            Ürünlerimiz
                        </Typography>
                        <Divider />

                        <List>
                            {categories.map((cat) => {
                                const catId = cat.id;
                                const subcats = subcategories.filter(s => s.category_id === catId);

                                return (
                                    <React.Fragment key={cat.id}>

                                        <ListItem disablePadding>
                                            <ListItemButton onClick={() => {
                                                handleCategoryClick(cat.name);
                                                setOpenDrawer(false);
                                            }}>
                                                <ListItemText primary={cat.name.charAt(0).toUpperCase() + cat.name.slice(1)} />
                                            </ListItemButton>

                                            {/* Eğer alt kategori varsa ok ikonu */}
                                            {subcats.length > 0 && (
                                                <IconButton
                                                    sx={{ border: '1px solid grey', marginRight: '5px' }}
                                                    onClick={() => handleSubmenuToggle(cat.name)}
                                                >
                                                    {openSubmenu[cat.name] ? <ExpandLess /> : <ExpandMore />}
                                                </IconButton>
                                            )}
                                        </ListItem>

                                        {/* Alt kategorileri render et */}
                                        {subcats.length > 0 && (
                                            <Collapse in={openSubmenu[cat.name]} timeout="auto" unmountOnExit>
                                                <List component="div" disablePadding sx={{ pl: 4 }}>
                                                    <Divider sx={{ my: 0.0, bgcolor: 'rgba(0,0,0,0.1)' }} />
                                                    {subcats.map((sub, idx) => (
                                                        <React.Fragment key={sub.id}>
                                                            <ListItemButton
                                                                onClick={() => {
                                                                    navigate(`/kategori/${cat.name}/${sub.name.toLowerCase()}`);
                                                                    setOpenDrawer(false);
                                                                }}
                                                            >
                                                                <ListItemText
                                                                    primary={sub.name.charAt(0).toUpperCase() + sub.name.slice(1)}
                                                                />
                                                            </ListItemButton>

                                                            {/* Son öğeden sonra divider koyma */}
                                                            {idx < subcats.length - 1 && (
                                                                <Divider sx={{ my: 0.5, bgcolor: 'rgba(0,0,0,0.1)' }} />
                                                            )}
                                                        </React.Fragment>
                                                    ))}
                                                </List>
                                            </Collapse>
                                        )}
                                        <Divider sx={{ my: 0.0, bgcolor: 'rgba(0,0,0,0.1)' }} />
                                    </React.Fragment>
                                );
                            })}
                        </List>
                    </Box>
                    <Box sx={{ p: 1, borderTop: "1px solid #ccc" }}>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => {
                                    navigate("/admin-login");
                                    setOpenDrawer(false);
                                }}
                                sx={{ textAlign: "center", justifyContent: "end", alignItems: 'end', py: 2 }}
                            >
                                <ListItemText
                                    primary="Yönetici Girişi"
                                />
                            </ListItemButton>
                        </ListItem>
                    </Box>
                </Box>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 0, mt: 8 }} />
        </Box>
    );
}
