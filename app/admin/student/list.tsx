import { Datagrid, List, TextField, FunctionField } from "react-admin";

interface StudentRecord {
    id: string | number;
    name: string;
    birthDate?: string;
    grade: number;
    schoolName: string;
    unit: string;
    city: string;
    state: string;
}

// 1. Criamos um mapeamento das séries
const gradeMapping: Record<number, string> = {
    1: "1º Ano EF",
    2: "2º Ano EF",
    3: "3º Ano EF",
    4: "4º Ano EF",
    5: "5º Ano EF",
    6: "6º Ano EF",
    7: "7º Ano EF",
    8: "8º Ano EF",
    9: "9º Ano EF",
    10: "1ª Série EM",
    11: "2ª Série EM",
    12: "3ª Série EM",
};

export const StudentList = () => {
    return (
        <List>
            <Datagrid rowClick="edit">
                <TextField source="name" label="Nome" />
                
                <FunctionField
                    label="Idade"
                    render={(record: StudentRecord) => {
                        if (!record?.birthDate) return "N/A";
                        const birthDate = new Date(record.birthDate);
                        const today = new Date();
                        let age = today.getFullYear() - birthDate.getFullYear();
                        const monthDiff = today.getMonth() - birthDate.getMonth();
                        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                            age--;
                        }
                        return `${age} anos`;
                    }}
                />

                {/* 2. Transformando o número da série em texto amigável */}
                <FunctionField
                    label="Série"
                    render={(record: StudentRecord) => {
                        return gradeMapping[record.grade] || `Série ${record.grade}`;
                    }}
                />

                <TextField source="schoolName" label="Escola" />
                <TextField source="unit" label="Unidade" />
                <TextField source="city" label="Cidade" />
                <TextField source="state" label="Estado" />
            </Datagrid>
        </List>
    );
};