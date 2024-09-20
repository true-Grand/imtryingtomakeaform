import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient'; // Assuming you have Supabase client set up here

export async function POST(req: NextRequest) {
  try {
    const { reflection, quizResult, capturedImageURL } = await req.json();

    // Insert the data into the Supabase table 'quiz_results'
    const { data, error } = await supabase.from('quiz_results').insert([
      {
        reflection: reflection,
        quiz_result: quizResult,
        captured_image_url: capturedImageURL || null, // Optional
      },
    ]);

    if (error) {
      console.error('Error saving results to Supabase:', error);
      return NextResponse.json({ message: 'Error saving results', error }, { status: 500 });
    }

    return NextResponse.json({ message: 'Results saved successfully!', data });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ message: 'Error processing request', error }, { status: 500 });
  }
}
