import {
  Fab,
  Badge
} from "@mui/material";

import CompareIcon
from "@mui/icons-material/Compare";

import { useNavigate } from "react-router-dom";

import { useCompare }
from "../contexts/CompareContext";

export function CompareButton() {

  const {
    selectedProducts
  } = useCompare();

  const navigate = useNavigate();

  if (
    selectedProducts.length < 2
  ) {
    return null;
  }

  return (
    <Badge
      badgeContent={
        selectedProducts.length
      }
      color="primary"
      sx={{
        position: "fixed",
        bottom: 30,
        right: 30
      }}
    >
      <Fab
        color="primary"
        onClick={() => navigate("/compare")}
        aria-label="Comparar produtos"
      >
        <CompareIcon />
      </Fab>
    </Badge>
  );
}