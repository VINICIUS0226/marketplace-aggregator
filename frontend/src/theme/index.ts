import { createTheme } from "@mui/material";

export const theme =
  createTheme({
    palette: {
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#f50057",
      },
    },
    typography: {
      fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif',
      h4: {
        fontWeight: 700,
        letterSpacing: '-0.5px',
      },
      h5: {
        fontWeight: 600,
      },
      body1: {
        fontSize: '1rem',
      },
    },
    shape: {
      borderRadius: 8,
    },
  });
