import { Collection } from "fireorm";
import { IsString, IsNumber, IsDate, IsIn } from "class-validator";

@Collection("movimentosEstoque")
export class Estoque {
  id!: string;

  @IsString()
  produtoId!: string;

  @IsIn(["entrada", "saida"])
  tipo!: "entrada" | "saida";

  @IsNumber()
  quantidade!: number;

  @IsString()
  descricao!: string; // ex.: "venda", "compra fornecedor"

  @IsDate()
  criadoEm!: Date;
}
