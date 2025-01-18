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

  // Allow all origins
  response.headers.set('Access-Control-Allow-Origin', '*');  // Public access
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Allowed methods
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type'); // Allowed headers

  return response;
}
