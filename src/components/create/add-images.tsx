import { MAX_IMAGES_UPLOAD } from "@/contants";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Upload } from "lucide-react";
import * as React from "react";
import { useDropzone } from "react-dropzone";
import Cropper, { Area } from "react-easy-crop";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { FormProps } from "./form-post";

export default function ImageUploader({ form }: FormProps) {
  const { toast } = useToast();
  const [currentImageUrl, setCurrentImageUrl] = React.useState("");
  const [cropModalOpen, setCropModalOpen] = React.useState(false);
  const [imageToEdit, setImageToEdit] = React.useState<string | null>(null);
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<Area | null>(
    null
  );

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageToEdit(reader.result as string);
        setCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif"] },
    maxFiles: 1,
  });

  const createCroppedImage = async () => {
    try {
      if (!imageToEdit || !croppedAreaPixels) {
        toast({
          title: "Error",
          description: "No image selected or cropping failed.",
          variant: "destructive",
        });
        return;
      }
      const image = new Image();
      image.src = imageToEdit;
      image.crossOrigin = "anonymous";

      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context is not available.");

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      const croppedImage = canvas.toDataURL("image/jpeg");
      const images = form.getValues("images");
      form.setValue("images", [...images, { url: croppedImage }]);
      setCropModalOpen(false);
      setImageToEdit(null);
      setCurrentImageUrl("");
    } catch (error) {
      setCropModalOpen(false);
      setImageToEdit(null);
      setCurrentImageUrl("");
      console.error("Error creating cropped image:", error);
      toast({
        title: "Error",
        description: "Failed to crop the image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addImageFromUrl = () => {
    if (currentImageUrl) {
      setImageToEdit(currentImageUrl);
      setCropModalOpen(true);
    }
  };

  const images = form.watch("images");
  const canAddMoreImages = images.length < MAX_IMAGES_UPLOAD;

  return (
    <>
      <FormField
        control={form.control}
        name="images"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Images</FormLabel>
            <FormDescription>
              Add up to {MAX_IMAGES_UPLOAD} images. Images will be cropped to a
              square format.
            </FormDescription>
            {canAddMoreImages && (
              <div className="space-y-4">
                <div
                  {...getRootProps()}
                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer"
                >
                  <input {...getInputProps()} />
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Drag & drop an image here, or click to select
                  </p>
                </div>
                <Separator className="my-4" />
                <div className="flex gap-2">
                  <Input
                    placeholder="Paste image URL"
                    value={currentImageUrl}
                    onChange={(e) => setCurrentImageUrl(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={addImageFromUrl}
                    disabled={!currentImageUrl}
                  >
                    <Plus />
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setCurrentImageUrl("")}
                    disabled={!currentImageUrl}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-3 mt-4">
              {field.value.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg border overflow-hidden group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt={`Image ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
                    <div
                      className="text-red-500 text-sm cursor-pointer"
                      onClick={() => {
                        const images = [...field.value];
                        images.splice(index, 1);
                        form.setValue("images", images);
                      }}
                    >
                      <Trash2 />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <Dialog open={cropModalOpen} onOpenChange={setCropModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
          </DialogHeader>
          {imageToEdit && (
            <div className="relative w-full h-[300px]">
              <Cropper
                image={imageToEdit}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, croppedAreaPixels) =>
                  setCroppedAreaPixels(croppedAreaPixels)
                }
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setCropModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createCroppedImage}>Crop & Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
