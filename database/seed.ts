import ImageKit from 'imagekit'
import dummbyBooks from '../dummybooks.json'

import { books } from './schema'
import { drizzle } from 'drizzle-orm/neon-http';
import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';

config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });

const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_KEY!,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
});

const uploadToImageKit = async (url: string, fileName: string, folder: string) => {
    try {
        const response = await imagekit.upload({
            file: url,
            fileName,
            folder,
        });

        return response.filePath;
    } catch (e) {
        console.error("Error uploading to ImageKit:", e);
        throw e;
    }
};

const seed = async () => {
    console.log('Seeding data...');

    try {
        for (const book of dummbyBooks) {
            const coverUrl = await uploadToImageKit(book.coverUrl, `${book.title}.jpeg`, "/books/covers");
            const videoUrl = await uploadToImageKit(book.videoUrl, `${book.title}.mp4`, "/books/videos");

            await db.insert(books).values({
                ...book,
                coverUrl: coverUrl,
                videoUrl: videoUrl,

            });
        }

        console.log("Data seeded successfully!");
    } catch (e) {
        console.error("Error seeding data:", e);
    }
};

seed();
