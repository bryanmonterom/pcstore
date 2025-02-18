//.d standard name for type definitions
import { DefaultSession } from "next-auth";

//extending user to add role and include all the properties in DefaultSession
declare module 'next-auth'{
    export interface Session {
        user:{
            role:string
        } & DefaultSession['user']
    }
}
