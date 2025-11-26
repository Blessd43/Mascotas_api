// server.js
const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

// Datos en memoria
let owners = [
  { id: 1, nombre: "Juan", correo: "juan@gmail.com", telefono: "3001234567" },
  { id: 2, nombre: "Laura", correo: "laura@gmail.com", telefono: "3019876543" },
  { id: 3, nombre: "Andrés", correo: "andres@gmail.com", telefono: "3025556677" },
  { id: 4, nombre: "Carolina", correo: "carolina@gmail.com", telefono: "3004448899" },
  { id: 5, nombre: "Miguel", correo: "miguel@gmail.com", telefono: "3031239988" },
  { id: 6, nombre: "Sofía", correo: "sofia@gmail.com", telefono: "3042223344" },
  { id: 7, nombre: "Camilo", correo: "camilo@gmail.com", telefono: "3057778899" },
  { id: 8, nombre: "Daniela", correo: "daniela@gmail.com", telefono: "3061112233" },
  { id: 9, nombre: "Felipe", correo: "felipe@gmail.com", telefono: "3073334455" },
  { id: 10, nombre: "Valentina", correo: "valentina@gmail.com", telefono: "3088887766" },
];


let pets = [
  { id: 1, nombre: "Firulais", tipo: "perro", edad: 4, id_dueño: 1 },
  { id: 2, nombre: "Michi", tipo: "gato", edad: 2, id_dueño: 2 },
  { id: 3, nombre: "Rocky", tipo: "perro", edad: 3, id_dueño: 3 },
  { id: 4, nombre: "Luna", tipo: "gato", edad: 1, id_dueño: 4 },
  { id: 5, nombre: "Toby", tipo: "perro", edad: 5, id_dueño: 5 },
  { id: 6, nombre: "Nala", tipo: "gato", edad: 2, id_dueño: 6 },
  { id: 7, nombre: "Max", tipo: "perro", edad: 6, id_dueño: 7 },
  { id: 8, nombre: "Coco", tipo: "loro", edad: 3, id_dueño: 8 },
  { id: 9, nombre: "Bunny", tipo: "conejo", edad: 1, id_dueño: 9 },
  { id: 10, nombre: "Tigre", tipo: "gato", edad: 4, id_dueño: 10 },
];

// ----------------------------------------
// 📌 CRUD DUEÑOS
// ----------------------------------------

// Listar todos los dueños
app.get("/owners", (req, res) => {
  res.status(200).json({ message: "Lista de dueños", data: owners });
});

// Obtener un dueño por ID
app.get("/owners/:id", (req, res) => {
  const { id } = req.params;
  const owner = owners.find((o) => o.id === parseInt(id));

  if (!owner) {
    return res.status(404).json({ message: "Dueño no encontrado" });
  }

  res.status(200).json({ message: "Dueño encontrado", data: owner });
});

// Crear un nuevo dueño
app.post("/owners", (req, res) => {
  const { nombre, correo, telefono } = req.body;

  if (!nombre || !correo || !telefono) {
    return res.status(400).json({ message: "Campos requeridos faltantes" });
  }

  const newOwner = {
    id: owners.length + 1,
    nombre,
    correo,
    telefono,
  };

  owners.push(newOwner);
  res.status(201).json({ message: "Dueño creado exitosamente", data: newOwner });
});

// Actualizar un dueño existente
app.put("/owners/:id", (req, res) => {
  const { id } = req.params;
  const owner = owners.find((o) => o.id === parseInt(id));

  if (!owner) {
    return res.status(404).json({ message: "Dueño no encontrado" });
  }

  const { nombre, correo, telefono } = req.body;
  if (!nombre || !correo || !telefono) {
    return res.status(400).json({ message: "Campos requeridos faltantes" });
  }

  owner.nombre = nombre;
  owner.correo = correo;
  owner.telefono = telefono;

  res.status(200).json({ message: "Dueño actualizado correctamente", data: owner });
});

