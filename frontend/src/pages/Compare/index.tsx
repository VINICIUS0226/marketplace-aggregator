import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";

import { useCompare }
from "../../contexts/CompareContext";

export function Compare() {

  const {
    selectedProducts
  } = useCompare();

  return (
    <Container sx={{ mt: 4 }}>

      <Typography
        variant="h4"
        gutterBottom
      >
        Comparação de Produtos
      </Typography>

      {selectedProducts.length < 2 ? (
        <Typography sx={{ mt: 2 }}>
          Selecione ao menos dois produtos para ver a comparação.
        </Typography>
      ) : (
        <Paper>

          <Table>

          <TableHead>
            <TableRow>
              <TableCell>
                Atributo
              </TableCell>

              {selectedProducts.map(
                product => (
                  <TableCell
                    key={product.id}
                  >
                    {product.title}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>

          <TableBody>

            <TableRow>
              <TableCell>
                Preço
              </TableCell>

              {selectedProducts.map(
                product => (
                  <TableCell
                    key={product.id}
                  >
                    R$ {product.price}
                  </TableCell>
                )
              )}
            </TableRow>

            <TableRow>
              <TableCell>
                Categoria
              </TableCell>

              {selectedProducts.map(
                product => (
                  <TableCell
                    key={product.id}
                  >
                    {product.category}
                  </TableCell>
                )
              )}
            </TableRow>

            <TableRow>
              <TableCell>
                Rating
              </TableCell>

              {selectedProducts.map(
                product => (
                  <TableCell
                    key={product.id}
                  >
                    {product.rating}
                  </TableCell>
                )
              )}
            </TableRow>

            <TableRow>
              <TableCell>
                Estoque
              </TableCell>

              {selectedProducts.map(
                product => (
                  <TableCell
                    key={product.id}
                  >
                    {product.stock}
                  </TableCell>
                )
              )}
            </TableRow>

          </TableBody>

        </Table>

      </Paper>
      )}

    </Container>
  );
}