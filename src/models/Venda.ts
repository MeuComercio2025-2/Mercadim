import { Collection } from "fireorm";
import { IsString, IsNumber, IsDate, IsArray } from "class-validator";

interface ItemVenda {
    produtoId: string;
    quantidade: number;
    precoUnitario: number;
}

@Collection("vendas") // criar coleção vendas
export class Venda {
    id!: string;

    @IsString()
    usuarioId!: string;

    @IsArray()
    itens!: ItemVenda[];

    @IsNumber()
    valorTotal!: number;

    @IsDate()
    criadoEm!: Date;
}
