import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'El título del producto es obligatorio'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'La descripción del producto es obligatoria'],
        trim: true
    },
    code: {
        type: String,
        required: [true, 'El código del producto es obligatorio'],
        unique: true,
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'El precio del producto es obligatorio'],
        min: [0, 'El precio debe ser un número positivo']
    },
    stock: {
        type: Number,
        required: [true, 'El stock del producto es obligatorio'],
        min: [0, 'El stock debe ser un número positivo'],
        default: 0
    },
    category: {
        type: String,
        required: [true, 'La categoría del producto es obligatoria'],
        trim: true
    },
    thumbnails: [{
        type: String
    }],
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', productSchema);

export default Product;
