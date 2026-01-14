import { List, Datagrid, TextField, DateField, EditButton, DeleteButton } from "react-admin";

export const AnnouncementList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="title" label="Título" />
      <DateField source="createdAt" label="Postado em" showTime />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);