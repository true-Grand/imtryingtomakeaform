import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { reflection, quizResult, capturedImageURL } = await req.json();

    // Construct the text to be written
    const textToSave = `Reflection: ${reflection}\nQuiz Result: ${quizResult}\nCaptured Image: ${capturedImageURL}\n\n`;

    // Define the file path (use a folder for storing data)
    const filePath = path.join(process.cwd(), 'data', 'results.txt');

    // Append the data to the file
    fs.appendFileSync(filePath, textToSave, 'utf8');

    return NextResponse.json({ message: 'Results saved successfully!' });
  } catch (error) {
    return NextResponse.json({ message: 'Error saving results', error }, { status: 500 });
  }
}
