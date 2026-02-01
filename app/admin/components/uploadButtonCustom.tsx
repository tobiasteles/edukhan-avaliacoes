"use client";

import { useInput } from "react-admin";
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import Image from "next/image";

interface Props {
    source: string;
    label?: string;
}

export const UploadButtonCustom = ({ source, label }: Props) => {
    // Conecta o componente ao sistema do React Admin
    const {  field, fieldState } = useInput({ source });

    return (
        <div style={{ marginBottom: "20px", border: "1px dashed #ccc", padding: "10px", borderRadius: "8px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", color: "#666" }}>
                {label || "Upload de Imagem"}
            </label>
            
            <UploadButton<OurFileRouter, "imageUploader">
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                    if (res && res.length > 0) {
                        // Atualiza o valor no formulário com a URL da imagem
                        field.onChange(res[0].url);
                        alert("Upload concluído!");
                    }
                }}
                onUploadError={(error: Error) => {
                    alert(`Erro: ${error.message}`);
                }}
            />

            {/* Preview da imagem se ela já existir */}
            {field.value && (
                <div style={{ marginTop: "10px" }}>
                    <p style={{ fontSize: "10px" }}>Preview:</p>
                    <Image 
                        src={field.value} 
                        alt="Preview" 
                        style={{ maxWidth: "200px", borderRadius: "4px" }} 
                        width={200}
                        height={150}
                    />
                    <button 
                        type="button" 
                        onClick={() => field.onChange("")}
                        style={{ display: "block", color: "red", fontSize: "11px", cursor: "pointer", border: "none", background: "none" }}
                    >
                        Remover imagem
                    </button>
                </div>
            )}
            
            {fieldState.error && (
                <span style={{ color: "red", fontSize: "12px" }}>{fieldState.error.message}</span>
            )}
        </div>
    );
};