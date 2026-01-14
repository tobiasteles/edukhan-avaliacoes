import { 
    Create, 
    NumberInput, 
    ReferenceInput, 
    required, 
    SelectInput, 
    SimpleForm, 
    TextInput,    // Importe o TextInput
    // Importe o NumberInput para campos numéricos
} from "react-admin";

export const QuestionCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput 
                source="content" 
                validate={[required()]} 
                label="Enunciado da Questão" 
                fullWidth 
                multiline 
            />
            <SelectInput
                label="Tipo da questão"
                source="type"
                choices={[
                    { id: "multiple_choice", name: "Múltipla Escolha" },
                    { id: "assist", name: "Assistida" }
                ]}
                validate={[required()]}
            />
            {/* Seleciona o Exame de uma lista vinda do banco */}
            <ReferenceInput source="examId" reference="exams" label="Vincular ao Exame">
                <SelectInput optionText="title" validate={[required()]} />
            </ReferenceInput>
            <NumberInput source="order" validate={[required()]} label="Ordem de exibição" />
        </SimpleForm>
    </Create>
);