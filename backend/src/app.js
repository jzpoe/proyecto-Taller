import express from 'express';
import router from '../src/routes/routes.js';
import cors from 'cors'
import path from "path";

const app = express();

app.use(express.json());
app.use(cors())
app.use("/uploads/upload", express.static("uploads"))
app.use(
    "/uploads",
    express.static(path.join(process.cwd(), "uploads"))
);
app.use('/api', router);

app.get('/', (req, res) => {
    return res.json({ message: "API Gestión de Activos funcionando" })
});




export default app;