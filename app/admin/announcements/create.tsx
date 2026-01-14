import { Create, SimpleForm, TextInput } from "react-admin";

export const AnnouncementCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="title" label="Título do Anúncio" fullWidth validate={Required} />
      <TextInput source="content" label="Conteúdo" multiline fullWidth validate={Required} />
    </SimpleForm>
  </Create>
);

const Required = (value: string | undefined) => (value ? undefined : "Campo obrigatório");