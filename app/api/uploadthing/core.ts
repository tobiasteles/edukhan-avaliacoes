import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// Aqui você pode adicionar lógica de autenticação se quiser
// Por enquanto, vamos permitir o upload direto para facilitar
export const ourFileRouter = {
  // Define o endpoint para imagens das questões e opções
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .onUploadComplete(async ({  file }) => {
      console.log("Upload completo:", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;