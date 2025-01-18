"use client";
import { toast } from "@/hooks/use-toast";
import { IKImage, ImageKitProvider, IKUpload } from "imagekitio-next";
import Image from "next/image";
import { useRef, useState } from "react";

const authenticator = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/imagekit`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    return {
      signature: data.signature,
      expire: data.expire,
      token: data.token,
    };
  } catch (e: any) {
    throw new Error(`Authentication request failed: ${e.message}`);
  }
};

interface ImageUploadProps {
  onFileChange: (filePath: string) => void;
}

const ImageUpload = ({ onFileChange }: ImageUploadProps) => {
  const IKUploadRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<{ filePath: string } | null>(null);

  const onError = (err: any) => {
    console.error("Upload Error:", err);
    toast({
      title: "Image Failed",
      description: "Your image could not be uploaded. Please try again.",
      variant: "destructive",
    });
  };

  const onSuccess = (res: { filePath: string }) => {
    setFile(res);
    onFileChange(res.filePath);
    toast({
      title: "Image Uploaded Successfully",
      description: `File uploaded: ${res.filePath}`,
    });
  };

  const triggerUpload = () => {
    IKUploadRef.current?.click();
  };

  return (
    <div>
      <ImageKitProvider
        publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_KEY}
        urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!}
        authenticator={authenticator}
      >
        <IKUpload
          className="hidden"
          ref={IKUploadRef}
          onError={onError}
          onSuccess={onSuccess}
          fileName="test-upload.png"
        />

        <button
          type="button"
          className="upload-btn flex items-center"
          onClick={triggerUpload}
        >
          <Image
            src="/icons/upload.svg"
            alt="upload-icon"
            width={20}
            height={20}
            className="object-contain"
          />
          <p className="text-base text-light-100 ml-2">Upload a File</p>
        </button>

        {file && file.filePath && (
          <>
            <p className="upload-filename mt-2">Uploaded: {file.filePath}</p>
            <IKImage
              alt={file.filePath}
              path={file.filePath}
              width={500}
              height={500}
            />
          </>
        )}
      </ImageKitProvider>
    </div>
  );
};

export default ImageUpload;
