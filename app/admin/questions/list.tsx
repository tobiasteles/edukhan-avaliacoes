import { Datagrid, List, NumberField, ReferenceField, TextField } from "react-admin";

export const QuestionList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            {/* Mostra o título do exame ao qual a questão pertence */}
            <ReferenceField source="examId" reference="exams" label="Exame">
                <TextField source="title" />
            </ReferenceField>
            <TextField source="content" label="Questão" />
            <TextField source="type" label="Tipo" />
            <NumberField source="order" label="Ordem" />
        </Datagrid>
    </List>
);