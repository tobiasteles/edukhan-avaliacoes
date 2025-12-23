import { Kode_Mono } from "next/font/google";

type Props = {
    children: React.ReactNode;
};

const kodeMono = Kode_Mono({
  subsets: ["latin"],
  variable: "--font-kode-mono",
});

const MarketingLayout = ({ children }: Props) => {
    return (
        <div className={`min-h-screen flex flex-col ${kodeMono.variable}`}>
            <main className="flex-1 flex flex-col items-center justify-center font-kode">
                {children}
            </main>
        </div>
    )
}

export default MarketingLayout;