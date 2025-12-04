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
    Paper
} from "@mui/material";
import { supabase } from "../supabase";

export default function AdminGramPage() {
    const [dataList, setDataList] = useState([]);
    const [loading, setLoading] = useState(true);

    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [currentRow, setCurrentRow] = useState(null);

    const [ayar, setAyar] = useState("");
    const [gramFiyat, setGramFiyat] = useState("");

    useEffect(() => {
        fetchGramData();
    }, []);

    const fetchGramData = async () => {
        setLoading(true);

        const { data, error } = await supabase
            .from("ayar_fiyatlari")
            .select("*")

        if (!error) setDataList(data);

        setLoading(false);
    };

    const handleOpenEdit = (row) => {
        setCurrentRow(row);
        setAyar(row.ayar);
        setGramFiyat(row.gram_fiyat);
        setOpenEditDialog(true);
    };

    const handleCloseEdit = () => {
        setOpenEditDialog(false);
        setCurrentRow(null);
        setAyar("");
        setGramFiyat("");
    };
    const handleUpdate = async () => {
        const { error } = await supabase
            .from("ayar_fiyatlari")
            .update({ gram_fiyat: Number(gramFiyat) })
            .eq("ayar", currentRow.ayar);

        if (!error) {
            setDataList(
                dataList.map((item) =>
                    item.ayar === currentRow.ayar
                        ? { ...item, gram_fiyat: gramFiyat }
                        : item
                )
            );
            handleCloseEdit();
        }
    };

    return (
        <div>
            <h1>Gram Fiyat Ayarları</h1>

            {loading ? (
                <p>Yükleniyor...</p>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Ayar</TableCell>
                                <TableCell>Gram Fiyat</TableCell>
                                <TableCell>Güncelle</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {dataList.map((row) => (
                                <TableRow key={row.ayar}>
                                    <TableCell>{row.ayar}</TableCell>
                                    <TableCell>{row.gram_fiyat}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            onClick={() => handleOpenEdit(row)}
                                        >
                                            Güncelle
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* GÜNCELLEME DİALOGU */}
            <Dialog open={openEditDialog} onClose={handleCloseEdit}>
                <DialogTitle>Gram Fiyat Güncelle</DialogTitle>

                <DialogContent>
                    <TextField
                        InputProps={{
                            readOnly: true
                        }}
                        margin="dense"
                        label="Ayar"
                        fullWidth
                        value={ayar}
                        onChange={(e) => setAyar(e.target.value)}
                    />

                    <TextField
                        margin="dense"
                        label="Gram Fiyatı"
                        fullWidth
                        type="number"
                        value={gramFiyat}
                        onChange={(e) => setGramFiyat(e.target.value)}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseEdit} color="secondary">
                        İptal
                    </Button>
                    <Button onClick={handleUpdate} color="primary">
                        Güncelle
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
