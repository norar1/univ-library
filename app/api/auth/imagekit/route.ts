import config from "@/lib/config";
import ImageKit from "imagekit";
import { NextResponse } from "next/server";

const {
  env: {
    imagekit: { publicKey, privateKey, urlEndpoint },
  },
} = config;

const imagekit = new ImageKit({
  publicKey,
  privateKey,
  urlEndpoint,
});

export async function GET() {
  const response = NextResponse.json(imagekit.getAuthenticationParameters());
  
  // Add CORS headers
  response.headers.set('Access-Control-Allow-Origin', 'https://univ-library-v8bi.vercel.app'); // Allow your deployed domain
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Specify allowed methods
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type'); // Specify allowed headers
  
  return response;
}
