import {
  Container,
  Typography,
  Box,
} from "@mui/material";

export function NotFound() {
  return (
    <Container sx={{ mt: 8, textAlign: 'center' }}>
      <Typography variant="h1" component="div" sx={{ fontWeight: 700, mb: 2 }}>
        404
      </Typography>
      <Typography variant="h5" color="text.secondary">
        Página não encontrada
      </Typography>
      <Box sx={{ mt: 3 }}>
        <Typography color="text.secondary">
          Verifique a URL ou volte para a página inicial.
        </Typography>
      </Box>
    </Container>
  );
}
