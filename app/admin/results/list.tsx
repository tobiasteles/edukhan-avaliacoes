import { Datagrid, DateField, List, NumberField, TextField } from "react-admin";

export const ExamResultList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            
            {/* Agora mostramos a Prova e o Aluno */}
            <TextField source="examTitle" label="Prova" /> 
            <TextField source="studentName" label="Aluno" />

            <NumberField source="score" label="Pontuação" />
            <DateField source="createdAt" label="Início" showTime />
            <DateField source="completedAt" label="Finalizado em" showTime />
        </Datagrid>
    </List>
);