// Eliminar un dueño
app.delete("/owners/:id", (req, res) => {
  const { id } = req.params;
  const index = owners.findIndex((o) => o.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ message: "Dueño no encontrado" });
  }

  owners.splice(index, 1);
  res.status(200).json({ message: "Dueño eliminado correctamente" });
});

// ----------------------------------------
// 🐶 CRUD MASCOTAS
// ----------------------------------------

// Listar todas las mascotas o filtrar por tipo (/pets?tipo=perro)
app.get("/pets", (req, res) => {
  const { tipo } = req.query;

  if (tipo) {
    const filtered = pets.filter((p) => p.tipo.toLowerCase() === tipo.toLowerCase());
    return res.status(200).json({
      message: `Mascotas de tipo ${tipo}`,
      data: filtered,
    });
  }

  res.status(200).json({ message: "Lista de mascotas", data: pets });
});

// Obtener mascota por ID
app.get("/pets/:id", (req, res) => {
  const { id } = req.params;
  const pet = pets.find((p) => p.id === parseInt(id));

  if (!pet) {
    return res.status(404).json({ message: "Mascota no encontrada" });
  }

  res.status(200).json({ message: "Mascota encontrada", data: pet });
});

// Crear nueva mascota (validar que el dueño exista)
app.post("/pets", (req, res) => {
  const { nombre, tipo, edad, id_dueño } = req.body;

  if (!nombre || !tipo || !edad || !id_dueño) {
    return res.status(400).json({ message: "Campos requeridos faltantes" });
  }

  const ownerExists = owners.find((o) => o.id === parseInt(id_dueño));

  if (!ownerExists) {
    return res.status(404).json({ message: "Dueño no encontrado" });
  }

  const newPet = {
    id: pets.length + 1,
    nombre,
    tipo,
    edad,
    id_dueño,
  };

  pets.push(newPet);
  res.status(201).json({ message: "Mascota creada correctamente", data: newPet });
});

// Actualizar una mascota existente
app.put("/pets/:id", (req, res) => {
  const { id } = req.params;
  const pet = pets.find((p) => p.id === parseInt(id));

  if (!pet) {
    return res.status(404).json({ message: "Mascota no encontrada" });
  }

  const { nombre, tipo, edad, id_dueño } = req.body;

  if (!nombre || !tipo || !edad || !id_dueño) {
    return res.status(400).json({ message: "Campos requeridos faltantes" });
  }

  const ownerExists = owners.find((o) => o.id === parseInt(id_dueño));
  if (!ownerExists) {
    return res.status(404).json({ message: "Dueño no encontrado" });
  }

  pet.nombre = nombre;
  pet.tipo = tipo;
  pet.edad = edad;
  pet.id_dueño = id_dueño;

  res.status(200).json({ message: "Mascota actualizada correctamente", data: pet });
});

// Eliminar una mascota
app.delete("/pets/:id", (req, res) => {
  const { id } = req.params;
  const index = pets.findIndex((p) => p.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ message: "Mascota no encontrada" });
  }

  pets.splice(index, 1);
  res.status(200).json({ message: "Mascota eliminada correctamente" });
});


app.get("/owners/:id/pets", (req, res) => {
  const { id } = req.params;
  const owner = owners.find((o) => o.id === parseInt(id));

  if (!owner) {
    return res.status(404).json({ message: "Dueño no encontrado" });
  }

  const mascotasDelDueno = pets.filter((p) => p.id_dueño === parseInt(id));

  if (mascotasDelDueno.length === 0) {
    return res.status(200).json({
      message: `El dueño ${owner.nombre} no tiene mascotas registradas`,
      data: [],
    });
  }

  res.status(200).json({
    message: `Mascotas del dueño ${owner.nombre}`,
    data: mascotasDelDueno,
  });
});

// ----------------------------------------

app.listen(PORT, () => {
  console.log(`🚀 Servidor funcionando en el puerto ${PORT}`);
});