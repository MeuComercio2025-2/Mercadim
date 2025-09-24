import { Collection } from "fireorm";
import { IsDate, IsNumber, IsString } from "class-validator";

@Collection("produtos")
export class Produto {
  id!: string;

  @IsString()
  nome!: string;

  @IsNumber()
  preco!: number;

  @IsNumber()
  estoque!: number;

  @IsString() // referência a Categoria
  categoriaId!: string;

  @IsDate()
  criadoEm!: Date;

  @IsDate()
  atualizadoEm?: Date;
}
