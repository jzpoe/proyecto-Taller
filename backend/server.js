import app from './src/app.js';
import dotenv from 'dotenv';
import connectDB  from './src/config/data-base.js';
import path from "path";



dotenv.config();
connectDB();

const PORT = process.env.PORT || 3001;

app.listen(PORT , () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

