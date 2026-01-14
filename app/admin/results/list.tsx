import { Datagrid, DateField, List, NumberField, ReferenceField, TextField } from "react-admin";

export const ExamResultList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            
            {/* Buscamos o Aluno através da tentativa (examAttempt) */}
            <ReferenceField source="examAttemptId" reference="exam_attempts" label="Aluno">
                <ReferenceField source="userId" reference="students" label="Nome">
                    <TextField source="name" />
                </ReferenceField>
            </ReferenceField>

            <NumberField source="score" label="Pontuação" />
            <DateField source="createdAt" label="Início" showTime />
            <DateField source="completedAt" label="Finalizado em" showTime />
        </Datagrid>
    </List>
);