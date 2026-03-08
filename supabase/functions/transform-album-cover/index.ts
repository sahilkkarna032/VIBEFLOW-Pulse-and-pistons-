import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: 'Image URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch the original image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error('Failed to fetch original image');
    }

    // Convert image to Base64
    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = btoa(
      new Uint8Array(imageBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );

    // Get the MIME type
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';

    // Get API key from environment
    const apiKey = Deno.env.get('INTEGRATIONS_API_KEY');
    if (!apiKey) {
      throw new Error('API key not configured');
    }

    // Submit image transformation task
    const submitResponse = await fetch(
      'https://app-a2nh4x72mkn5-api-zYkZzKQJrBdL.gateway.appmedo.com/image-generation/submit',
      {
        method: 'POST',
        headers: {
          'X-Gateway-Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                inline_data: {
                  mime_type: contentType,
                  data: base64Image,
                },
              },
              {
                text: 'Transform this album cover to look more realistic and photorealistic, with natural lighting, professional photography style, high quality textures, and remove any obvious AI-generated artifacts. Make it look like a real professional album cover photograph.',
              },
            ],
          }],
        }),
      }
    );

    if (!submitResponse.ok) {
      const errorText = await submitResponse.text();
      throw new Error(`API submission failed: ${errorText}`);
    }

    const submitResult = await submitResponse.json();
    
    if (submitResult.status !== 0) {
      throw new Error(submitResult.message || 'Failed to submit transformation task');
    }

    const taskId = submitResult.data.taskId;

    // Poll for task completion (max 10 minutes, check every 8 seconds)
    const maxAttempts = 75; // 75 * 8 seconds = 10 minutes
    let attempts = 0;

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 8000)); // Wait 8 seconds

      const statusResponse = await fetch(
        'https://app-a2nh4x72mkn5-api-GYX1lzGw0DQa.gateway.appmedo.com/image-generation/task',
        {
          method: 'POST',
          headers: {
            'X-Gateway-Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ taskId }),
        }
      );

      if (!statusResponse.ok) {
        throw new Error('Failed to check task status');
      }

      const statusResult = await statusResponse.json();

      if (statusResult.status !== 0) {
        throw new Error('Failed to get task status');
      }

      const taskStatus = statusResult.data.status;

      if (taskStatus === 'SUCCESS') {
        // Extract the generated image
        const candidates = statusResult.data.result?.candidates;
        if (!candidates || candidates.length === 0) {
          throw new Error('No image generated');
        }

        const imageText = candidates[0].content.parts[0].text;
        // Extract base64 from markdown format: ![image](data:image/jpeg;base64,XXXXX)
        const match = imageText.match(/data:image\/[^;]+;base64,([^)]+)/);
        
        if (!match) {
          throw new Error('Failed to extract generated image');
        }

        const generatedBase64 = match[1];

        return new Response(
          JSON.stringify({
            success: true,
            imageData: `data:image/jpeg;base64,${generatedBase64}`,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else if (taskStatus === 'FAILED' || taskStatus === 'TIMEOUT') {
        const errorMsg = statusResult.data.error?.message || 'Task failed';
        throw new Error(`Image generation failed: ${errorMsg}`);
      }

      // Task is still PENDING, continue polling
      attempts++;
    }

    throw new Error('Task timeout - exceeded maximum wait time');

  } catch (error) {
    console.error('Error transforming album cover:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
