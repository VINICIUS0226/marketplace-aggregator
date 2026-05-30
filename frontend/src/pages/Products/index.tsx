import {
  Container,
  Typography,
  Grid,
  TextField,
  CircularProgress,
  Pagination,
  Box,
} from "@mui/material";

import { useState } from "react";

import { useProducts } from "../../hooks/useProducts";

import { ProductCard } from "../../components/ProductCard";

export function Products() {
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const { data, isLoading } = useProducts({
    page,
    search,
  });

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Marketplace Aggregator
      </Typography>

      <TextField
        fullWidth
        label="Buscar produto"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 4 }}
      />

      {isLoading && <CircularProgress />}

      <Grid container spacing={3}>
        {data?.data?.map((product: any) => (
          <Grid size={{ xs: 12, md: 4, lg: 3 }} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>

      {data && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 4,
          }}
        >
          <Pagination
            page={page}
            count={data.totalPages}
            onChange={(_, value) => setPage(value)}
          />
        </Box>
      )}
    </Container>
  );
}
