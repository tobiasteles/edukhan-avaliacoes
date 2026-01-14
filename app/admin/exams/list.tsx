import { Datagrid, List, TextField } from "react-admin";

export const ExamList = () => {
    return (
        <List>
            <Datagrid rowClick="edit">
            <TextField source="title" label="Titulo" />
            <TextField source="description" label="Descrição" />
            </Datagrid>
        </List>
    )
}