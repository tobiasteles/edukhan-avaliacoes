import {  
    required, 
    SimpleForm, 
    TextInput,    // Importe o TextInput
    NumberInput,   // Importe o NumberInput para campos numéricos
    Edit
} from "react-admin";

export const StudentEdit = () => {
    return (
        <Edit>
            <SimpleForm>
                {/* Use TextInput para textos e NumberInput para números */}
                <TextInput source="userId" label="ID do Usuário (Clerk ID)" validate={[required()]} />
                <TextInput source="name" label="Nome" validate={[required()]} />
                <NumberInput source="age" label="Idade" validate={[required()]} />
                <TextInput source="grade" label="Série" validate={[required()]} />
                <TextInput source="schoolName" label="Escola" validate={[required()]} />
                <TextInput source="unit" label="Unidade" validate={[required()]} />
                <TextInput source="city" label="Cidade" validate={[required()]} />
                <TextInput source="state" label="Estado" />
            </SimpleForm>
        </Edit>
    )
}