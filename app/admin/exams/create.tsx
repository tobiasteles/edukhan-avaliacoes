import { 
    Create, 
    required, 
    SimpleForm, 
    TextInput,    // Importe o TextInput
    // Importe o NumberInput para campos numéricos
} from "react-admin";

export const ExamCreate = () => {
    return (
        <Create>
            <SimpleForm>
                {/* Use TextInput para textos e NumberInput para números */}
                <TextInput source="title" label="Título" validate={[required()]} />
                <TextInput source="description" label="Descrição" validate={[required()]} />
            </SimpleForm>
        </Create>
    )
}