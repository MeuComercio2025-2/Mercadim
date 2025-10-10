import { getRepository } from "fireorm";
import { Estoque } from "@/models/Estoque"
import "@/config/firebase-admin"; 

export const estoqueRepository = getRepository(Estoque);