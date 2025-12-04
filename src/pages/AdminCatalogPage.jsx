import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogActions, DialogContent, DialogTitle,
    TextField, Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import { supabase } from '../supabase'; // Supabase client'ı import edin

export default function AdminCatalogPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [title, setTitle] = useState('');
    const [navigate, setNavigate] = useState('');
    const [image, setImage] = useState(null);
    const [loadingImage, setLoadingImage] = useState(false);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('catalog_items')
            .select('*')
            .order('index', { ascending: true });

        if (error) console.error('Error fetching items:', error);
        else setItems(data);

        setLoading(false);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    const handleOpenDialog = (item = null) => {
        setEditMode(!!item);
        setCurrentItem(item);
        if (item) {
            setTitle(item.title);
            setNavigate(item.navigate);
        } else {
            setTitle('');
            setNavigate('');
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setImage(null);
        setTitle('');
        setNavigate('');
    };

    const handleAddOrUpdate = async () => {
        setLoadingImage(true);

        // Fotoğrafı yükleyip URL'yi alalım
        let imageUrl = '';
        let imageUrl2='';
        if (image) {
            const { data, error: uploadError } = await supabase
                .storage
                .from('catalog')
                .upload(`${image.name}`, image);

            if (uploadError) {
                console.error('Error uploading image:', uploadError);
                setLoadingImage(false);
                return;
            }

            imageUrl = supabase
                .storage
                .from('catalog')
                .getPublicUrl(data.path);
            imageUrl2 = imageUrl.data.publicUrl
        }
        

        // Eğer düzenleme yapılıyorsa, item güncellenecek
        if (editMode && currentItem) {
            const { error } = await supabase
                .from('catalog_items')
                .update({
                    title,
                    navigate,
                    image: currentItem.image // Resim değiştirilmeden eski resim bırakılır
                })
                .eq('id', currentItem.id);

            if (error) {
                console.error('Error updating item:', error);
            } else {
                fetchItems();
                handleCloseDialog();
            }
        } else {
            // Eğer yeni ekleme yapılıyorsa
            const { data: lastItem } = await supabase
                .from('catalog_items')
                .select('index')
                .order('index', { ascending: false })
                .limit(1);

            const newIndex = lastItem.length > 0 ? lastItem[0].index + 1 : 1;

            const { error } = await supabase
                .from('catalog_items')
                .insert([{
                    title,
                    navigate,
                    image: imageUrl2,
                    index: items.length+1
                }]);

            if (error) {
                console.error('Error adding new item:', error);
            } else {
                fetchItems();
                handleCloseDialog();
            }
        }

        setLoadingImage(false);
    };

    const handleDelete = async (id) => {
        const { error } = await supabase
            .from('catalog_items')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting item:', error);
        } else {
            fetchItems();
        }
    };

    const handleMoveUp = async (id, index) => {
        if (index <= 1) return; // İlk index'e gelirse yukarı hareket etmesine izin verilmez.

        const currentItem = items.find(item => item.id === id);
        const itemAbove = items.find(item => item.index === index - 1);

        if (currentItem && itemAbove) {
            // 1. item'ı 1 azalt, itemAbove'u 1 artır.
            const { error: currentItemError } = await supabase
                .from('catalog_items')
                .update({ index: index - 1 })
                .eq('id', currentItem.id);

            if (!currentItemError) {
                const { error: itemAboveError } = await supabase
                    .from('catalog_items')
                    .update({ index: index })
                    .eq('id', itemAbove.id);

                if (!itemAboveError) {
                    fetchItems();
                } else {
                    console.error("Error updating itemAbove", itemAboveError);
                }
            } else {
                console.error("Error updating currentItem", currentItemError);
            }
        }
    };

    const handleMoveDown = async (id, index) => {
        const currentItem = items.find(item => item.id === id);
        const itemBelow = items.find(item => item.index === index + 1);

        if (currentItem && itemBelow) {
            // 1. item'ı 1 artır, itemBelow'u 1 azalt.
            const { error: currentItemError } = await supabase
                .from('catalog_items')
                .update({ index: index + 1 })
                .eq('id', currentItem.id);

            if (!currentItemError) {
                const { error: itemBelowError } = await supabase
                    .from('catalog_items')
                    .update({ index: index })
                    .eq('id', itemBelow.id);

                if (!itemBelowError) {
                    fetchItems();
                } else {
                    console.error("Error updating itemBelow", itemBelowError);
                }
            } else {
                console.error("Error updating currentItem", currentItemError);
            }
        }
    };

    return (
        <div>
             <h1>Katalog Yönetimi</h1>
            <Button variant="contained" onClick={() => handleOpenDialog()} color="primary" sx={{marginBottom:'25px'}}>Yeni Ekle</Button>

            {loading ? (
                <CircularProgress />
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Index</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Navigate</TableCell>
                                <TableCell>Image</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell>{item.index}</TableCell>
                                    <TableCell>{item.title}</TableCell>
                                    <TableCell>{item.navigate}</TableCell>
                                    <TableCell>
                                        <img src={item.image} alt={item.title} style={{ width: 50, height: 50 }} />
                                    </TableCell>
                                    <TableCell>
                                        <Button onClick={() => handleOpenDialog(item)}>Güncelle</Button>
                                        <Button onClick={() => handleDelete(item.id)} color="secondary">Sil</Button>
                                        <Button onClick={() => handleMoveUp(item.id, item.index)} disabled={item.index <= 1}>↑</Button>
                                        <Button onClick={() => handleMoveDown(item.id, item.index)} disabled={item.index >= items.length}>↓</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Ekleme / Güncelleme Dialogu */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{editMode ? 'Ürünü Güncelle' : 'Yeni Ürün Ekle'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Başlık"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Navigate URL"
                        fullWidth
                        value={navigate}
                        onChange={(e) => setNavigate(e.target.value)}
                    />
                    {!editMode && (
                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                                id="file-input"
                            />
                            <label htmlFor="file-input">
                                <Button variant="outlined" component="span" fullWidth>
                                    {image ? image.name : 'Resim Seç'}
                                </Button>
                            </label>
                        </div>
                    )}
                    {loadingImage && <CircularProgress />}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} sx={{color:'red'}}>İptal</Button>
                    <Button onClick={handleAddOrUpdate} color="primary">Ekle/Güncelle</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
