import { getRepository } from "fireorm";
import { Venda } from "@/models/Venda";
import "@/config/firebase-admin"; 

export const vendaRepository = getRepository(Venda);