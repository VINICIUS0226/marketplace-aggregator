import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useNavigate } from "react-router-dom";
import { useCompare } from "../../contexts/compareStore";
import { formatCurrency } from "../../utils/currency";

export function Compare() {
  const { selectedProducts } = useCompare();
  const navigate = useNavigate();

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "center", justifyContent: "space-between", mb: 2, gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            variant="outlined"
          >
            Voltar
          </Button>

          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 0 }}>
            Comparação de Produtos
          </Typography>
        </Box>
      </Box>

      {selectedProducts.length < 2 ? (
        <Typography sx={{ mt: 2 }}>
          Selecione ao menos dois produtos para ver a comparação.
        </Typography>
      ) : (
        <Paper sx={{ p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
          {/* Tabela favorece leitura lado a lado, que é o objetivo central da comparação. */}
          <Table sx={{ borderCollapse: "separate", minWidth: 720 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, borderBottom: "2px solid", borderColor: "divider", width: 180 }}>
                  Atributo
                </TableCell>

                {selectedProducts.map((product) => (
                  <TableCell
                    key={product.id}
                    sx={{
                      fontWeight: 600,
                      borderBottom: "2px solid",
                      borderColor: "divider",
                      textAlign: "center",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      px: 1,
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {product.title}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow sx={{ bgcolor: "background.default" }}>
                <TableCell sx={{ fontWeight: 700, py: 2 }}>Imagem</TableCell>

                {selectedProducts.map((product) => (
                  <TableCell key={product.id} sx={{ textAlign: "center", py: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        style={{ width: 140, height: 140, objectFit: "cover", borderRadius: 10 }}
                      />
                    </Box>
                  </TableCell>
                ))}
              </TableRow>

              <TableRow>
                <TableCell sx={{ fontWeight: 700, py: 2 }}>Preço</TableCell>

                {selectedProducts.map((product) => (
                  <TableCell key={product.id} sx={{ textAlign: "center", py: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                      {formatCurrency(product.price)}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>

              <TableRow sx={{ bgcolor: "background.default" }}>
                <TableCell sx={{ fontWeight: 700, py: 2 }}>Categoria</TableCell>

                {selectedProducts.map((product) => (
                  <TableCell key={product.id} sx={{ textAlign: "center", py: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {product.category}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>

              <TableRow>
                <TableCell sx={{ fontWeight: 700, py: 2 }}>Rating</TableCell>

                {selectedProducts.map((product) => (
                  <TableCell key={product.id} sx={{ textAlign: "center", py: 2 }}>
                    {product.rating}
                  </TableCell>
                ))}
              </TableRow>

              <TableRow sx={{ bgcolor: "background.default" }}>
                <TableCell sx={{ fontWeight: 700, py: 2 }}>Estoque</TableCell>

                {selectedProducts.map((product) => (
                  <TableCell key={product.id} sx={{ textAlign: "center", py: 2 }}>
                    {product.stock}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
  );
}
