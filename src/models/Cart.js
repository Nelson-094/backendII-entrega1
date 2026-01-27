import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, 'Quantity must be at least 1'],
            default: 1
        }
    }]
}, {
    timestamps: true
});

// Method to add product to cart
cartSchema.methods.addProduct = function (productId, quantity = 1) {
    const existingProduct = this.products.find(
        item => item.product.toString() === productId.toString()
    );

    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        this.products.push({ product: productId, quantity });
    }

    return this.save();
};

// Method to remove product from cart
cartSchema.methods.removeProduct = function (productId) {
    this.products = this.products.filter(
        item => item.product.toString() !== productId.toString()
    );
    return this.save();
};

// Method to update product quantity
cartSchema.methods.updateQuantity = function (productId, quantity) {
    const product = this.products.find(
        item => item.product.toString() === productId.toString()
    );

    if (product) {
        product.quantity = quantity;
    }

    return this.save();
};

// Method to clear cart
cartSchema.methods.clearCart = function () {
    this.products = [];
    return this.save();
};

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
