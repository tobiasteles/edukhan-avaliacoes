import { Datagrid, List, TextField } from "react-admin";

export const StudentList = () => {
    return (
        <List>
            <Datagrid rowClick="edit">
            <TextField source="name" label="Nome" />
            <TextField source="age" label="Idade" />
            <TextField source="grade" label="Série" />
            <TextField source="schoolName" label="Escola" />
            <TextField source="unit" label="Unidade" />
            <TextField source="city" label="Cidade" />
            <TextField source="state" label="Estado" />
            </Datagrid>
        </List>
    )
}