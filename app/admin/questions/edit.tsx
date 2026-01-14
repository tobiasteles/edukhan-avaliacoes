import {  
    required, 
    SimpleForm, 
    TextInput,  // Importe o TextInput
    Edit,
    SelectInput,
    ReferenceInput,
    NumberInput
} from "react-admin";

// --- EDIÇÃO ---
export const QuestionEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="id" disabled label="ID da Questão" />
            <TextInput 
                source="content" 
                validate={[required()]} 
                label="Enunciado" 
                fullWidth 
                multiline 
            />
            <SelectInput
                label="Tipo"
                source="type"
                choices={[
                    { id: "multiple_choice", name: "Múltipla Escolha" },
                    { id: "assist", name: "Assistida" }
                ]}
            />
            <ReferenceInput source="examId" reference="exams" label="Exame">
                <SelectInput optionText="title" />
            </ReferenceInput>
            <NumberInput source="order" label="Ordem" />
        </SimpleForm>
    </Edit>
);