"use client";

import { Admin, Resource } from "react-admin";
import simpleRestProvider from 'ra-data-simple-rest';
import { StudentList } from "./student/list";
import { StudentCreate } from "./student/create";
import { StudentEdit } from "./student/edit";
import { ExamList } from "./exams/list";
import { ExamCreate } from "./exams/create";
import { ExamEdit } from "./exams/edit";
import { QuestionList } from "./questions/list";
import { QuestionEdit } from "./questions/edit";
import { QuestionCreate } from "./questions/create";
import { OptionList } from "./question_options/list";
import { OptionCreate } from "./question_options/create";
import { OptionEdit } from "./question_options/edit";
import { ExamResultList } from "./results/list";
import { ExamResultCreate } from "./results/create";
import { ExamResultEdit } from "./results/edit";
import { AnnouncementList } from "./announcements/list";
import { AnnouncementCreate } from "./announcements/create";
import { AnnouncementEdit } from "./announcements/edit";

const dataProvider = simpleRestProvider("/api");

const App = () => {
    return (
        <Admin dataProvider={dataProvider}>
           <Resource
           name="students"
           list={StudentList}
           create={StudentCreate}
           edit={StudentEdit}
           recordRepresentation="name"
           />
           <Resource
           name="exams"
           list={ExamList}
           create={ExamCreate}
           edit={ExamEdit}
           recordRepresentation="name"
           />
           <Resource
           name="questions"
           list={QuestionList}
           create={QuestionCreate}
           edit={QuestionEdit}
           recordRepresentation="name"
           />
           <Resource
           name="question_options"
           list={OptionList}
           create={OptionCreate}
           edit={OptionEdit}
           recordRepresentation="name"
           />
           <Resource
           name="exam_results"
           list={ExamResultList}
           create={ExamResultCreate}
           edit={ExamResultEdit}
           recordRepresentation="name"
           />
           <Resource
           name="announcements"
           list={AnnouncementList}
           create={AnnouncementCreate}
           edit={AnnouncementEdit}
           recordRepresentation="name"
           />
        </Admin>
        
    )
}

export default App;