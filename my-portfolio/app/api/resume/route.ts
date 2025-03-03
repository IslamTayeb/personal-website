import { NextResponse } from 'next/server';

export async function GET() {
  // Your private Overleaf PDF URL
  return NextResponse.redirect('https://www.overleaf.com/download/project/6795d484b34ad2cb8bd1f6d6/build/1955851a075-4a13911f9d228ed5/output/output.pdf?compileGroup=standard&clsiserverid=clsi-pre-emp-n2d-c-f-vfzw&enable_pdf_caching=true');
}
