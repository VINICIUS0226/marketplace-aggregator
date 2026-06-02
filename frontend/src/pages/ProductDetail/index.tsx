import {
  Container,
  Typography,
  Grid,
  Paper,
  CardMedia,
  Chip,
  Stack,
  Button,
  Box,
  Rating,
  Skeleton,
  Dialog,
  IconButton,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

import { useProduct } from "../../hooks/useProduct";
import { useCompare } from "../../contexts/compareStore";
import { formatCurrency } from "../../utils/currency";
import { formatDate } from "../../utils/date";

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useProduct(id!);
  const { selectedProducts, addProduct, removeProduct } = useCompare();
  const [openImage, setOpenImage] = useState(false);

  if (isLoading) {
    return (
      <Container sx={{ mt: 4 }}>
        <Skeleton variant="rectangular" height={420} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="text" width="80%" />
      </Container>
    );
  }

  if (error || !data) {
    return (
      <Container sx={{ mt: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          variant="text"
          sx={{ mb: 2 }}
        >
          Voltar
        </Button>
        <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography color="error">
            Erro ao carregar o produto. Tente novamente.
          </Typography>
        </Paper>
      </Container>
    );
  }

  const productIsSelected = selectedProducts.some(
    (product) => product.id === data.id,
  );

  return (
    <Container sx={{ mt: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        variant="text"
        sx={{ mb: 2 }}
      >
        Voltar
      </Button>

      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ borderRadius: 2, overflow: "hidden" }}>
              <CardMedia
                component="img"
                image={data.thumbnail}
                alt={data.title}
                sx={{ width: "100%", height: 420, objectFit: "cover", cursor: "pointer" }}
                onClick={() => setOpenImage(true)}
              />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              {data.title}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mb: 2, alignItems: "center" }}>
              <Chip label={data.category} />
              <Rating value={data.rating} readOnly precision={0.1} />
              <Chip label={`Estoque: ${data.stock}`} color={data.stock > 0 ? "success" : "default"} sx={{ ml: "auto" }} />
            </Stack>

            <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
              {formatCurrency(data.price)}
            </Typography>

            <Typography sx={{ mb: 3, color: "text.secondary" }}>
              {data.description}
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button variant="contained" size="large" disabled>
                Compra indisponível
              </Button>
              <Button
                variant={productIsSelected ? "contained" : "outlined"}
                size="large"
                onClick={() => {
                  // O detalhe permite entrar ou sair da comparação sem voltar à lista.
                  if (productIsSelected) {
                    removeProduct(data.id);
                  } else {
                    addProduct(data);
                  }
                }}
              >
                {productIsSelected ? "Remover da Comparação" : "Adicionar à Comparação"}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {data.priceHistory && data.priceHistory.length > 0 && (
        <Paper sx={{ p: 3, mt: 3, borderRadius: 2, boxShadow: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
            Histórico de preços
          </Typography>

          {/* A lista compacta evidencia variação temporal sem introduzir uma biblioteca de gráficos. */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            {data.priceHistory.map((item) => (
              <Box
                key={item.date}
                sx={{
                  flex: 1,
                  p: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {formatDate(item.date)}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                  {formatCurrency(item.price)}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Paper>
      )}

      <Dialog open={openImage} onClose={() => setOpenImage(false)} maxWidth="lg">
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, pt: 1 }}>
          <Typography variant="h6">{data.title}</Typography>
          <IconButton onClick={() => setOpenImage(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ p: 2 }}>
          <img src={data.thumbnail} alt={data.title} style={{ width: "100%", height: "auto", borderRadius: 8 }} />
        </Box>
      </Dialog>
    </Container>
  );
}
