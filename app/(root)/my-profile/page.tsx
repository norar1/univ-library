import BookList from "@/components/BookList";
import { Button } from "@/components/ui/button"
import { sampleBooks } from "@/constant";
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

    <BookList title="Borrowed Books" books={sampleBooks}/>
    </>
  )
}
export default page