import {  
    required, 
    SimpleForm, 
    TextInput,  // Importe o TextInput
    Edit,
    SelectInput,
    ReferenceInput,
    BooleanInput
} from "react-admin";
import { UploadButtonCustom } from "../components/uploadButtonCustom";

// --- EDIÇÃO ---
export const OptionEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="id" disabled />
            <ReferenceInput source="questionId" reference="questions">
                <SelectInput optionText="content" fullWidth />
            </ReferenceInput>
            <TextInput source="content" label="Texto da Alternativa" validate={[required()]} fullWidth />
            <UploadButtonCustom source="imageSrc" label="Imagem da Alternativa (Opcional)" />
            <BooleanInput source="isCorrect" label="Resposta correta" />
        </SimpleForm>
    </Edit>
);