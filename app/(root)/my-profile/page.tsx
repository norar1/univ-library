import BookList from "@/components/BookList";
import { Button } from "@/components/ui/button"

import { signOut } from "@/auth";

const page = () => {
  return (
    <>
    <form action={async () => {
        'use server';
        await signOut();
        
    }} className="mb-10">
        <Button>Logout</Button>
    </form>


    </>
  )
}
export default page