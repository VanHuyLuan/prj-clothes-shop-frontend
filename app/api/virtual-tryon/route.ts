import { NextRequest, NextResponse } from 'next/server';
import { Client, handle_file } from "@gradio/client";
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

const HF_TOKEN = process.env.HUGGINGFACE_TOKEN;
const SPACE_NAME = "yisol/IDM-VTON"; 

export async function POST(request: NextRequest) {
  let personTempPath: string | null = null;
  let garmentTempPath: string | null = null;

  try {
    const formData = await request.formData();
    const personImage = formData.get('person_image') as File;
    const garmentImage = formData.get('garment_image') as File;
    const garmentDescription = formData.get('garment_description') as string || 'Virtual try-on';
    const denoiseSteps = parseInt(formData.get('denoise_steps') as string) || 30;
    const seed = parseInt(formData.get('seed') as string) || 42;

    if (!personImage || !garmentImage) {
      return NextResponse.json({ error: 'Missing required images' }, { status: 400 });
    }

    // Save files temporarily to disk (required for handle_file)
    const personBuffer = Buffer.from(await personImage.arrayBuffer());
    const garmentBuffer = Buffer.from(await garmentImage.arrayBuffer());
    
    personTempPath = join(tmpdir(), `person_${Date.now()}.${personImage.type.split('/')[1]}`);
    garmentTempPath = join(tmpdir(), `garment_${Date.now()}.${garmentImage.type.split('/')[1]}`);
    
    await writeFile(personTempPath, personBuffer);
    await writeFile(garmentTempPath, garmentBuffer);

    // Initialize Gradio Client (yisol/IDM-VTON is a public space, no token needed)
    const client = await Client.connect(SPACE_NAME);

    // Call API with correct format according to HuggingFace docs
    const result = await client.predict("/tryon", {
      dict: {
        background: handle_file(personTempPath),
        layers: [],
        composite: null
      },
      garm_img: handle_file(garmentTempPath),
      garment_des: garmentDescription,
      is_checked: true,
      is_checked_crop: false,
      denoise_steps: denoiseSteps,
      seed: seed
    });

    // Clean up temp files
    try {
      const fs = require('fs');
      if (personTempPath && fs.existsSync(personTempPath)) fs.unlinkSync(personTempPath);
      if (garmentTempPath && fs.existsSync(garmentTempPath)) fs.unlinkSync(garmentTempPath);
    } catch (cleanupError) {
      console.error('Cleanup error:', cleanupError);
    }

    // Return result - result.data is tuple [output_image, masked_image]
    // Extract URL from response (can be string or object)
    const extractUrl = (data: any): string => {
      if (typeof data === 'string') return data;
      if (data?.url) return data.url;
      if (data?.path) return data.path;
      return data;
    };

    const outputImageUrl = extractUrl((result.data as any[])[0]);
    const maskedImageUrl = extractUrl((result.data as any[])[1]);

    console.log('API Result:', { 
      raw: result.data,
      outputImageUrl, 
      maskedImageUrl 
    });

    return NextResponse.json({
      success: true,
      data: [outputImageUrl, maskedImageUrl],
      message: 'Virtual try-on completed successfully'
    });

  } catch (error: any) {
    console.error('Virtual Try-on error:', error);
    
    // Clean up temp files on error
    try {
      const fs = require('fs');
      if (personTempPath && fs.existsSync(personTempPath)) fs.unlinkSync(personTempPath);
      if (garmentTempPath && fs.existsSync(garmentTempPath)) fs.unlinkSync(garmentTempPath);
    } catch (cleanupError) {
      console.error('Cleanup error:', cleanupError);
    }
    
    return NextResponse.json(
      { 
        error: 'HuggingFace API error', 
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}