import {  
    required, 
    SimpleForm, 
    TextInput,  // Importe o TextInput
    Edit
} from "react-admin";

export const ExamEdit = () => {
    return (
        <Edit>
            <SimpleForm>
                {/* Use TextInput para textos e NumberInput para números */}
                <TextInput source="title" label="Título" validate={[required()]} />
                <TextInput source="description" label="Descrição" validate={[required()]} />
            </SimpleForm>
        </Edit>
    )
}