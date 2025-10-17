import { Collection } from "fireorm";
import { IsString, IsDate } from "class-validator";

@Collection("categorias")
export class Categoria {
    id!: string;

    @IsString()
    nome!: string;

    @IsString()
    descricao!: string;

    @IsDate()
    criadoEm!: Date;
}
