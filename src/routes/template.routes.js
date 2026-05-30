const { Router } = require("express");
const templateRouter = Router();
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const loadTemplates = require("../Templates/loadTemplates");
const createTemplate = require("../controllers/CreateTemplates/createTemplate");
const getTemplates = require("../Templates/getTemplates");
const deleteTemplate = require("../Templates/deleteTemplate");

// obtener lista de templates
templateRouter.get("/", getTemplates);

// crear template nuevo
templateRouter.post("/", auth, admin, createTemplate);

// cargar template por nombre
templateRouter.get("/:name", auth, admin, loadTemplates);

module.exports = templateRouter;


// 🔹 eliminar template por nombre
templateRouter.delete("/:name", auth, admin, deleteTemplate);
