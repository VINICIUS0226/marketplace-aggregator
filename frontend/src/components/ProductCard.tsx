import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  CardActionArea,
  Typography,
  Button,
  Chip,
  Checkbox,
  Box,
} from "@mui/material";

import { Link } from "react-router-dom";
import { useCompare } from "../contexts/compareStore";
import type { Product } from "../types/Product";
import { formatCurrency } from "../utils/currency";

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const { addProduct, removeProduct, selectedProducts } = useCompare();

  const checked = selectedProducts.some((p) => p.id === product.id);

  /**
   * O card inteiro navega para detalhes, enquanto o checkbox mantém a ação de
   * comparação acessível diretamente na listagem.
   */
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: 3,
        transition: "transform 0.15s ease-in-out",
        "&:hover": { transform: "translateY(-6px)" },
      }}
    >
      <CardActionArea
        component={Link}
        to={`/products/${product.id}`}
        sx={{ display: "flex", flexDirection: "column", flexGrow: 1, alignItems: "stretch" }}
      >
        <CardMedia
          component="img"
          height="220"
          image={product.thumbnail}
          alt={product.title}
          sx={{ objectFit: "cover" }}
        />

        <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
              {product.title}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {product.description || ""}
            </Typography>
          </Box>

          <Box sx={{ mt: 2, display: "flex", gap: 1, alignItems: "center" }}>
            <Chip label={product.category} size="small" />
            <Typography variant="h6" color="primary" sx={{ ml: "auto", fontWeight: 700 }}>
              {formatCurrency(product.price)}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>

      <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
        <Box sx={{ width: "100%", display: "flex", alignItems: "center", gap: 1 }}>
          <Checkbox
            checked={checked}
            onChange={(event) => {
              if (event.target.checked) {
                addProduct(product);
              } else {
                removeProduct(product.id);
              }
            }}
          />

          <Button
            component={Link}
            to={`/products/${product.id}`}
            variant="contained"
            fullWidth
            size="small"
          >
            Ver Detalhes
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
}
