const CartsService = require('./carts-service');

const getCarts = async (req, res) => {
  try {
    const { pageNumber, pageSize } = req.query;
    if (!pageNumber || !pageSize) {
      return res.status(400).json({ error: 'Missing parameters' });
    }
    const carts = await CartsService.find(pageNumber, pageSize);
    if (!carts || carts.length === 0) {
      return res.status(404).json({ error: 'No carts found' });
    }
    res.json(carts);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getCart = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Missing cart ID' });
    }
    const cart = await CartsService.findById(id);
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getCartItems = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Missing cart ID' });
    }
    const cartItems = await CartsService.getCartItemsById(id);
    if (!cartItems || cartItems.length === 0) {
      return res.status(404).json({ error: 'Cart items not found' });
    }
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const addCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.body.product_id || !req.body.quantity) {
      return res.status(400).json({ error: 'Missing product details' });
    }
    const cartItem = await CartsService.addItemToCart(id, req.body);
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteCart = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Missing cart ID' });
    }
    const deletedCart = await CartsService.deleteCartById(id);
    if (!deletedCart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    res.json(deletedCart);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { id, productId } = req.params;
    if (!id || !productId) {
      return res.status(400).json({ error: 'Missing parameters' });
    }
    const deletedItem = await CartsService.deleteItemFromCart(id, productId);
    if (!deletedItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    res.json(deletedItem);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteAllItems = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Missing cart ID' });
    }
    const deletedItems = await CartsService.deleteAllItemsFromCart(id);
    if (!deletedItems) {
      return res.status(404).json({ error: 'No items found in cart' });
    }
    res.json({ message: 'All items deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const addCart = async (req, res) => {
  try {
    const user_id = req.user && req.user.userId;
    if (!user_id) {
      return res
        .status(401)
        .json({ error: 'Unauthorized: User ID missing from token' });
    }
    const newCart = await CartsService.createCart(user_id);
    if (!newCart) {
      return res.status(409).json({ error: 'Cart creation failed' });
    }
    res.status(201).json(newCart);
  } catch (error) {
    console.error('Error adding cart:', error); // Log the error for debugging purposes
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  addCartItem,
  deleteCartItem,
  deleteAllItems,
  getCart,
  deleteCart,
  addCart,
  getCarts,
  getCartItems,
};
