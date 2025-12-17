import { NextRequest, NextResponse } from 'next/server';

const HF_TOKEN = process.env.HUGGINGFACE_TOKEN;
const API_URL = 'https://yisol-idm-vton.hf.space/api/predict';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const personImage = formData.get('person_image') as File;
    const garmentImage = formData.get('garment_image') as File;
    const garmentDescription = formData.get('garment_description') as string || 'Virtual try-on';
    const denoiseSteps = parseInt(formData.get('denoise_steps') as string) || 20;
    const seed = parseInt(formData.get('seed') as string) || 42;

    if (!personImage || !garmentImage) {
      return NextResponse.json(
        { error: 'Missing required images' },
        { status: 400 }
      );
    }

    if (!HF_TOKEN) {
      return NextResponse.json(
        { error: 'HuggingFace token not configured' },
        { status: 500 }
      );
    }

    // Convert files to base64 for API
    const personBuffer = await personImage.arrayBuffer();
    const garmentBuffer = await garmentImage.arrayBuffer();
    
    const personBase64 = Buffer.from(personBuffer).toString('base64');
    const garmentBase64 = Buffer.from(garmentBuffer).toString('base64');

    // Call HuggingFace API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HF_TOKEN}`,
      },
      body: JSON.stringify({
        data: [
          {
            background: `data:${personImage.type};base64,${personBase64}`,
            layers: [],
            composite: null
          },
          `data:${garmentImage.type};base64,${garmentBase64}`,
          garmentDescription,
          true, // is_checked
          false, // is_checked_crop
          denoiseSteps,
          seed
        ]
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('HuggingFace API error:', error);
      return NextResponse.json(
        { error: 'Virtual try-on API error', details: error },
        { status: response.status }
      );
    }

    const result = await response.json();
    
    // Return the result image
    return NextResponse.json({
      success: true,
      data: result.data,
      message: 'Virtual try-on completed successfully'
    });

  } catch (error: any) {
    console.error('Virtual try-on error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
