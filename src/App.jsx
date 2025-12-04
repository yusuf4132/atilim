import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import FeaturedSlider from './components/FeaturedSlider';
import ProductCard from './components/ProductCard';
import ProductDetailPage from './pages/ProductsDetailPage';
import {
  Box, Grid, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, TextField
} from '@mui/material';
import Footer from './components/Footer';
import Catalog from './components/Catalog';
import ContactPage from './pages/ContactPage';
import CategoryPage from './pages/CategoryPage';
import FavoritesPage from './pages/FavoritesPage';
import WhatsAppButton from './components/WhatsAppButton';
import { supabase } from './supabase';
import LoadingScreen from "./components/LoadingScreen";
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './pages/ProtectedRoute';
import AdminLogin from './pages/AdminLogin';

function App() {
  const [catalog, setCatalog] = useState(null);
  const [products, setProducts] = useState(null);
  const [featuredItems, setFeaturedItems] = useState(null);
  const [productNames, setProductNames] = useState(null);
  const MY_UID = "444d3a14-5844-4cc6-ad99-9ef57bcf151d";

  useEffect(() => {
    const fetchProductNames = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("product")
        .not("product", "is", null); // product NULL OLMAYANLAR

      if (!error) {
        // Tekrarlı isim varsa temizle (unique)
        const uniqueNames = [...new Set(data.map(item => item.product))];
        setProductNames(uniqueNames);
      }
    };

    fetchProductNames();
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    const fetchCatalog = async () => {
      const { data, error } = await supabase
        .from('catalog_items')
        .select('*');
      if (error) console.log(error);
      else setCatalog(data);
    };
    fetchCatalog();
  }, []);
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
  useEffect(() => {
    const fetchFeaturedItems = async () => {
      const { data, error } = await supabase
        .from('featured_items')
        .select('*')
        .order('slider_index', { ascending: false });

      if (error) console.log(error);
      else setFeaturedItems(data);
    };

    fetchFeaturedItems();
  }, []);


  const [sortType, setSortType] = useState("pop");
  const [filters, setFilters] = useState({
    ürün: "",
    ayar: "",
    minPrice: "",
    maxPrice: ""
  });
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);

  const [searchTerm, setSearchTerm] = useState('');
  //const [filteredProducts, setFilteredProducts] = useState(products);
  const [visibleCount, setVisibleCount] = useState(() => {
    return window.innerWidth < 600 ? 6 : 12;
  });
  if (!products) return <LoadingScreen />;
  if (!catalog) return <LoadingScreen />;
  if (!featuredItems) return <LoadingScreen />;
  if (!productNames) return <LoadingScreen />;
  const getFilteredAndSortedProducts = () => {
    let list = [...products];

    // 1) POPINDEXİ OLMAYANLARI ELE
    list = list.filter(item => item.pop_index && item.pop_index !== "");

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
      list.sort((a, b) => Number(a.pop_index) - Number(b.pop_index));
    }
    if (sortType === "price-asc") {
      list.sort((a, b) => Number(a.price) - Number(b.price));
    }
    if (sortType === "price-desc") {
      list.sort((a, b) => Number(b.price) - Number(a.price));
    }
    if (searchTerm.trim() !== "") {
      list = list.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return list;
  };
  const filteredProducts = getFilteredAndSortedProducts();

  const handleLoadMore = () => {
    const increment = window.innerWidth < 600 ? 4 : 8;
    setVisibleCount(prev => prev + increment);
  };

  const handleSearch = () => {
    //const filtered = products.filter(product =>
    //  product.title.toLowerCase().includes(searchTerm.toLowerCase())
    //);
    //setFilteredProducts(filtered);
  };

  return (
    <Routes>
      {/* ANASAYFA */}
      <Route
        path="/"
        element={
          <Box>
            <Sidebar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleSearch={handleSearch}
              showSearch={true}
            />

            <Box sx={{ mt: 0 }}>
              {/* Kampanyalı Slider */}
              <FeaturedSlider items={featuredItems} />

              <Box sx={{
                p: 1, paddingLeft: { xs: 0, sm: '50px' }, // xs ve sm arası cihazlarda padding sol sıfır, sm ve sonrasında 50px
                paddingRight: { xs: 0, sm: '50px' }, textAlign: 'center', backgroundColor: '#EDE8E8'
              }}>
                <Typography component="div" gutterBottom sx={{ fontSize: '35px', fontFamily: 'Playfair Display', fontWeight: 'bold', marginBottom: '40px', marginTop: '40px' }}>
                  Sizin İçin Önerdiklerimiz
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'end', mb: 3, marginRight: '10px', marginTop: '30px' }}>

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
                </Typography>

                <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
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
              <Catalog catalogs={catalog} />
              <Box sx={{ textAlign: "center" }}>
                <WhatsAppButton phoneNumber="905071188010" bottom="20" />
              </Box>
              <Footer />
            </Box>
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
                    {productNames.map(name => (
                      <MenuItem key={name} value={name}>
                        {name.charAt(0).toUpperCase() + name.slice(1)}
                      </MenuItem>
                    ))}
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
        }
      />


      {/* Ürün Detay Sayfası */}
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/iletisim" element={<ContactPage />} />
      <Route path="/kategori/:category" element={<CategoryPage />} />
      <Route path="/kategori/:category/:subCategory" element={<CategoryPage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* ADMIN PANEL (KORUNMUŞ) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireUid={MY_UID}>
            <AdminPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
