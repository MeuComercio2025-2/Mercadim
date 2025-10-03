import { getRepository } from "fireorm";
import { Produto } from "@/models/Produto";
import "@/config/firebase-admin"; 

export const produtoRepository = getRepository(Produto);