import { Collection } from "fireorm";
import { IsEmail, IsString, IsDate, IsPhoneNumber } from "class-validator";

@Collection("usuarios")
export class Usuario {
    id!: string;

    @IsEmail()
    email!: string;

    @IsString()
    senha!: string;

    @IsString()
    nomeDeUsuario!: string; // nao confundir com nome completo

    @IsString()
    nomeCompleto!: string; // nome completo como consta no cpf

    @IsPhoneNumber() // aceita qualquer número de telefone global
    numeroTelefone!: string;

    @IsDate()
    criadoEm!: Date;

    @IsDate()
    atualizadoEm?: Date;
}

// nesse commit, eu adicionei o fireorm com npm add fireorm, nao sei se era proposital
// deixar ele de fora mas eu adicionei pra funcionar de boas
