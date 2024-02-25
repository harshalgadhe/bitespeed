import express from "express";
import { getContactIdentity } from "../controller/contact.js";

const router = express.Router();

router.post('/identity', (req, res)=> {
    getContactIdentity(req, res)
});

export default router;