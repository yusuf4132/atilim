import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Tooltip,
    Divider
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { supabase } from "../supabase";

export default function CategoryPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const [openAddSubDialog, setOpenAddSubDialog] = useState(false);
    const [openEditSubDialog, setOpenEditSubDialog] = useState(false);
    const [openDeleteSubDialog, setOpenDeleteSubDialog] = useState(false);

    const [currentCategory, setCurrentCategory] = useState(null);
    const [currentSubCategory, setCurrentSubCategory] = useState(null);
    const [categoryName, setCategoryName] = useState("");
    const [subCategoryName, setSubCategoryName] = useState("");

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        // Ana kategoriler ve alt kategorileri ayrı çekelim
        const { data: cats, error } = await supabase
            .from("categories")
            .select(`*, subcategories(*)`) // subcategories ilişkili
            .order("id", { ascending: true });

        if (error) console.log(error);
        else setCategories(cats);

        setLoading(false);
    };

    // 🔹 Ana kategori işlemleri
    const handleAddCategory = async () => {
        const { error } = await supabase.from("categories").insert([{ name: categoryName }]);
        if (error) console.log(error);
        else {
            setOpenAddDialog(false);
            setCategoryName("");
            fetchCategories();
        }
    };

    const handleEditCategory = async () => {
        const { error } = await supabase
            .from("categories")
            .update({ name: categoryName })
            .eq("id", currentCategory.id);
        if (error) console.log(error);
        else {
            setOpenEditDialog(false);
            setCurrentCategory(null);
            setCategoryName("");
            fetchCategories();
        }
    };

    const handleDeleteCategory = async () => {
        // Önce alt kategorileri sil
        const { error: subError } = await supabase
            .from("subcategories")
            .delete()
            .eq("category_id", currentCategory.id);
        if (subError) console.log(subError);

        // Sonra ana kategoriyi sil
        const { error } = await supabase.from("categories").delete().eq("id", currentCategory.id);
        if (error) console.log(error);
        else {
            setOpenDeleteDialog(false);
            setCurrentCategory(null);
            fetchCategories();
        }
    };

    // 🔹 Alt kategori işlemleri
    const handleAddSubCategory = async () => {
        const { error } = await supabase
            .from("subcategories")
            .insert([{ name: subCategoryName, category_id: currentCategory.id }]);
        if (error) console.log(error);
        else {
            setOpenAddSubDialog(false);
            setSubCategoryName("");
            fetchCategories();
        }
    };

    const handleEditSubCategory = async () => {
        const { error } = await supabase
            .from("subcategories")
            .update({ name: subCategoryName })
            .eq("id", currentSubCategory.id);
        if (error) console.log(error);
        else {
            setOpenEditSubDialog(false);
            setCurrentSubCategory(null);
            setSubCategoryName("");
            fetchCategories();
        }
    };

    const handleDeleteSubCategory = async () => {
        const { error } = await supabase.from("subcategories").delete().eq("id", currentSubCategory.id);
        if (error) console.log(error);
        else {
            setOpenDeleteSubDialog(false);
            setCurrentSubCategory(null);
            fetchCategories();
        }
    };
    return (
        <Box>
            <h1>
                Kategori ve Alt Kategori Yönetimi
            </h1>

            <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ mb: 2 }}
                onClick={() => setOpenAddDialog(true)}
            >
                Ana Kategori Ekle
            </Button>

            <List>
                {loading ? (
                    <Typography>Yükleniyor...</Typography>
                ) : categories.length === 0 ? (
                    <Typography>Hiç kategori yok</Typography>
                ) : (
                    categories.map((cat) => (
                        <Box key={cat.id} sx={{ mb: 1 }}>
                            <Divider sx={{ my: 0.0, bgcolor: 'rgba(0,0,0,0.1)' }} />
                            {/* Ana Kategori */}
                            <ListItem
                                secondaryAction={
                                    <Box>
                                        <Tooltip title="Alt Kategori Ekle">
                                            <IconButton
                                                edge="end"
                                                onClick={() => {
                                                    setCurrentCategory(cat);
                                                    setOpenAddSubDialog(true);
                                                }}
                                            >
                                                <AddIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Düzenle">
                                            <IconButton
                                                edge="end"
                                                onClick={() => {
                                                    setCurrentCategory(cat);
                                                    setCategoryName(cat.name);
                                                    setOpenEditDialog(true);
                                                }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Sil">
                                            <IconButton
                                                edge="end"
                                                onClick={() => {
                                                    setCurrentCategory(cat);
                                                    setOpenDeleteDialog(true);
                                                }}
                                            >
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                }
                            >
                                <ListItemText
                                    primary={cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                                />
                            </ListItem>

                            {/* Alt Kategoriler Listesi */}
                            <List sx={{ pl: 7 }}>
                                {cat.subcategories.map((sub) => (
                                    <ListItem
                                        key={sub.id}
                                        secondaryAction={
                                            <Box>
                                                <Tooltip title="Düzenle">
                                                    <IconButton
                                                        edge="end"
                                                        onClick={() => {
                                                            setCurrentSubCategory(sub);
                                                            setSubCategoryName(sub.name);
                                                            setOpenEditSubDialog(true);
                                                        }}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Sil">
                                                    <IconButton
                                                        edge="end"
                                                        onClick={() => {
                                                            setCurrentSubCategory(sub);
                                                            setOpenDeleteSubDialog(true);
                                                        }}
                                                    >
                                                        <DeleteIcon color="error" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        }
                                    >
                                        <ListItemText primary={sub.name.charAt(0).toUpperCase() + sub.name.slice(1)} />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    ))
                )}
            </List>

            {/* 🔹 Dialoglar */}

            {/* Ana Kategori Ekle */}
            <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
                <DialogTitle>Ana Kategori Ekle</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        label="Kategori Adı"
                        fullWidth
                        variant="standard"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddDialog(false)}>İptal</Button>
                    <Button onClick={handleAddCategory} variant="contained">
                        Ekle
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Ana Kategori Düzenle */}
            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                <DialogTitle>Ana Kategori Güncelle</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        label="Kategori Adı"
                        fullWidth
                        variant="standard"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)}>İptal</Button>
                    <Button onClick={handleEditCategory} variant="contained">
                        Kaydet
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Ana Kategori Sil */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Onayla</DialogTitle>
                <DialogContent>
                    <Typography>
                        "{currentCategory?.name}" kategorisini silmek istediğinize emin misiniz? Bu işlem
                        alt kategorileri de silecektir.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Hayır</Button>
                    <Button onClick={handleDeleteCategory} variant="contained" color="error">
                        Evet
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Alt Kategori Ekle */}
            <Dialog open={openAddSubDialog} onClose={() => setOpenAddSubDialog(false)}>
                <DialogTitle>Alt Kategori Ekle</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        label={`"${currentCategory?.name}" alt kategorisi`}
                        fullWidth
                        variant="standard"
                        value={subCategoryName}
                        onChange={(e) => setSubCategoryName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddSubDialog(false)}>İptal</Button>
                    <Button onClick={handleAddSubCategory} variant="contained">
                        Ekle
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Alt Kategori Düzenle */}
            <Dialog open={openEditSubDialog} onClose={() => setOpenEditSubDialog(false)}>
                <DialogTitle>Alt Kategori Güncelle</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        label="Alt Kategori Adı"
                        fullWidth
                        variant="standard"
                        value={subCategoryName}
                        onChange={(e) => setSubCategoryName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditSubDialog(false)}>İptal</Button>
                    <Button onClick={handleEditSubCategory} variant="contained">
                        Kaydet
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Alt Kategori Sil */}
            <Dialog open={openDeleteSubDialog} onClose={() => setOpenDeleteSubDialog(false)}>
                <DialogTitle>Onayla</DialogTitle>
                <DialogContent>
                    <Typography>
                        "{currentSubCategory?.name}" alt kategorisini silmek istediğinize emin misiniz?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteSubDialog(false)}>Hayır</Button>
                    <Button onClick={handleDeleteSubCategory} variant="contained" color="error">
                        Evet
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
