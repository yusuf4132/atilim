import {
    Box, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    FormControl, InputLabel, Select, MenuItem, TextField
} from '@mui/material'
import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar';
import ProductCard from '../components/ProductCard';
import { useParams } from "react-router-dom";
//import { products } from '../products';
import Footer from '../components/Footer';
import { supabase } from '../supabase';
import LoadingScreen from "../components/LoadingScreen";

export default function CategoryPage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const [products,setProducts]=useState([]);
    useEffect(() => {
        const fetchProducts = async () => {
          const { data, error } = await supabase
            .from('products')
            .select('*');
          if (error) console.log(error);
          else setProducts(data); // products state'ini güncelle
        };
        fetchProducts();
      }, []);
    if (products==[]) return <LoadingScreen />;
    const { category, subCategory } = useParams();
    const [visibleCount, setVisibleCount] = useState(() => {
        return window.innerWidth < 600 ? 6 : 12;
    });
    const handleLoadMore = () => {
        const increment = window.innerWidth < 600 ? 4 : 8;
        setVisibleCount(prev => prev + increment);
    };
    //const categoryFilteredProducts = category
    //    ? products.filter(p => p.mainCategory === category)
    //    : products; 
    let categoryFilteredProducts = products;

    if (category) {
        categoryFilteredProducts = categoryFilteredProducts.filter(
            p => p.main_category.toLowerCase() === category.toLowerCase()
        );
    }

    if (subCategory) {
        categoryFilteredProducts = categoryFilteredProducts.filter(
            p => p.sub_category.toLowerCase() === subCategory.toLowerCase()
        );
    }
    const [searchTerm, setSearchTerm] = useState('');
    const [sortType, setSortType] = useState("pop");
    const [filters, setFilters] = useState({
        ürün: "",
        ayar: "",
        minPrice: "",
        maxPrice: ""
    });
    //const [filteredProducts, setFilteredProducts] = useState(categoryFilteredProducts);
    const [openFilterDialog, setOpenFilterDialog] = useState(false);
    const [tempFilters, setTempFilters] = useState(filters);
    const getFilteredAndSortedProducts = () => {
        let list = [...categoryFilteredProducts];

        // 1) POPINDEXİ OLMAYANLARI ELE
        list = list.filter(item => item.cat_index && item.cat_index !== "");

        // 2) FİLTRELER
        if (filters.ürün) {
            list = list.filter(item => item.product === filters.ürün);
        }
        if (filters.ayar) {
            list = list.filter(item => item.ayar.toString() === filters.ayar);
        }
        if (filters.minPrice) {
            list = list.filter(item => Number(item.price) >= Number(filters.minPrice));
        }
        if (filters.maxPrice) {
            list = list.filter(item => Number(item.price) <= Number(filters.maxPrice));
        }

        // 3) SIRALAMA
        if (sortType === "pop") {
            list.sort((a, b) => Number(a.cat_index) - Number(b.cat_index));
        }
        if (sortType === "price-asc") {
            list.sort((a, b) => Number(a.price) - Number(b.price));
        }
        if (sortType === "price-desc") {
            list.sort((a, b) => Number(b.price) - Number(a.price));
        }

        return list;
    };
    const filteredProducts = getFilteredAndSortedProducts();


    const handleSearch = () => {
        const filtered = categoryFilteredProducts.filter(product =>
            product.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
    };
    return (
        <Box sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column"
        }}>
            <Sidebar searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleSearch={handleSearch}
                showSearch={true} />
            <Box sx={{
                flexGrow: 1,
                p: 1, paddingLeft: { xs: 0, sm: '50px' }, // xs ve sm arası cihazlarda padding sol sıfır, sm ve sonrasında 50px
                paddingRight: { xs: 0, sm: '50px' }, textAlign: 'center', backgroundColor: '#EDE8E8', marginBottom: '-48px', paddingBottom: '50px'
            }}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 3, marginTop: '20px' }}>

                    {/* Sıralama */}
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>Sırala</InputLabel>
                        <Select
                            label="Sırala"
                            value={sortType}
                            onChange={(e) => setSortType(e.target.value)}
                        >
                            <MenuItem value="pop">Önerilen</MenuItem>
                            <MenuItem value="price-asc">Artan Fiyat</MenuItem>
                            <MenuItem value="price-desc">Azalan Fiyat</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Filtre Butonu */}
                    <Button variant="contained" color="primary" onClick={() => setOpenFilterDialog(true)}>
                        Filtrele
                    </Button>

                </Box>
                <Grid container spacing={2} sx={{ justifyContent: 'center', marginTop: '20px' }}>
                    {filteredProducts.slice(0, visibleCount).map((product) => (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            title={product.title}
                            price={product.price}
                            image={product.image[0]}
                            discountt={product.discount}
                        />
                    ))}
                </Grid>
                {visibleCount < filteredProducts.length && (
                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <button
                            onClick={handleLoadMore}
                            style={{
                                padding: '10px 20px',
                                fontSize: '16px',
                                cursor: 'pointer',
                                borderRadius: '8px',
                                border: '1px solid black'
                            }}
                        >
                            Daha Fazla Göster
                        </button>
                    </Box>
                )}
            </Box>
            <Footer sx={{}} />
            <Dialog open={openFilterDialog} onClose={() => setOpenFilterDialog(false)}>
                <DialogTitle>Filtrele</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>

                    {/* Ürün Türü */}
                    <FormControl fullWidth sx={{ marginTop: '10px' }}>
                        <InputLabel>Ürün</InputLabel>
                        <Select
                            label="Ürün"
                            value={tempFilters.ürün}
                            onChange={e => setTempFilters(prev => ({ ...prev, ürün: e.target.value }))}
                        >
                            <MenuItem value="">Tümü</MenuItem>
                            <MenuItem value="altın">Altın</MenuItem>
                            <MenuItem value="pırlanta">Pırlanta</MenuItem>
                            <MenuItem value="gümüş">Gümüş</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Ayar */}
                    <FormControl fullWidth>
                        <InputLabel>Ayar</InputLabel>
                        <Select
                            label="Ayar"
                            value={tempFilters.ayar}
                            onChange={e => setTempFilters(prev => ({ ...prev, ayar: e.target.value }))}
                        >
                            <MenuItem value="">Tümü</MenuItem>
                            <MenuItem value="14">14 Ayar</MenuItem>
                            <MenuItem value="22">22 Ayar</MenuItem>
                            <MenuItem value="24">24 Ayar</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Fiyat Aralığı */}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            label="Min Fiyat"
                            type="number"
                            fullWidth
                            value={tempFilters.minPrice}
                            onChange={e => setTempFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                        />
                        <TextField
                            label="Max Fiyat"
                            type="number"
                            fullWidth
                            value={tempFilters.maxPrice}
                            onChange={e => setTempFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                        />
                    </Box>

                </DialogContent>

                <DialogActions>
                    <Button onClick={() => {
                        setTempFilters({
                            ürün: "",
                            ayar: "",
                            minPrice: "",
                            maxPrice: ""
                        });
                    }}>Temizle</Button>
                    <Button onClick={() => setOpenFilterDialog(false)}>İptal</Button>

                    <Button
                        variant="contained"
                        onClick={() => {
                            setFilters(tempFilters);
                            setOpenFilterDialog(false);
                        }}
                    >
                        Uygula
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}