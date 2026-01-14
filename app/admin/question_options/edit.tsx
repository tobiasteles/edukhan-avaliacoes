import {  
    required, 
    SimpleForm, 
    TextInput,  // Importe o TextInput
    Edit,
    SelectInput,
    ReferenceInput,
    BooleanInput
} from "react-admin";

// --- EDIÇÃO ---
export const OptionEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="id" disabled />
            <ReferenceInput source="questionId" reference="questions">
                <SelectInput optionText="content" fullWidth />
            </ReferenceInput>
            <TextInput source="text" label="Texto da Alternativa" validate={[required()]} fullWidth />
            <BooleanInput source="isCorrect" label="Resposta correta" />
        </SimpleForm>
    </Edit>
);