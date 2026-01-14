import {   
    SimpleForm, 
    TextInput,  // Importe o TextInput
    Edit,
    NumberInput,
    DateInput
} from "react-admin";

// --- EDIÇÃO ---
export const ExamResultEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="id" disabled />
            <NumberInput source="score" label="Nota/Pontuação" />
            <DateInput source="completedAt" label="Data de Conclusão" />
        </SimpleForm>
    </Edit>
);