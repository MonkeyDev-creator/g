import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { insertOrderSchema, type InsertOrder } from "@shared/schema";
import { useCreateOrder } from "@/hooks/use-orders";
import { useUpload } from "@/hooks/use-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, UploadCloud, CheckCircle2 } from "lucide-react";

export default function Order() {
  const [, setLocation] = useLocation();
  const createOrder = useCreateOrder();
  const { uploadFile, isUploading: isFileUploading, progress: uploadProgress } = useUpload();
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const form = useForm<InsertOrder>({
    resolver: zodResolver(insertOrderSchema),
    defaultValues: {
      email: "",
      discordUser: "",
      robloxUser: "",
      gfxType: "Thumbnail",
      details: "",
      imageUrl: "",
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const response = await uploadFile(file);
      if (response) {
        // Construct the full URL if response.uploadURL is signed URL
        // However, useUpload returns { uploadURL, objectPath }
        // We probably want to store the public URL or the object path
        // Assuming we can reconstruct or store the path
        // For simplicity in this demo, let's assume we store the objectPath to be safe, 
        // or a public URL if your backend serves it.
        // Based on routes.ts: GET /objects/:objectPath(*) serves files.
        // So the URL is: /objects/uploads/uuid
        
        const publicUrl = `/objects${response.objectPath}`;
        setUploadedUrl(publicUrl);
        form.setValue("imageUrl", publicUrl);
      }
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const onSubmit = (data: InsertOrder) => {
    createOrder.mutate(data, {
      onSuccess: () => {
        setLocation("/tracking");
      },
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-background text-foreground">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-10">
            <h1 className="font-display text-4xl font-bold mb-4">Place Your Order</h1>
            <p className="text-muted-foreground">
              Fill out the details below to get your custom GFX.
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl border border-white/5">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                {/* Personal Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} className="bg-background/50 border-white/10 focus:border-primary/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="discordUser"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discord Username</FormLabel>
                        <FormControl>
                          <Input placeholder="username#0000" {...field} className="bg-background/50 border-white/10 focus:border-primary/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="robloxUser"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Roblox Username</FormLabel>
                        <FormControl>
                          <Input placeholder="RobloxPlayer123" {...field} className="bg-background/50 border-white/10 focus:border-primary/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gfxType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GFX Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background/50 border-white/10 focus:ring-primary/20">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Thumbnail">Game Thumbnail</SelectItem>
                            <SelectItem value="Icon">Game Icon</SelectItem>
                            <SelectItem value="Ad">Advertisement</SelectItem>
                            <SelectItem value="Banner">Profile Banner</SelectItem>
                            <SelectItem value="Render">Character Render</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order Details</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe exactly what you want (poses, lighting, theme, text...)" 
                          className="bg-background/50 border-white/10 focus:border-primary/50 min-h-[120px]" 
                          {...field} 
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Be as specific as possible to get the best result.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* File Upload Section */}
                <div className="space-y-2">
                  <FormLabel>Reference Image (Optional)</FormLabel>
                  <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:bg-white/5 transition-colors relative group">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      disabled={isFileUploading}
                    />
                    <div className="flex flex-col items-center justify-center space-y-2">
                      {isFileUploading ? (
                        <>
                          <Loader2 className="w-10 h-10 text-primary animate-spin" />
                          <p className="text-sm font-medium">Uploading... {Math.round(uploadProgress)}%</p>
                        </>
                      ) : uploadedUrl ? (
                        <>
                          <CheckCircle2 className="w-10 h-10 text-green-500" />
                          <p className="text-sm font-medium text-green-500">Image Uploaded Successfully</p>
                          <p className="text-xs text-muted-foreground break-all max-w-xs">{uploadedUrl.split('/').pop()}</p>
                        </>
                      ) : (
                        <>
                          <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                            <UploadCloud className="w-6 h-6 text-primary" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Click to upload or drag and drop</p>
                            <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={createOrder.isPending || isFileUploading}
                  className="w-full h-12 text-lg rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 font-bold tracking-wide"
                >
                  {createOrder.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting Order...
                    </>
                  ) : (
                    "Submit Order"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
