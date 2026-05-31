import {
  Container,
  Typography,
  Grid,
  TextField,
  CircularProgress,
  Pagination,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Paper,
  Button,
  Chip,
} from "@mui/material";

import ClearAllIcon from '@mui/icons-material/ClearAll';
import { useState } from "react";

import { useProducts } from "../../hooks/useProducts";

import { ProductCard } from "../../components/ProductCard";
import { useCategories } from "../../hooks/useCategories";

export function Products() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useProducts({
    page,
    search,
    category,
    minPrice: minPrice === "" ? undefined : minPrice,
    maxPrice: maxPrice === "" ? undefined : maxPrice,
  });

  const { data: categories } = useCategories();

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Marketplace Aggregator
      </Typography>

      <Paper sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: 2, border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h6">Filtros</Typography>
            <Typography variant="body2" color="text.secondary">
              Refine sua busca por categoria e faixa de preço.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            startIcon={<ClearAllIcon />}
            onClick={clearFilters}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Limpar filtros
          </Button>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gap: 16,
            alignItems: 'end',
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1.7fr 1fr',
              md: '1.7fr 1fr 1fr 1fr',
            },
          }}
        >
          <TextField
            fullWidth
            label="Buscar produto"
            placeholder="Ex: smartphone, geladeira, tênis"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            size="small"
          />

          <FormControl fullWidth size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="category-label">Categoria</InputLabel>
            <Select
              labelId="category-label"
              value={category}
              label="Categoria"
              onChange={(e) => {
                setCategory(e.target.value as string);
                setPage(1);
              }}
            >
              <MenuItem value="">Todas</MenuItem>
              {categories?.map((categoryItem: string) => (
                <MenuItem key={categoryItem} value={categoryItem}>
                  {categoryItem}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            type="number"
            label="Preço mínimo"
            placeholder="R$ 0"
            value={minPrice}
            onChange={(e) => {
              const value = e.target.value;
              setMinPrice(value === "" ? "" : Number(value));
              setPage(1);
            }}
            size="small"
          />

          <TextField
            fullWidth
            type="number"
            label="Preço máximo"
            placeholder="R$ 0"
            value={maxPrice}
            onChange={(e) => {
              const value = e.target.value;
              setMaxPrice(value === "" ? "" : Number(value));
              setPage(1);
            }}
            size="small"
          />
        </Box>

        <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
          {search && <Chip label={`Busca: ${search}`} onDelete={() => setSearch('')} />}
          {category && <Chip label={`Categoria: ${category}`} onDelete={() => setCategory('')} />}
          {minPrice !== '' && <Chip label={`Mínimo: R$${minPrice}`} onDelete={() => setMinPrice('')} />}
          {maxPrice !== '' && <Chip label={`Máximo: R$${maxPrice}`} onDelete={() => setMaxPrice('')} />}
        </Box>
      </Paper>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      <Grid container spacing={3}>
        {data?.data?.map((product: any) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product.id}>
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
