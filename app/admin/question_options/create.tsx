import { 
    BooleanInput,
    Create, 
    ReferenceInput, 
    required, 
    SelectInput, 
    SimpleForm, 
    TextInput,    // Importe o TextInput
    // Importe o NumberInput para campos numéricos
} from "react-admin";
import { UploadButtonCustom } from "../components/uploadButtonCustom";

export const OptionCreate = () => (
    <Create>
        <SimpleForm>
            <ReferenceInput source="questionId" reference="questions" label="Vincular à Questão">
                <SelectInput optionText="content" validate={[required()]} fullWidth />
            </ReferenceInput>
            <TextInput source="content" label="Texto da Alternativa" validate={[required()]} fullWidth />
            <UploadButtonCustom source="imageSrc" label="Imagem da Alternativa (Opcional)" />
            <BooleanInput source="isCorrect" label="Esta é a resposta correta?" defaultValue={false} />
        </SimpleForm>
    </Create>
);