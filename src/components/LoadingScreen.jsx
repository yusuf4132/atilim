import { Backdrop, CircularProgress, Typography } from "@mui/material";

 const LoadingScreen = () => {
  return (
    <Backdrop
      open={true}
      sx={{
        color: "#fff",
        zIndex: theme => theme.zIndex.drawer + 1,
        flexDirection: "column",
        gap: 2
      }}
    >
      <CircularProgress color="inherit" size={60} />
      <Typography variant="h6">Yükleniyor...</Typography>
    </Backdrop>
  );
};
export default LoadingScreen;