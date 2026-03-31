"use client";

import { useEffect, useState } from "react";
import { Gift, Star, ShoppingBag, Loader2, AlertCircle } from "lucide-react";

// Interface ajustada para os campos reais do seu banco (vimos no seu JSON)
interface Premio {
  id: string;
  nome: string;
  valor: number;
  quantidade: number; // Campo correto vindo do banco
  imagemUrl: string | null; // Campo que traz o Base64 da imagem
  unidadeId: string;
}

export function LojinhaPremios() {
  const [premios, setPremios] = useState<Premio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  const fetchPremios = async () => {
    try {
      // Usamos a URL completa e forçamos o modo 'cors'
      const response = await fetch("https://sga.edukhan.ong.br/api/premios", {
        method: 'GET',
        mode: 'cors', // Crucial para chamadas entre domínios diferentes
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      setPremios(data);
    } catch (err) {
      console.error("Erro na Lojinha:", err);
      setError("Não foi possível carregar os prêmios.");
    } finally {
      setLoading(false);
    }
  };

  fetchPremios();
}, []);

  // 1. Tela de Carregamento
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4 bg-slate-50/50 rounded-xl border-2 border-dashed">
        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
          Sincronizando com Point Bank...
        </p>
      </div>
    );
  }

  // 2. Tela de Erro (se o 404 persistir)
  if (error) {
    return (
      <div className="p-10 text-center border-2 border-red-100 bg-red-50/30 rounded-xl">
        <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
        <p className="text-xs font-bold text-red-600 uppercase">Falha na Conexão</p>
        <p className="text-[10px] text-red-400 uppercase mt-1">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-red-100 text-red-700 text-[10px] font-bold rounded-lg hover:bg-red-200 transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  // 3. Vitrine Principal
  return (
    <div className="p-6 space-y-8 font-mono bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <ShoppingBag className="text-primary h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-black uppercase leading-tight">Lojinha Edukhan</h2>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">Troque seus Pontos Khan Academy</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {premios.length > 0 ? (
          premios.map((item) => (
            <div key={item.id} className="group flex flex-col border border-slate-100 rounded-2xl p-4 hover:shadow-xl hover:border-primary/20 transition-all bg-card">
              
              {/* Espaço da Imagem (Suporta Base64) */}
              <div className="aspect-square bg-slate-50 rounded-xl mb-4 overflow-hidden flex items-center justify-center border border-slate-50 relative">
                {item.imagemUrl ? (
                  <img 
                    src={item.imagemUrl} 
                    alt={item.nome} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                ) : (
                  <Gift className="h-12 w-12 text-slate-200" />
                )}
                {item.quantidade <= 2 && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-[8px] font-black px-2 py-1 rounded-md uppercase">
                    Últimas unidades
                  </span>
                )}
              </div>
              
              <h3 className="font-bold text-xs uppercase mb-1 truncate text-slate-800">{item.nome}</h3>
              
              <div className="flex items-center justify-between mt-auto pt-4">
                <div className="flex items-center gap-1.5 bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-full border border-yellow-200 text-[10px] font-black">
                  <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                  {item.valor.toLocaleString('pt-BR')} PTS
                </div>
                <div className="text-right">
                  <span className="block text-[9px] font-black text-slate-400 uppercase">Estoque</span>
                  <span className="text-[10px] font-bold text-slate-600">{item.quantidade} un.</span>
                </div>
              </div>

              <button className="w-full mt-5 py-3 bg-slate-900 text-white hover:bg-primary text-[10px] font-black rounded-xl uppercase transition-all shadow-sm active:scale-95">
                Solicitar Resgate
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed rounded-2xl">
            <Gift className="h-12 w-12 text-slate-200 mx-auto mb-4" />
            <p className="text-xs font-bold uppercase text-slate-400">Nenhum prêmio disponível agora.</p>
          </div>
        )}
      </div>
    </div>
  );
}