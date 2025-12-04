import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import {supabase} from '../supabase'; // Supabase bağlantısını buradan alıyorsunuz

const AdminKomisyonPage = () => {
  const [komisyonData, setKomisyonData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);

  const [three, setThree] = useState('');
  const [two, setTwo] = useState('');
  const [one, setOne] = useState('');
  const [bank, setBank] = useState('');

  useEffect(() => {
    fetchKomisyonData();
  }, []);

  const fetchKomisyonData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('komisyon') // Komisyon verisini aldığımız tablo
      .select('*') // Tüm kolonları alıyoruz
      .order('id', { ascending: true });

    if (error) {
      console.error(error);
    } else {
      setKomisyonData(data);
    }

    setLoading(false);
  };

  const handleOpenEditDialog = (row) => {
    setCurrentRow(row);
    setThree(row.three);
    setTwo(row.two);
    setOne(row.one);
    setBank(row.bank);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setCurrentRow(null);
    setThree('');
    setTwo('');
    setOne('');
    setBank('');
  };

  const handleUpdateKomisyon = async () => {
    if (currentRow) {
      const { error } = await supabase
        .from('komisyon')
        .update({ three, two, one, bank })
        .eq('id', currentRow.id);

      if (error) {
        console.error('Veri güncellenirken hata:', error);
      } else {
        // Güncellenen veriyi yansıtmak için yerel state'i güncelle
        setKomisyonData(komisyonData.map((row) =>
          row.id === currentRow.id ? { ...row, three, two, one, bank } : row
        ));
        handleCloseEditDialog();
      }
    }
  };

  return (
    <div>
      <h1>Komisyon Yönetimi</h1>
      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>3 Taksit</TableCell>
                <TableCell>2 Taksit</TableCell>
                <TableCell>Tek Çekim</TableCell>
                <TableCell>Banka</TableCell>
                <TableCell>Güncelle</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {komisyonData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.three}</TableCell>
                  <TableCell>{row.two}</TableCell>
                  <TableCell>{row.one}</TableCell>
                  <TableCell>{row.bank}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => handleOpenEditDialog(row)}>
                      Güncelle
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Güncelleme Dialogu */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Veri Güncelle {bank}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="3 Taksit"
            type="text"
            fullWidth
            value={three}
            onChange={(e) => setThree(e.target.value)}
          />
          <TextField
            margin="dense"
            label="2 Taksit"
            type="text"
            fullWidth
            value={two}
            onChange={(e) => setTwo(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Tek Çekim"
            type="text"
            fullWidth
            value={one}
            onChange={(e) => setOne(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} sx={{color:'red'}}>
            İptal
          </Button>
          <Button onClick={handleUpdateKomisyon} color="primary">
            Güncelle
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminKomisyonPage;