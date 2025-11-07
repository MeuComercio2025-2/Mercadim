import { Collection } from "fireorm";
import { IsString, IsIn, IsNumber, IsDate } from "class-validator";

@Collection("movimentosEstoque")
export class MovimentoEstoque {
  id!: string;

  @IsString()
  produtoId!: string;

  @IsIn(["entrada", "saida"])
  tipo!: "entrada" | "saida";

  @IsNumber()
  quantidade!: number;

  @IsString()
  descricao!: string;

  @IsDate()
  criadoEm!: Date;
}
