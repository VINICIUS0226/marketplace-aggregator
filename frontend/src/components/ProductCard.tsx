import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Chip,
  Checkbox,
  Stack,
} from "@mui/material";

import { Link } from "react-router-dom";
import { useCompare } from "../contexts/CompareContext";

interface Props {
  product: any;
}

export function ProductCard({ product }: Props) {
  const { addProduct, removeProduct, selectedProducts } = useCompare();

  const checked = selectedProducts.some((p) => p.id === product.id);

  return (
    <Card>
      <CardMedia component="img" height="220" image={product.thumbnail} />

      <CardContent>
        <Typography variant="h6" gutterBottom>
          {product.title}
        </Typography>

        <Chip label={product.category} size="small" />

        <Typography sx={{ mt: 2 }}>R$ {product.price}</Typography>

        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
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
          >
            Ver Detalhes
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
