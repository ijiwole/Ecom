import express from 'express';
import { config } from 'dotenv';
config();

import authRouter from './routes/auth.js';
import { upload } from './controller/auth.js';
import initModels from './models/initials.js';
import couponRouter from './routes/coupon.js';
import categoryRouter from './routes/category.js';
import productRouter from './routes/product.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/auth/", upload.single("image"), authRouter)
app.use("/api/v1/coupon", couponRouter)
app.use("/api/v1/category", categoryRouter)
app.use("/api/v1/product", productRouter)

const PORT = process.env.PORT || 3000;

initModels().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});

