import { getRepository } from "fireorm";
import { MovimentoEstoque } from "@/models/MovimentoEstoque";
import "@/config/firebase-admin"; 

export const movimentoEstoqueRepository = getRepository(MovimentoEstoque);
