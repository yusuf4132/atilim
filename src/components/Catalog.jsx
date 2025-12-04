import { Box, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Catalog = ({ catalogs }) => {
    const navigate = useNavigate();
    const sortedCatalogs = catalogs.sort((a, b) => a.index - b.index);
    return (
        <Box sx={{ p: 2, textAlign: "center",  paddingLeft: { xs: 4, sm: '95px' }, // xs ve sm arası cihazlarda padding sol sıfır, sm ve sonrasında 50px
        paddingRight: { xs: 4, sm: '90px' }, }}>
            <Typography variant="h5" gutterBottom sx={{ fontSize: '35px' ,fontFamily: 'Playfair Display',fontWeight:'500'}}>
                Kataloglar
            </Typography>

            <Grid container spacing={2} justifyContent="center">
                {sortedCatalogs.map((item) => (
                    <Grid
                        item
                        xs={6}
                        sm={4}
                        md={3}
                        key={item.id}
                        onClick={() => navigate(`/kategori/${item.navigate}`)}
                        style={{ cursor: "pointer" }}
                    >
                        <Box
                            component="img"
                            src={item.image}
                            alt={item.title}
                            sx={{
                                width: "100%",
                                borderRadius: 2,
                                transition: "0.3s",
                                "&:hover": { transform: "scale(1.05)" }
                            }}
                        />
                        <Typography variant="subtitle1" sx={{ mt: 1 }}>
                        </Typography>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Catalog;
