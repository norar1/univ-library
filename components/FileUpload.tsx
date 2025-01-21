"use client";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { IKImage, ImageKitProvider, IKUpload, IKVideo } from "imagekitio-next";
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
  type: "image" | "video";
  accept: string;
  placeholder: string;
  folder: string;
  variant: "dark" | "light";
  onFileChange: (filePath: string) => void;
  value?: string;
}

const ImageUpload = ({ accept, placeholder, folder, variant, type, onFileChange }: ImageUploadProps) => {
  const IKUploadRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<{ filePath: string } | null>(null);
  const [progress, setProgress] = useState(0);

  const styles = {
    button: variant === "dark" ? "bg-dark-300" : "bg-light-600 border-gray-100 border",
    placeholder: variant === "dark" ? "text-light-100" : "text-slate-500",
    text: variant === "dark" ? "text-light-100" : "text-dark-400",
  };

  const onError = (err: any) => {
    console.error("Upload Error:", err);
    toast({
      title: `${type} upload Failed`,
      description: `Your ${type} could not be uploaded. Please try again.`,
      variant: "destructive",
    });
  };

  const onSuccess = (res: { filePath?: string }) => {
    if (res.filePath) {
    
      onFileChange(res.filePath);
      toast({
        title: `${type} Uploaded Successfully`,
        description: `File uploaded: ${res.filePath}`,
      });
    }
  };

  const onValidate = (file: File) => {
    if (type === "image" && file.size > 20 * 1024 * 1024) {
      toast({
        title: "File size too large",
        description: "Please upload a file that is less than 20MB in size",
        variant: "destructive",
      });
      return false;
    } else if (type === "video" && file.size > 50 * 1024 * 1024) {
      toast({
        title: "File size too large",
        description: "Please upload a file that is less than 50MB in size",
        variant: "destructive",
      });
      return false;
    }
    return true;
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
          ref={IKUploadRef}
          onError={onError}
          onSuccess={onSuccess}
          useUniqueFileName={true}
          onUploadStart={() => setProgress(0)}
          onUploadProgress={({ loaded, total }) => {
            const percent = Math.round((loaded / total) * 100);
            setProgress(percent);
          }}
          folder={folder}
          accept={accept}
          className="hidden"
        />

        <button type="button" className={cn("upload-btn", styles.button)} onClick={triggerUpload}>
          <Image src="/icons/upload.svg" alt="upload-icon" width={20} height={20} className="object-contain" />
          <p className={cn("text-base", styles.placeholder)}>{placeholder}</p>
          {file && <p className={cn("upload-filename", styles.text)}>{file.filePath}</p>}
        </button>

        {progress > 0 && <div className="progress" style={{ width: `${progress}%` }}>{progress}%</div>}

        {file &&
          (type === "image" ? (
            <IKImage alt={file.filePath} path={file.filePath} width={500} height={500} />
          ) : (
            <IKVideo path={file.filePath} controls={true} className="h-96 w-full rounded-xl" />
          ))}
      </ImageKitProvider>
    </div>
  );
};

export default ImageUpload;
