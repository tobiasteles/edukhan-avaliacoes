import { Edit, SimpleForm, TextInput } from "react-admin";

export const AnnouncementEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="title" label="Título" fullWidth />
      <TextInput source="content" label="Conteúdo" multiline fullWidth />
    </SimpleForm>
  </Edit>
);