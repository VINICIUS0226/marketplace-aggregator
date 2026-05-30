import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Chip,
  Checkbox,
  Stack
} from "@mui/material";

import { Link } from "react-router-dom";

interface Props {
  product: any;
}

export function ProductCard({
  product
}: Props) {
  return (
    <Card>

      <CardMedia
        component="img"
        height="220"
        image={product.thumbnail}
      />

      <CardContent>

        <Typography
          variant="h6"
          gutterBottom
        >
          {product.title}
        </Typography>

        <Chip
          label={product.category}
          size="small"
        />

        <Typography
          sx={{ mt: 2 }}
        >
          R$ {product.price}
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          sx={{ mt: 2 }}
        >
          <Checkbox />

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