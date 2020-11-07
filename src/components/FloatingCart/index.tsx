import React, { useState, useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

// Calculo do total
// Navegação no clique do TouchableHighlight

const FloatingCart: React.FC = () => {
  const { products } = useCart();

  const navigation = useNavigation();

  const cartTotal = useMemo(() => {
    // soma total dentro dos containers
    const total = products.reduce((accumulator, product) => {
      const productsSubtotal = product.price * product.quantity;

      return accumulator + productsSubtotal;
      // parametro do reduce 0 parametro inicial o terceiro deve ser passado
    }, 0);
    // TODO RETURN THE SUM OF THE QUANTITY OF THE PRODUCTS IN THE CART
    

    return formatValue(total);
  }, [products]);

  const totalItensInCart = useMemo(() => {
    // soma total dos produtos no footer

    const total = products.reduce((accumulator, product) => {
      const productsQuantity = product.quantity;

      return accumulator + productsQuantity;
      // parametro do reduce 0 parametro inicial o terceiro deve ser passado
    }, 0);

    // TODO RETURN THE SUM OF THE QUANTITY OF THE PRODUCTS IN THE CART

    return total;
  }, [products]);

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
