// app/admin/admin-client.tsx
"use client"; // ✅ Define a fronteira de cliente aqui

import dynamic from "next/dynamic";

const App = dynamic(() => import("./app"), { 
  ssr: false,
  loading: () => <p>Carregando painel...</p>
});

export const AdminClient = () => {
  return <App />;
};