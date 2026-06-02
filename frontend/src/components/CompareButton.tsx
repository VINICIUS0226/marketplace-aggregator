import {
  Box,
  Button,
  Paper,
  Typography,
} from "@mui/material";

import CompareIcon from "@mui/icons-material/Compare";
import CloseIcon from "@mui/icons-material/Close";
import { useLocation, useNavigate } from "react-router-dom";
import { useCompare } from "../contexts/compareStore";

export function CompareButton() {
  const { selectedProducts, clearProducts } = useCompare();
  const navigate = useNavigate();
  const location = useLocation();
  const isComparePage = location.pathname === "/compare";

  // Só exibe o CTA quando há produtos suficientes para uma comparação útil.
  if (!isComparePage && selectedProducts.length < 2) {
    return null;
  }

  const handleClick = () => {
    if (isComparePage) {
      clearProducts();
      navigate("/");
      return;
    }

    navigate("/compare");
  };

  return (
    <Paper
      elevation={8}
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 1400,
        borderRadius: 4,
        overflow: "hidden",
        bgcolor: "primary.main",
      }}
    >
      <Button
        onClick={handleClick}
        sx={{
          color: "common.white",
          textTransform: "none",
          px: 3,
          py: 1.25,
          minWidth: 240,
          justifyContent: "flex-start",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {isComparePage ? <CloseIcon sx={{ fontSize: 22 }} /> : <CompareIcon sx={{ fontSize: 22 }} />}
          <Box sx={{ textAlign: "left" }}>
            <Typography variant="button" sx={{ color: "common.white", fontWeight: 700, display: "block" }}>
              {isComparePage ? "Fechar comparação" : "Abrir comparação"}
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.92)", display: "block" }}>
              {selectedProducts.length} produtos selecionados
            </Typography>
          </Box>
        </Box>
      </Button>
    </Paper>
  );
}
