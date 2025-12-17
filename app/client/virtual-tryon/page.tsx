"use client";

import { useState, useRef } from "react";
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
  const [personImage, setPersonImage] = useState<File | null>(null);
  const [garmentImage, setGarmentImage] = useState<File | null>(null);
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
      toast.error("Vui lòng chọn file ảnh hợp lệ");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Kích thước ảnh phải nhỏ hơn 10MB");
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
      toast.error("Vui lòng chọn file ảnh hợp lệ");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Kích thước ảnh phải nhỏ hơn 10MB");
      return;
    }

    setGarmentImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setGarmentPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleVirtualTryOn = async () => {
    if (!personImage || !garmentImage) {
      toast.error("Vui lòng upload cả ảnh người và ảnh quần áo");
      return;
    }

    setIsProcessing(true);
    setResultImage("");

    try {
      const formData = new FormData();
      formData.append('person_image', personImage);
      formData.append('garment_image', garmentImage);
      formData.append('garment_description', garmentDescription);
      formData.append('denoise_steps', denoiseSteps.toString());
      formData.append('seed', seed.toString());

      const response = await fetch('/api/virtual-tryon', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Có lỗi xảy ra khi xử lý');
      }

      const result = await response.json();
      
      if (result.success && result.data && result.data[0]) {
        // Result image is in data[0]
        setResultImage(result.data[0]);
        toast.success("Thử đồ ảo thành công!");
      } else {
        throw new Error('Không nhận được kết quả từ API');
      }

    } catch (error: any) {
      console.error('Virtual try-on error:', error);
      toast.error("Có lỗi xảy ra", {
        description: error.message || "Vui lòng thử lại sau"
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
              Trợ lý Thử Đồ Ảo
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Trải nghiệm công nghệ AI thử đồ ảo. Upload ảnh của bạn và ảnh quần áo để xem kết quả ngay lập tức!
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
                      Ảnh của bạn
                    </CardTitle>
                    <CardDescription>
                      Upload ảnh toàn thân, đứng thẳng, nền đơn giản
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
                          Click để chọn ảnh
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
                      Ảnh quần áo
                    </CardTitle>
                    <CardDescription>
                      Upload ảnh quần áo, nền trắng hoặc trong suốt tốt nhất
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
                          Click để chọn ảnh
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
                  <CardTitle>Cài đặt nâng cao</CardTitle>
                  <CardDescription>
                    Tùy chỉnh chất lượng và kết quả xử lý
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="description">Mô tả quần áo (tùy chọn)</Label>
                    <Input
                      id="description"
                      placeholder="Ví dụ: Áo sơ mi trắng, Váy hoa..."
                      value={garmentDescription}
                      onChange={(e) => setGarmentDescription(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>
                      Denoise Steps: {denoiseSteps}
                      <span className="text-xs text-muted-foreground ml-2">
                        (Ít = nhanh, Nhiều = chất lượng cao)
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
                      disabled={!personImage || !garmentImage || isProcessing}
                      className="flex-1"
                      size="lg"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" />
                          Thử đồ ngay
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={clearAll}
                      variant="outline"
                      disabled={isProcessing}
                    >
                      Làm mới
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Result Section */}
            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Kết quả</CardTitle>
                  <CardDescription>
                    {resultImage ? "Ảnh thử đồ của bạn" : "Kết quả sẽ hiển thị ở đây"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isProcessing ? (
                    <div className="aspect-[3/4] rounded-lg bg-muted flex items-center justify-center">
                      <div className="text-center">
                        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
                        <p className="text-sm text-muted-foreground">
                          Đang xử lý... (20-40 giây)
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
                        Tải xuống ảnh
                      </Button>
                    </div>
                  ) : (
                    <div className="aspect-[3/4] rounded-lg bg-muted flex items-center justify-center">
                      <div className="text-center">
                        <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Chưa có kết quả
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
              <CardTitle>💡 Hướng dẫn sử dụng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">1. Upload ảnh người</h3>
                  <p className="text-sm text-muted-foreground">
                    Chọn ảnh toàn thân, đứng thẳng, nền đơn giản. Ảnh rõ nét sẽ cho kết quả tốt hơn.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">2. Upload ảnh quần áo</h3>
                  <p className="text-sm text-muted-foreground">
                    Chọn ảnh quần áo nền trắng hoặc trong suốt. Tránh ảnh người mặc sẵn.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">3. Nhận kết quả</h3>
                  <p className="text-sm text-muted-foreground">
                    Click "Thử đồ ngay" và đợi 20-40 giây. Bạn có thể tải xuống kết quả.
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
