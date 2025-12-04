import React, { useState, useEffect } from "react";
import {
    Dialog, DialogActions, DialogContent, DialogTitle,
    TextField, Button, CircularProgress, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Paper,
    IconButton,
} from "@mui/material";

import InfoIcon from "@mui/icons-material/Info";
import { supabase } from "../supabase";

export default function AdminProductsPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const [openDialog, setOpenDialog] = useState(false);
    const [openInfoDialog, setOpenInfoDialog] = useState(false);

    const [editMode, setEditMode] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const descriptions = {
        title: "Ürünün Sayfada Gözükecek Başlığı(zorunlu)",
        main_category: "Ürünün Ana kategorisi (örn: altın, gümüş)(zorunlu)",
        sub_category: "ürünün Alt kategorisi (örn: çocuk)(isteğe bağlı boş olabilir)",
        product_code: "Ürünün Sayısal Olarak Kodu (zorunlu)",
        pop_index: "Eğer Ürün Ana Sayfada Gözükecekse Kaçıncı Sırada Gözüksün(isteğe bağlı ana sayfada gözükmeyecekse boş kalabilir)",
        cat_index: "Ürünün Kendi Kategorisi içindeki sıralaması (zorunlu)",
        detail: "Ürün detay bilgisi En Altta Yazacak",
        discount: "Eğer Ürüne İndirim Olacaksa Girin Olmayacaksa Boş Kalsın (0.15 girin yüzde 15 indirim için)",
        product: "Ürün tipi (örn: kolye, yüzük) Bu Filtrelemede Kullanılacak",
        ayar: "Altın ayarı (örn: 14k, 22k) (boş kalabilir ürün altın değilse)",
        gram: "Ürünün gram bilgisi (ürün altın değilse boş kalabilir)",
        price: "Satış fiyatı (Eğer gram ve ayarı olan altın gibi bir ürünse fiyat kendi hesaplanır kendiniz fiyat girerseniz fiyat hesaplanmaz",
        description: "Eğer ürünün Ayar veya Gram bilgisi yoksa bilgi amaçlı burası doldurulur",
    };

    const [form, setForm] = useState({
        title: "",
        main_category: "",
        sub_category: "",
        product_code: "",
        pop_index: "",
        cat_index: "",
        detail: "",
        discount: "",
        product: "",
        ayar: "",
        gram: "",
        price: "",
        description: "",
    });

    const [images, setImages] = useState([]);
    const [coverIndex, setCoverIndex] = useState(0);
    const [loadingImages, setLoadingImages] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        const { data } = await supabase.from("products").select("*").order("id", { ascending: false });
        setItems(data);
        setLoading(false);
    };

    const handleOpenDialog = (item = null) => {
        setEditMode(!!item);
        setCurrentItem(item);

        if (item) {
            setForm({
                title: item.title || "",
                main_category: item.main_category || "",
                sub_category: item.sub_category || "",
                product_code: item.product_code || "",
                pop_index: item.pop_index || "",
                cat_index: item.cat_index || "",
                detail: item.detail || "",
                discount: item.discount || "",
                product: item.product || "",
                ayar: item.ayar || "",
                gram: item.gram || "",
                price: item.price || "",
                description: item.description || "",
            });
        } else {
            // sıfırdan form
            setForm({
                title: "",
                main_category: "",
                sub_category: "",
                product_code: "",
                pop_index: "",
                cat_index: "",
                detail: "",
                discount: "",
                product: "",
                ayar: "",
                gram: "",
                price: "",
                description: "",
            });
        }

        setImages([]);
        setOpenDialog(true);
    };

    const handleOpenInfoDialog = (item) => {
        setCurrentItem(item);
        setOpenInfoDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setImages([]);
    };

    const handleCloseInfo = () => {
        setOpenInfoDialog(false);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
        setCoverIndex(0);
    };

    const uploadImages = async () => {
        if (images.length === 0) return [];

        let urls = [];

        for (let img of images) {
            const filePath = `${img.name}`;
            const { data, error } = await supabase.storage.from("product").upload(filePath, img);

            if (!error) {
                const publicUrl = supabase.storage.from("product").getPublicUrl(filePath).data.publicUrl;
                urls.push(publicUrl);
            }
        }

        return urls;
    };

    const toNumberOrNull = (value) => {
        if (value === null || value === undefined) return null;
        if (value === "") return null;
        if (isNaN(Number(value))) return null;
        return Number(value);
    };
    const handleSave = async () => {
        setLoadingImages(true);

        let imageUrls = [];

        if (!editMode) {
            imageUrls = await uploadImages();
        } else {
            imageUrls = Array.isArray(currentItem.image) ? currentItem.image : [];
        }

        const payload = {
            title: form.title,
            main_category: form.main_category,
            sub_category: form.sub_category,
            product_code: form.product_code,
            pop_index: toNumberOrNull(form.pop_index),
            cat_index: toNumberOrNull(form.cat_index),
            detail: form.detail,
            discount: toNumberOrNull(form.discount),
            product: form.product,
            ayar: toNumberOrNull(form.ayar),
            gram: toNumberOrNull(form.gram),
            price: toNumberOrNull(form.price),
            description: form.description,
            image: imageUrls
        };
        console.log("PAYLOAD:", payload);

        if (editMode) {
            const { error } = await supabase
                .from("products")
                .update(payload)
                .eq("id", currentItem.id);

            if (error) console.error(error);
        } else {
            const { error } = await supabase
                .from("products")
                .insert([payload]);

            if (error) console.error(error);
        }

        setLoadingImages(false);
        handleCloseDialog();
        fetchProducts();
    };

    const handleDelete = async (id) => {
        await supabase.from("products").delete().eq("id", id);
        fetchProducts();
    };

    return (
        <div style={{ padding: 20}}>
            <h2>Ürün Yönetimi</h2>

            <Button variant="contained" onClick={() => handleOpenDialog()}>
                Yeni Ürün Ekle
            </Button>

            {loading ? (
                <CircularProgress />
            ) : (
                <TableContainer component={Paper} style={{ marginTop: 20 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Image</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Ana Kategori</TableCell>
                                <TableCell>Alt Kategori</TableCell>
                                <TableCell>İşlem</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {items.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.id}</TableCell>

                                    {/* İlk resmin küçük hali */}
                                    <TableCell>
                                        {row.image && row.image.length > 0 ? (
                                            <img
                                                src={row.image[0]}
                                                alt="thumb"
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: 4,
                                                    objectFit: "cover",
                                                }}
                                            />
                                        ) : (
                                            "--"
                                        )}
                                    </TableCell>

                                    <TableCell>{row.title || "--"}</TableCell>
                                    <TableCell>{row.price || "--"}</TableCell>
                                    <TableCell>{row.main_category || "--"}</TableCell>
                                    <TableCell>{row.sub_category || "--"}</TableCell>

                                    <TableCell>
                                        {/* INFO ICON */}
                                        <IconButton onClick={() => handleOpenInfoDialog(row)} color="primary">
                                            <InfoIcon />
                                        </IconButton>

                                        <Button
                                            variant="outlined"
                                            onClick={() => handleOpenDialog(row)}
                                            style={{ marginRight: 10 }}
                                        >
                                            Düzenle
                                        </Button>

                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => handleDelete(row.id)}
                                        >
                                            Sil
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* INFO DIALOG */}
            <Dialog open={openInfoDialog} onClose={handleCloseInfo} maxWidth="md" fullWidth>
                <DialogTitle>Ürün Bilgileri</DialogTitle>

                <DialogContent>
                    {currentItem && (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableBody>
                                    {Object.entries(currentItem).map(([key, value]) => {
                                        if (key === "image") return null;

                                        return (
                                            <TableRow key={key}>
                                                <TableCell style={{ width: 200 }}>
                                                    <div style={{ fontWeight: "bold" }}>
                                                        {key.toUpperCase()}
                                                    </div>

                                                    <div style={{ fontSize: 12, color: "#777", marginTop: 4 }}>
                                                        {descriptions[key]}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {value || "--"}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}

                                    {/* IMAGE ROW */}
                                    <TableRow>
                                        <TableCell style={{ fontWeight: "bold" }}>
                                            IMAGES
                                        </TableCell>

                                        <TableCell>
                                            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                                                {currentItem.image?.map((img, i) => (
                                                    <img
                                                        key={i}
                                                        src={img}
                                                        alt="img"
                                                        style={{
                                                            width: 70,
                                                            height: 70,
                                                            objectFit: "cover",
                                                            borderRadius: 6,
                                                            border: "1px solid #ddd"
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseInfo}>Kapat</Button>
                </DialogActions>
            </Dialog>

            {/* ADD/EDIT DIALOG */}
            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
                <DialogTitle>{editMode ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}</DialogTitle>
                <DialogContent>

                    {Object.keys(form).map((key) => (
                        <TextField
                            key={key}
                            name={key}
                            label={key.toUpperCase()}
                            fullWidth
                            margin="dense"
                            value={form[key]}
                            onChange={handleChange}
                            helperText={descriptions[key]}
                        />
                    ))}

                    {!editMode && (
                        <div style={{ marginTop: 20 }}>
                            <input
                                accept="image/*"
                                id="upload-images"
                                multiple
                                hidden
                                type="file"
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                            />

                            <label htmlFor="upload-images">
                                <Button
                                    variant="contained"
                                    component="span"
                                    color="primary"
                                    sx={{
                                        paddingY: 1.5,
                                        paddingX: 3,
                                        fontSize: "16px",
                                        fontWeight: 600,
                                        borderRadius: 2,
                                        textTransform: "none",
                                    }}
                                >
                                    Resim Seç
                                </Button>
                            </label>
                            

                            {images.length > 0 && (
                                <div style={{ marginTop: 10, color: "#666" }}>
                                    {images.length} adet resim seçildi (Kapak: {images[0].name})
                                </div>
                            )}
                        </div>
                    )}

                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseDialog}>Kapat</Button>
                    <Button variant="contained" onClick={handleSave}>
                        {loadingImages ? <CircularProgress size={24} /> : "Kaydet"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
