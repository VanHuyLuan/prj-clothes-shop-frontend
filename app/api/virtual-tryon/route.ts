import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const personImage = formData.get('person_image') as File;
    const garmentImage = formData.get('garment_image') as File;
    const garmentImageUrl = formData.get('garment_image_url') as string;
    const category = formData.get('category') as string || 'Upper-body';
    const denoiseSteps = formData.get('denoise_steps') as string;
    const seed = formData.get('seed') as string;

    if (!personImage) {
      return NextResponse.json({ error: 'Missing person image' }, { status: 400 });
    }

    // Kiểm tra xem có garment image hoặc garment image URL
    if (!garmentImage && !garmentImageUrl) {
      return NextResponse.json({ error: 'Missing garment image or garment image URL' }, { status: 400 });
    }

    // Backend API hiện tại chỉ hỗ trợ garmentImageUrl (string URL)
    // Nếu user upload file từ local, cần endpoint khác hoặc xử lý upload trước
    if (garmentImage && !garmentImageUrl) {
      return NextResponse.json({ 
        error: 'Direct garment file upload not supported', 
        details: 'Please use product images from the catalog. Upload feature requires backend support for file upload.' 
      }, { status: 400 });
    }

    // Tạo FormData để gửi đến backend
    const backendFormData = new FormData();
    backendFormData.append('personImage', personImage);
    backendFormData.append('garmentImageUrl', garmentImageUrl);
    
    backendFormData.append('category', category);
    
    if (denoiseSteps) {
      backendFormData.append('denoiseSteps', denoiseSteps);
    }
    
    if (seed) {
      backendFormData.append('seed', seed);
    }

    // Gọi API backend
    const response = await fetch(`${BACKEND_API_URL}/virtual-tryon/try-with-product`, {
      method: 'POST',
      body: backendFormData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { 
          error: 'Backend API error', 
          details: errorData.message || response.statusText 
        },
        { status: response.status }
      );
    }

    const result = await response.json();

    console.log('Backend API Result:', result);

    return NextResponse.json({
      success: result.success,
      outputImage: result.outputImage,
      message: result.message,
      requestId: result.requestId,
      processingTime: result.processingTime
    });

  } catch (error: any) {
    console.error('Virtual Try-on error:', error);
    
    return NextResponse.json(
      { 
        error: 'Virtual try-on failed', 
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}