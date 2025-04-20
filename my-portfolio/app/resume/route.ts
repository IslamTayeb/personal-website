import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Path to the PDF file in the public directory
    const filePath = path.join(process.cwd(), 'public', 'Islam_Tayeb_Resume.pdf');

    // Read the file
    const fileBuffer = fs.readFileSync(filePath);

    // Create response with appropriate headers
    const response = new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="Islam_Tayeb_Resume.pdf"'
      }
    });

    return response;
  } catch (error) {
    console.error('Error serving resume:', error);
    return NextResponse.json({ error: 'Failed to load resume' }, { status: 500 });
  }
}
