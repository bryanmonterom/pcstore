import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";

export const metadata : Metadata = {
    title: 'Unauthorized Access'
}

const AuthorizedPage = () => {
    return ( <div className="container mx-auto flex flex-col items-center justify-center space-y-4 h-[calc(100vh-200px)]">
    <h1 className="h1-bold">
        Unauthorized Access
    </h1>
    <p>You do not have permissions to access this page</p>
        <Button asChild>
            <Link href='/'>Return home</Link>
        </Button>
    </div> );
}
 
export default AuthorizedPage;