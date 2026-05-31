import {
  createContext,
  useContext,
  useState,
  type ReactNode
} from "react";

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  thumbnail: string;
  rating: number;
  stock: number;
}

interface CompareContextData {
  selectedProducts: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (id: number) => void;
}

const CompareContext =
  createContext({} as CompareContextData);

export function CompareProvider({
  children
}: {
  children: ReactNode;
}) {
  const [selectedProducts, setSelectedProducts] =
    useState<Product[]>([]);

  function addProduct(product: Product) {
    const exists =
      selectedProducts.find(
        p => p.id === product.id
      );

    if (exists) return;

    setSelectedProducts(prev => [
      ...prev,
      product
    ]);
  }

  function removeProduct(id: number) {
    setSelectedProducts(prev =>
      prev.filter(p => p.id !== id)
    );
  }

  return (
    <CompareContext.Provider
      value={{
        selectedProducts,
        addProduct,
        removeProduct
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  return useContext(CompareContext);
}