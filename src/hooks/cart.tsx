import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';


interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // recupera o produto sempre a listagem
      const storagedProducts = await AsyncStorage.getItem('@GoMarketplace:products');

      if (storagedProducts) {
        setProducts([...JSON.parse(storagedProducts)]);
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(async product => {
    // verifica se o produto passado por parâmetro já existe no carrinho
    const productExists = products.find(p => p.id === product.id);
    // mapear os produtos do estado e verifica se o p.id é o mesmo id e se for igual passa as informações do ProductButton
    // e a quantidade do produto aumenta em + 1
    if (productExists) {
      setProducts(
        products.map(p => p.id === product.id ? { ...product, quantity: p.quantity + 1 } : p,
        ),
      );
    // caso o produto não exista adiciona o produto recebido pelo parâmetro
    } else {
      setProducts([...products, { ...product, quantity: 1 }]);
    }
    // salvar item 
    await AsyncStorage.setItem('@GoMarketplace:products', JSON.stringify(products), 
    )
}, [products]);

const increment = useCallback(async id => {
  // TODO INCREMENTS A PRODUCT QUANTITY IN THE CART
  const newProducts = products.map(
    product => product.id === id ? {...product, quantity: product.quantity +1 } : product,
  );

  setProducts(newProducts);

  await AsyncStorage.setItem(
    '@GoMarketplace:products',
     JSON.stringify(newProducts),
  );

}, 
[products], );

const decrement = useCallback(async id => {
  // TODO DECREMENTS A PRODUCT QUANTITY IN THE CART
  const newProducts = products.map(
    product => product.id === id ? {...product, quantity: product.quantity -1 } : product,
  );

  setProducts(newProducts);

  await AsyncStorage.setItem(
    '@GoMarketplace:products',
     JSON.stringify(newProducts),
  );
}, [products]);

const value = React.useMemo(
  () => ({ addToCart, increment, decrement, products }),
  [products, addToCart, increment, decrement],
);

return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
