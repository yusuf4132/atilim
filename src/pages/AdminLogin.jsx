import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [snackbar, setSnackbar] = useState({
        open: false, message: '', severity: 'success'
    });
    const navigate = useNavigate();

    const handleLogin = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email, password,
        });

        if (error) {
            setSnackbar({ open: true, message: 'Giriş Başarısız!', severity: 'error' });
            return;
        }

        setSnackbar({ open: true, message: 'Giriş başarılı!', severity: 'success' });

        setTimeout(() => {
            navigate("/admin");
        }, 500);
    };
    useEffect(() => {
        const checkSession = async () => {
            const { data } = await supabase.auth.getSession();
            console.log("Aktif oturum:", data);
        };
        checkSession();
    }, []);

    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="80vh">

            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    width: 320,
                    textAlign: "center",
                    bgcolor: "#EDE8E8",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Admin Girişi
                </Typography>

                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <TextField
                    label="Parola"
                    type="password"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                    variant="contained"
                    onClick={handleLogin}
                    sx={{ mt: 2, backgroundColor: "white", color: "black" }}
                >
                    Giriş Yap
                </Button>

                {/* 🔽 Ana sayfaya dön butonu tam olarak burada, ortalı */}
                <Button
                    variant="contained"
                    onClick={() => navigate("/")}
                    sx={{
                        mt: 3,
                        backgroundColor: "white",
                        color: "black",
                        width: "100%",
                    }}
                >
                    Ana Sayfaya Dön
                </Button>
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity} variant="filled">
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );

}
