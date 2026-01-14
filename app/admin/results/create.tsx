import { 
    Create, 
    NumberInput, 
    ReferenceInput, 
    SelectInput, 
    SimpleForm, 
    // Importe o NumberInput para campos numéricos
} from "react-admin";

export const ExamResultCreate = () => (
    <Create>
        <SimpleForm>
            <ReferenceInput source="examAttemptId" reference="exam_attempts" label="Tentativa">
                <SelectInput optionText="id" />
            </ReferenceInput>
            <NumberInput source="score" label="Pontuação" />
        </SimpleForm>
    </Create>
);