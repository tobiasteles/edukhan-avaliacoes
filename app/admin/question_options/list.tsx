import { BooleanField, Datagrid, List, ReferenceField, TextField } from "react-admin";

export const OptionList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <ReferenceField source="questionId" reference="questions" label="Questão">
                <TextField source="content" />
            </ReferenceField>
            <TextField source="text" label="Texto da Opção" />
            <BooleanField source="isCorrect" label="Correta?" />
        </Datagrid>
    </List>
);