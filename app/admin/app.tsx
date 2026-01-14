"use client";

import { Admin, Resource } from "react-admin";
import simpleRestProvider from 'ra-data-simple-rest';
import { StudentList } from "./student/list";

const dataProvider = simpleRestProvider("/api");

const App = () => {
    return (
        <Admin dataProvider={dataProvider}>
           <Resource
           name="students"
           list={StudentList}
           recordRepresentation="name"
           />
        </Admin>
        
    )
}

export default App;