"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/client/layout/header";
import { Footer } from "@/components/client/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Upload, Sparkles, Loader2, Image as ImageIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export default function VirtualTryOnPage() {
  const searchParams = useSearchParams();
  const [personImage, setPersonImage] = useState<File | null>(null);
  const [garmentImage, setGarmentImage] = useState<File | null>(null);
  const [garmentImageUrl, setGarmentImageUrl] = useState<string>(""); // URL from product page
  const [personPreview, setPersonPreview] = useState<string>("");
  const [garmentPreview, setGarmentPreview] = useState<string>("");
  const [resultImage, setResultImage] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [garmentDescription, setGarmentDescription] = useState("Virtual try-on");
  const [denoiseSteps, setDenoiseSteps] = useState(20);
  const [seed, setSeed] = useState(42);

  const personInputRef = useRef<HTMLInputElement>(null);
  const garmentInputRef = useRef<HTMLInputElement>(null);

  const handlePersonImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be less than 10MB");
      return;
    }

    setPersonImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPersonPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGarmentImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be less than 10MB");
      return;
    }

    setGarmentImage(file);
    setGarmentImageUrl(""); // Clear URL when uploading a new file
    const reader = new FileReader();
    reader.onloadend = () => {
      setGarmentPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Load garment from URL params if provided (from product pages)
  useEffect(() => {
    const garmentUrl = searchParams.get('garment');
    const garmentName = searchParams.get('name');
    
    console.log('🔍 Debug - garmentUrl from URL params:', garmentUrl);
    
    if (garmentUrl) {
      const loadGarmentFromUrl = async () => {
        try {
          const decodedUrl = decodeURIComponent(garmentUrl);
          console.log('✅ Decoded URL:', decodedUrl);
          setGarmentPreview(decodedUrl);
          setGarmentImageUrl(decodedUrl); // Store URL to send to backend
          setGarmentImage(null); // Clear any existing file
          if (garmentName) {
            setGarmentDescription(decodeURIComponent(garmentName));
          }

          // No need to convert to File; send URL directly
          toast.success("Garment loaded from product page!");
        } catch (error) {
          console.error("Failed to load garment from URL:", error);
          toast.error("Could not load garment image");
        }
      };
      
      loadGarmentFromUrl();
    }
  }, [searchParams]);

  const handleVirtualTryOn = async () => {
    console.log('🔍 Debug - States:', {
      hasPersonImage: !!personImage,
      hasGarmentImage: !!garmentImage,
      garmentImageUrl: garmentImageUrl,
      garmentImageUrlLength: garmentImageUrl?.length
    });

    if (!personImage) {
      toast.error("Please upload a photo of yourself");
      return;
    }

    if (!garmentImage && (!garmentImageUrl || garmentImageUrl.trim() === '')) {
      toast.error("Please select a garment from the product page or upload an image");
      return;
    }

    setIsProcessing(true);
    setResultImage("");

    try {
      const formData = new FormData();
      formData.append('person_image', personImage);
      
      // Prefer sending URL if available (from product page)
      if (garmentImageUrl) {
        formData.append('garment_image_url', garmentImageUrl);
      } else if (garmentImage) {
        formData.append('garment_image', garmentImage);
      }
      
      formData.append('category', 'Upper-body'); // Default category
      formData.append('denoise_steps', denoiseSteps.toString());
      formData.append('seed', seed.toString());

      const response = await fetch('/api/virtual-tryon', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'An error occurred during processing');
      }

      const result = await response.json();
      
      if (result.success && result.outputImage) {
        // New backend response format
        setResultImage(result.outputImage);
        toast.success(result.message || "Virtual try-on successful!");
      } else if (result.success && result.data && result.data[0]) {
        // Legacy format fallback
        setResultImage(result.data[0]);
        toast.success("Virtual try-on successful!");
      } else {
        throw new Error('No result received from API');
      }

    } catch (error: any) {
      console.error('Virtual try-on error:', error);
      toast.error("An error occurred", {
        description: error.message || "Please try again later"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const clearPersonImage = () => {
    setPersonImage(null);
    setPersonPreview("");
    if (personInputRef.current) {
      personInputRef.current.value = "";
    }
  };

  const clearGarmentImage = () => {
    setGarmentImage(null);
    setGarmentPreview("");
    if (garmentInputRef.current) {
      garmentInputRef.current.value = "";
    }
  };

  const clearAll = () => {
    clearPersonImage();
    clearGarmentImage();
    setResultImage("");
    setGarmentDescription("Virtual try-on");
    setDenoiseSteps(20);
    setSeed(42);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-12 bg-gradient-to-b from-muted/30 to-background">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Virtual Try-On Assistant
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience AI-powered virtual try-on technology. Upload your photo and a garment image to see the result instantly!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upload Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Person Image Upload */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      Your photo
                    </CardTitle>
                    <CardDescription>
                      Upload a full-body photo, standing straight, with a plain background
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!personPreview ? (
                      <div
                        onClick={() => personInputRef.current?.click()}
                        className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                      >
                        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Click to select an image
                        </p>
                        <p className="text-xs text-muted-foreground">
                          JPEG, PNG (Max 10MB)
                        </p>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={personPreview}
                          alt="Person preview"
                          className="w-full h-80 object-cover rounded-lg"
                        />
                        <Button
                          onClick={clearPersonImage}
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <input
                      ref={personInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePersonImageChange}
                      className="hidden"
                    />
                  </CardContent>
                </Card>

                {/* Garment Image Upload */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      Garment image
                    </CardTitle>
                    <CardDescription>
                      Select a garment from the <a href="/client/women" className="text-primary hover:underline">product page</a> to try on (file upload not yet supported)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!garmentPreview ? (
                      <div
                        onClick={() => garmentInputRef.current?.click()}
                        className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                      >
                        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Click to select an image
                        </p>
                        <p className="text-xs text-muted-foreground">
                          JPEG, PNG (Max 10MB)
                        </p>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={garmentPreview}
                          alt="Garment preview"
                          className="w-full h-80 object-cover rounded-lg"
                        />
                        <Button
                          onClick={clearGarmentImage}
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <input
                      ref={garmentInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleGarmentImageChange}
                      className="hidden"
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Settings Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Advanced settings</CardTitle>
                  <CardDescription>
                    Customize quality and processing output
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="description">Garment description (optional)</Label>
                    <Input
                      id="description"
                      placeholder="e.g. White shirt, floral dress..."
                      value={garmentDescription}
                      onChange={(e) => setGarmentDescription(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>
                      Denoise Steps: {denoiseSteps}
                      <span className="text-xs text-muted-foreground ml-2">
                        (Less = faster, More = higher quality)
                      </span>
                    </Label>
                    <Slider
                      value={[denoiseSteps]}
                      onValueChange={(value) => setDenoiseSteps(value[0])}
                      min={10}
                      max={50}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="seed">Random Seed</Label>
                    <Input
                      id="seed"
                      type="number"
                      value={seed}
                      onChange={(e) => setSeed(parseInt(e.target.value) || 42)}
                      className="mt-2"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={handleVirtualTryOn}
                      disabled={!personImage || (!garmentImage && !garmentImageUrl) || isProcessing}
                      className="flex-1"
                      size="lg"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" />
                          Try it on
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={clearAll}
                      variant="outline"
                      disabled={isProcessing}
                    >
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Result Section */}
            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Result</CardTitle>
                  <CardDescription>
                    {resultImage ? "Your try-on photo" : "Result will appear here"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isProcessing ? (
                    <div className="aspect-[3/4] rounded-lg bg-muted flex items-center justify-center">
                      <div className="text-center">
                        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
                        <p className="text-sm text-muted-foreground">
                          Processing... (20-40 seconds)
                        </p>
                      </div>
                    </div>
                  ) : resultImage ? (
                    <div className="space-y-4">
                      <img
                        src={resultImage}
                        alt="Virtual try-on result"
                        className="w-full rounded-lg"
                      />
                      <Button
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = resultImage;
                          link.download = 'virtual-tryon-result.jpg';
                          link.click();
                        }}
                        variant="outline"
                        className="w-full"
                      >
                        Download image
                      </Button>
                    </div>
                  ) : (
                    <div className="aspect-[3/4] rounded-lg bg-muted flex items-center justify-center">
                      <div className="text-center">
                        <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          No result yet
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Guide Section */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle>💡 How to use</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">1. Upload your photo</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a full-body photo, standing straight, with a plain background. A clear photo gives better results.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">2. Upload garment image</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a garment image with a white or transparent background. Avoid photos of people wearing it.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">3. Get the result</h3>
                  <p className="text-sm text-muted-foreground">
                    Click &quot;Try it on&quot; and wait 20-40 seconds. You can download the result.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
