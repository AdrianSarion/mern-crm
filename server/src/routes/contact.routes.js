const express = require("express");
const {
  getContactById,
  getContacts,
  updateContact,
  deleteContact,
  createContacts,
  importContactsFromCSV,
} = require("../controllers/contact.controller");
const { validateParamsId, validateBodyData } = require("../middlewares/validator");
const sanitizeBodyData = require("../middlewares/sanitizer");
const { isAuth } = require("../middlewares/authenticator");

const contactRouter = express.Router();
contactRouter.post("/", isAuth, sanitizeBodyData, validateBodyData, createContacts);
contactRouter.get("/", isAuth, getContacts);
contactRouter.get("/:id", isAuth, validateParamsId, getContactById);
contactRouter.patch(
  "/:id",
  isAuth,
  validateParamsId,
  sanitizeBodyData,
  validateBodyData,
  updateContact,
);
contactRouter.delete("/:id", isAuth, validateParamsId, deleteContact);
contactRouter.post("/import-csv", isAuth, importContactsFromCSV);

// contactRouter.get('/analytics')
// contactRouter.get('/analytics/:id')

module.exports = contactRouter;
