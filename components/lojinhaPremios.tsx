"use client";

import { useEffect, useState } from "react";
import { Gift, Star, ShoppingBag, Loader2 } from "lucide-react";

interface Premio {
  id: string;
  nome: string;
  valor: number;
  quantidade: number; // MUDADO: No seu JSON está "quantidade", não "estoque"
  imagemUrl: string | null;
  unidadeId: string;
}

export function LojinhaPremios() {
  const [premios, setPremios] = useState<Premio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Busca os dados da API oficial
    fetch("https://sga.edukhan.ong.br/api/premios", {
        method: 'GET',
        mode: 'cors', // Garante que o navegador tente o acesso cross-origin
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao acessar API");
        return res.json();
      })
      .then((data) => {
        setPremios(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro na Lojinha:", err);
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-20 text-center font-mono flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-xs uppercase tracking-widest">Sincronizando prêmios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center font-mono border-2 border-dashed border-red-200 rounded-xl">
        <p className="text-red-500 text-xs uppercase font-bold">Erro de conexão com o servidor de prêmios.</p>
        <p className="text-[10px] text-muted-foreground mt-2">Verifique o link da API ou as permissões de CORS.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 font-mono">
      <div className="flex items-center gap-2 border-b pb-4">
        <ShoppingBag className="text-primary h-5 w-5" />
        <h2 className="text-lg font-bold uppercase">Vitrine de Prêmios</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {premios.map((item) => (
          <div key={item.id} className="border-2 border-slate-100 rounded-xl p-4 bg-white hover:border-primary/50 hover:shadow-lg transition-all group flex flex-col">
            
            {/* ÁREA DA IMAGEM (Tratando Base64) */}
            <div className="h-40 bg-slate-50 rounded-lg mb-4 overflow-hidden flex items-center justify-center border">
              {item.imagemUrl ? (
                <img 
                  src={item.imagemUrl} 
                  alt={item.nome} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                />
              ) : (
                <Gift className="h-10 w-10 text-slate-300" />
              )}
            </div>
            
            <h3 className="font-bold text-sm uppercase mb-1 flex-grow">{item.nome}</h3>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-black border border-yellow-200">
                <Star className="h-3 w-3 fill-yellow-600 text-yellow-600" />
                {item.valor.toLocaleString('pt-BR')} PTS
              </div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold">
                {item.quantidade} em estoque
              </span>
            </div>

            <button className="w-full mt-4 py-2.5 bg-slate-900 text-white text-[10px] font-black rounded-lg uppercase hover:bg-primary transition-colors">
              Como Resgatar?
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}