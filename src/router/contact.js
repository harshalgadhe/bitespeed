import express from "express";
import { createContact, getContactIdentity } from "../controller/contact.js";

const router = express.Router();

router.post('/identity', (req, res)=> {
    getContactIdentity(req, res)
});

router.post('/create_contact', (req, res) => {
    createContact(req, res);
});

export default router;