import express, { json } from 'express';
import fs, { read } from "fs";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const readData = () => {
    try{
        const data = fs.readFileSync("./db.json");
    return (JSON.parse(data));
    }
    catch(error){
        console.log(error);
    }
};

const writeData = (data) => {
    try{
    fs.writeFileSync("./db.json", JSON.stringify(data));
    }
    catch(error){
        console.log(error);
    }
};

app.get("/", (req, res) => {
    res.send("primera prueba")
});

app.get("/empleados", (req, res) => {
    const data = readData();
    res.json(data.empleados);
})

app.get("/empleados/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const empleado = data.empleados.find((empleado) => empleado.id === id);
    res.json(empleado);
});

app.post("/empleados", (req, res) => {
    const data = readData();
    const body = req.body;
    const newEmpleado = {
        id: data.empleados.length + 1,
        ...body,
    };
    data.empleados.push(newEmpleado);
    writeData(data);
    res.json(newEmpleado);
})

app.put("/empleados/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const empleadoIndex = data.empleados.findIndex((empleado) => empleado.id === id);
    data.empleados[empleadoIndex] = {
        ...data.empleados[empleadoIndex],
        ...body,
    };
    writeData(data);
    res.json({
        message: "Empleados actualizados correctamente."
    });
})

app.delete("/empleados/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const empleadoIndex = data.empleados.findIndex((empleado) => empleado.id === id);
    data.empleados.splice(empleadoIndex, 1);
    writeData(data);
    res.json({
        message: "Empleado eliminado correctamente."
    });
})

app.listen(3000, () => {
    console.log('Server listening on port 3000')
});