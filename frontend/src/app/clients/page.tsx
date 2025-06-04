"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type Cliente = {
  id: number;     // no Prisma é Int (number no TS)
  name: string;
  email: string;
  status: boolean;
};

async function fetchClientes(): Promise<Cliente[]> {
  const { data } = await axios.get("http://localhost:3001/clients");
  return data;
}

export default function ClientesPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["clientes"],
    queryFn: fetchClientes,
  });

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Clientes</h1>

      {isLoading && <p>Carregando...</p>}
      {error && <p className="text-red-500">Erro ao carregar clientes: {error.message || JSON.stringify(error)}</p>}

      <button className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Novo Cliente
      </button>

      <table className="w-full border border-gray-200 text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border-b">Nome</th>
            <th className="p-2 border-b">Email</th>
            <th className="p-2 border-b">Status</th>
            <th className="p-2 border-b">Ações</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((cliente) => (
            <tr key={cliente.id} className="border-t">
              <td className="p-2">{cliente.name}</td>
              <td className="p-2">{cliente.email}</td>
              <td className="p-2 capitalize">{cliente.status ? "ativo" : "inativo"}</td>
              <td className="p-2">
                <button className="text-blue-600 hover:underline">Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
