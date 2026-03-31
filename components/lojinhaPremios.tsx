"use client";

import { useEffect, useState } from "react";
import { Gift, Star, Loader2, AlertCircle, MapPin } from "lucide-react";

interface Premio {
  id: string;
  nome: string;
  valor: number;
  quantidade: number;
  imagemUrl: string | null;
  unidadeId: string;
}

export function LojinhaPremios() {
  const [premiosPorUnidade, setPremiosPorUnidade] = useState<Record<string, Premio[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPremios = async () => {
      try {
        const response = await fetch("https://sga.edukhan.ong.br/api/premios", {
          method: 'GET',
          mode: 'cors',
          cache: 'no-store',
        });

        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

        const data: Premio[] = await response.json();

        // LÓGICA DE AGRUPAMENTO: Transforma a lista simples em um objeto separado por Unidade
        const agrupados = data.reduce((acc, premio) => {
          const unidade = premio.unidadeId || "Geral";
          if (!acc[unidade]) acc[unidade] = [];
          acc[unidade].push(premio);
          return acc;
        }, {} as Record<string, Premio[]>);

        setPremiosPorUnidade(agrupados);
      } catch (err) {
        console.error("Erro na Lojinha:", err);
        setError("Não foi possível carregar os prêmios.");
      } finally {
        setLoading(false);
      }
    };

    fetchPremios();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 bg-slate-50/50 rounded-xl border-2 border-dashed">
      <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50" />
      <p className="text-[10px] font-black uppercase tracking-widest mt-4">Sincronizando unidades...</p>
    </div>
  );

  if (error) return (
    <div className="p-10 text-center border-2 border-red-100 bg-red-50/30 rounded-xl font-mono text-[10px]">
       <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
       <p className="font-bold text-red-600 uppercase">Erro de Conexão</p>
       <button onClick={() => window.location.reload()} className="mt-2 text-red-500 underline uppercase">Tentar de novo</button>
    </div>
  );

  return (
    <div className="space-y-12 font-mono">
      {Object.entries(premiosPorUnidade).map(([unidade, lista]) => (
        <section key={unidade} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          
          {/* CABEÇALHO DA UNIDADE */}
          <div className="flex items-center gap-2 mb-6 border-b pb-4">
            <MapPin className="text-primary h-4 w-4" />
            <h2 className="text-sm font-black uppercase tracking-tighter">
              Unidade: <span className="text-primary">{unidade}</span>
            </h2>
            <span className="ml-auto text-[10px] bg-slate-100 px-2 py-1 rounded font-bold text-slate-500">
              {lista.length} ITENS
            </span>
          </div>

          {/* GRID DE PRÊMIOS DA UNIDADE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {lista.map((item) => (
              <div key={item.id} className="group border border-slate-50 rounded-2xl p-3 hover:shadow-md transition-all">
                <div className="aspect-square bg-slate-50 rounded-xl mb-3 overflow-hidden flex items-center justify-center relative border border-slate-100">
                  {item.imagemUrl ? (
                    <img src={item.imagemUrl} alt={item.nome} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <Gift className="h-8 w-8 text-slate-200" />
                  )}
                  {item.quantidade === 0 && (
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center">
                      <span className="bg-slate-900 text-white text-[8px] font-black px-2 py-1 rounded uppercase">Esgotado</span>
                    </div>
                  )}
                </div>
                
                <h3 className="font-bold text-[10px] uppercase truncate text-slate-700 mb-2">{item.nome}</h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full border border-yellow-200 text-[9px] font-black">
                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                    {item.valor} PTS
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 italic">{item.quantidade} un.</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}