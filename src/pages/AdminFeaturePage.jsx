import React, { useState, useEffect } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    CircularProgress
} from "@mui/material";
import { ArrowUpward, ArrowDownward, Delete } from "@mui/icons-material";
import { supabase } from "../supabase"; // Supabase bağlantısı

export default function AdminFeaturePage() {
    const [featureItems, setFeatureItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    const [title, setTitle] = useState("");
    const [sliderIndex, setSliderIndex] = useState("");
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [loadingImage, setLoadingImage] = useState(false);

    useEffect(() => {
        fetchFeaturedItems();
    }, []);
    const fetchFeaturedItems = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("featured_items")
            .select("*")
            .order("slider_index", { ascending: true });

        if (!error) setFeatureItems(data);

        setLoading(false);
    };

    const handleOpenEditDialog = (item) => {
        setCurrentItem(item);
        setTitle(item.title);
        setSliderIndex(item.slider_index);
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setCurrentItem(null);
        setTitle("");
        setSliderIndex("");
    };

    const handleUpdate = async () => {
        const { error } = await supabase
            .from("featured_items")
            .update({
                title,
                slider_index: sliderIndex
            })
            .eq("id", currentItem.id);

        if (!error) {
            setFeatureItems(
                featureItems.map((item) =>
                    item.id === currentItem.id ? { ...item, title, slider_index: sliderIndex } : item
                )
            );
            handleCloseEditDialog();
        }
    };

    const handleMoveUp = async (item) => {
        if (item.slider_index > 1) {
            // Üstündeki öğeyi bul
            const prevItem = featureItems.find((i) => i.slider_index === item.slider_index - 1);

            if (prevItem) {
                // Öncelikle her iki öğenin slider_index'lerini değiştiriyoruz
                await swapSliderIndexes(item, prevItem);
                fetchFeaturedItems();
            }
        }
    };

    const handleMoveDown = async (item) => {
        if (item.slider_index < featureItems.length) {
            // Altındaki öğeyi bul
            const nextItem = featureItems.find((i) => i.slider_index === item.slider_index + 1);

            if (nextItem) {
                // Öncelikle her iki öğenin slider_index'lerini değiştiriyoruz
                await swapSliderIndexes(item, nextItem);
                fetchFeaturedItems();
            }
        }
    };
    const swapSliderIndexes = async (item1, item2) => {
        // swap işlemi
        const { error } = await supabase
            .from("featured_items")
            .update({ slider_index: item1.slider_index })
            .eq("id", item2.id);

        if (error) {
            console.error("Hata:", error);
            return;
        }

        const { error: error2 } = await supabase
            .from("featured_items")
            .update({ slider_index: item2.slider_index })
            .eq("id", item1.id);

        if (error2) {
            console.error("Hata:", error2);
            return;
        }

        // Veritabanını güncelledikten sonra, yerel veriyi de güncelliyoruz
        setFeatureItems((prevItems) =>
            prevItems.map((item) => {
                if (item.id === item1.id) {
                    return { ...item, slider_index: item2.slider_index };
                }
                if (item.id === item2.id) {
                    return { ...item, slider_index: item1.slider_index };
                }
                return item;
            })
        );
        fetchFeaturedItems();
    };
    const handleDelete = async (id) => {
        const { error } = await supabase
            .from("featured_items")
            .delete()
            .eq("id", id);

        if (!error) {
            setFeatureItems(featureItems.filter((item) => item.id !== id));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    const handleAdd = async () => {
        // Resim yüklenecekse yükleme işlemini başlatıyoruz
        if (image) {
            setLoadingImage(true);

            // Resmi Supabase Storage'a yükle
            const { data, error } = await supabase
                .storage
                .from("featured")
                .upload(`${image.name}`, image);

            if (error) {
                console.error("Resim yükleme hatası:", error);
                setLoadingImage(false);
                return;
            }

            // Resim yüklendikten sonra public URL alalım
            setLoadingImage(false);
            const publicUrl = supabase
                .storage
                .from("featured")
                .getPublicUrl(data.path);
            const publicUrl2 = publicUrl.data.publicUrl
            // Veritabanına eklemeden önce, resim URL'ini ayarlıyoruz
            setImageUrl(publicUrl);


            // Featured Item'ı veritabanına kaydedelim
            const { error: insertError } = await supabase
                .from("featured_items")
                .insert([
                    {
                        title,
                        slider_index: featureItems.length + 1, // Slider index otomatik olarak verilecek
                        image_url: publicUrl2
                    }
                ]);

            if (!insertError) {
                // Veritabanı başarılıysa, sayfayı güncelle
                fetchFeaturedItems(); // Veritabanındaki güncel öğeleri çek
                handleCloseAddDialog(); // Dialogu kapat
            } else {
                console.error("Ekleme hatası:", insertError);
            }
        }
    };

    const handleCloseAddDialog = () => {
        setOpenAddDialog(false);
        setTitle("");
        setImage(null);
        setImageUrl("");
    };

    return (
        <div>
            <h1>Afiş Yönetimi</h1>
            <Button variant="contained" onClick={() => setOpenAddDialog(true)} sx={{ marginBottom: '30px' }}>Ekle</Button>

            {loading ? (
                <CircularProgress />
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Başlık</TableCell>
                                <TableCell>Resim</TableCell>
                                <TableCell>Slider Index</TableCell>
                                <TableCell>Aksiyonlar</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {featureItems.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell>{item.title}</TableCell>
                                    <TableCell>
                                        <img src={item.image_url} alt={item.title} style={{ width: 50 }} />
                                    </TableCell>
                                    <TableCell>{item.slider_index}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleMoveUp(item)}><ArrowUpward /></IconButton>
                                        <IconButton onClick={() => handleMoveDown(item)}><ArrowDownward /></IconButton>
                                        <Button variant="contained" color="primary" onClick={() => handleOpenEditDialog(item)}>Güncelle</Button>
                                        <IconButton onClick={() => handleDelete(item.id)}><Delete /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Güncelleme Dialogu */}
            <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
                <DialogTitle>Featured Item Güncelle</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Başlık"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditDialog} sx={{ color: 'red' }}>İptal</Button>
                    <Button onClick={handleUpdate} color="primary">Güncelle</Button>
                </DialogActions>
            </Dialog>

            {/* Ekleme Dialogu */}
            <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
                <DialogTitle>Featured Item Ekle</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Başlık"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <div>
                        {/* Buradaki input'u gizleyip sadece Material-UI butonunu göstereceğiz */}
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}  // input'u gizledik
                            onChange={handleFileChange}
                            id="file-input"
                        />
                        <label htmlFor="file-input">
                            {/* Material-UI Button ile dosya seçme */}
                            <Button variant="outlined" component="span" fullWidth>
                                {image ? image.name : "Resim Seç"}
                            </Button>
                        </label>
                        {/* Loading indicator */}
                        {loadingImage && <CircularProgress />}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddDialog} sx={{color:'red'}}>
                        İptal
                    </Button>
                    <Button onClick={handleAdd} color="primary">
                        Ekle
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
