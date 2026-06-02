import {
  Container,
  Typography,
  Grid,
  TextField,
  Skeleton,
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

import ClearAllIcon from "@mui/icons-material/ClearAll";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import { useState } from "react";

import { useProducts } from "../../hooks/useProducts";
import { ProductCard } from "../../components/ProductCard";
import { useCategories } from "../../hooks/useCategories";
import type { Product } from "../../types/Product";

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
  const hasActiveFilters =
    Boolean(search) ||
    Boolean(category) ||
    minPrice !== "" ||
    maxPrice !== "";

  /**
   * Ao limpar filtros, a paginação volta para o início para evitar consultar
   * páginas inexistentes depois de uma mudança de critério.
   */
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

      <Paper sx={{ p: { xs: 2, md: 2.5 }, mb: 4, borderRadius: 2, boxShadow: 1, border: "1px solid", borderColor: "divider" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <FilterAltOutlinedIcon color="primary" fontSize="small" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Filtros
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gap: 1.5,
            alignItems: "center",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "minmax(0, 1.5fr) minmax(180px, 1fr)",
              md: "minmax(260px, 1.7fr) minmax(180px, 1fr) minmax(130px, .7fr) minmax(130px, .7fr)",
            },
          }}
        >
          <TextField
            fullWidth
            label="Buscar produto"
            placeholder="Ex: smartphone, geladeira, tênis"
            value={search}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              },
            }}
            onChange={(event) => {
              setSearch(event.target.value);
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
              onChange={(event) => {
                setCategory(event.target.value as string);
                setPage(1);
              }}
            >
              <MenuItem value="">Todas</MenuItem>
              {categories?.map((categoryItem) => (
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
            onChange={(event) => {
              const value = event.target.value;
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
            onChange={(event) => {
              const value = event.target.value;
              setMaxPrice(value === "" ? "" : Number(value));
              setPage(1);
            }}
            size="small"
          />
        </Box>

        {hasActiveFilters && (
          <Box
            sx={{
              mt: 2,
              pt: 2,
              borderTop: "1px solid",
              borderColor: "divider",
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              alignItems: "center",
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
              Ativos:
            </Typography>
            {search && <Chip size="medium" label={`Busca: ${search}`} onDelete={() => setSearch("")} />}
            {category && <Chip size="small" label={`Categoria: ${category}`} onDelete={() => setCategory("")} />}
            {minPrice !== "" && <Chip size="small" label={`Mínimo: R$ ${minPrice}`} onDelete={() => setMinPrice("")} />}
            {maxPrice !== "" && <Chip size="small" label={`Máximo: R$ ${maxPrice}`} onDelete={() => setMaxPrice("")} />}

            <Button
              size="small"
              startIcon={<ClearAllIcon />}
              onClick={clearFilters}
              sx={{ ml: { sm: "auto" }, whiteSpace: "nowrap" }}
            >
              Limpar
            </Button>
          </Box>
        )}
      </Paper>

      {isLoading ? (
        <Grid container spacing={3}>
          {[...Array(8)].map((_, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 2 }}>
                <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2 }} />
                <Skeleton sx={{ mt: 2 }} width="80%" />
                <Skeleton sx={{ mt: 1 }} width="60%" />
                <Skeleton sx={{ mt: 2 }} width="40%" />
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : data?.data.length === 0 ? (
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            Nenhum produto encontrado.
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {data?.data?.map((product: Product) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 4,
            }}
          >
            <Pagination
              page={page}
              count={data?.totalPages || 1}
              onChange={(_, value) => setPage(value)}
            />
          </Box>
        </>
      )}
    </Container>
  );
}
