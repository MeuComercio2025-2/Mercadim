"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [click, setClick] = useState<number>(0);
  const [message, setMessage] = useState<string>("Carregando...");

  useEffect(() => {
    axios.get("/api/clientes")
      .then(res => {
        setMessage(res.data.message ?? JSON.stringify(res.data));
      })
      .catch(err => {
        setMessage("Erro ao buscar clientes: " + err.message);
      });
  }, []);

  return (
    <div className=" text-black w-full h-full flex flex-col gap-6 items-center justify-center p-5">
      <div className="text-center text-white">
        <h1>Mensagem do Backend logo abaixo</h1>
        <p>{message}</p>
      </div>
      <div className="w-1/2 h-1/2 flex flex-col items-center justify-center">
        <h1 className="text-center text-6xl">{click}</h1>
        <button
          className="border p-2 rounded-md bg-amber-300"
          onClick={() => setClick(click + 1)}
        >
          Por favor, clique em mim
        </button>
      </div>
    </div>
  );
}
