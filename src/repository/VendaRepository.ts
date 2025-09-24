import { getRepository } from "fireorm";
import { Venda } from "@/models/Venda";

export const vendaRepository = getRepository(Venda);