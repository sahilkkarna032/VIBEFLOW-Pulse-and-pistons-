import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/db/supabase';
import { toast } from 'sonner';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

interface TransformResult {
  originalUrl: string;
  newUrl: string | null;
  status: 'pending' | 'processing' | 'success' | 'error';
  error?: string;
}

export default function TransformCoversPage() {
  const [isTransforming, setIsTransforming] = useState(false);
  const [results, setResults] = useState<TransformResult[]>([]);
  const [progress, setProgress] = useState(0);

  const getUniqueCoverUrls = async (): Promise<string[]> => {
    const { data: tracks } = await supabase
      .from('tracks')
      .select('cover_url')
      .not('cover_url', 'is', null);

    const { data: playlists } = await supabase
      .from('playlists')
      .select('cover_url')
      .not('cover_url', 'is', null);

    const allUrls = [
      ...(tracks?.map((t: { cover_url: string }) => t.cover_url) || []),
      ...(playlists?.map((p: { cover_url: string }) => p.cover_url) || []),
    ];

    return [...new Set(allUrls)];
  };

  const transformCover = async (imageUrl: string): Promise<string> => {
    const { data, error } = await supabase.functions.invoke('transform-album-cover', {
      body: { imageUrl },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.success) {
      throw new Error(data.error || 'Transformation failed');
    }

    return data.imageData;
  };

  const uploadToSupabase = async (base64Data: string, originalUrl: string): Promise<string> => {
    // Extract base64 content
    const base64Content = base64Data.split(',')[1];
    const buffer = Uint8Array.from(atob(base64Content), c => c.charCodeAt(0));

    // Generate unique filename
    const filename = `realistic-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;

    // Upload to Supabase Storage (assuming you have a bucket named 'album-covers')
    const { data, error } = await supabase.storage
      .from('album-covers')
      .upload(filename, buffer, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('album-covers')
      .getPublicUrl(filename);

    return urlData.publicUrl;
  };

  const updateDatabase = async (oldUrl: string, newUrl: string) => {
    try {
      // Call the RPC functions with type assertion
      await (supabase.rpc as any)('update_track_covers', { old_url: oldUrl, new_url: newUrl });
      await (supabase.rpc as any)('update_playlist_covers', { old_url: oldUrl, new_url: newUrl });
    } catch (error) {
      console.error('Error updating database:', error);
    }
  };

  const handleTransformAll = async () => {
    setIsTransforming(true);
    setResults([]);
    setProgress(0);

    try {
      const coverUrls = await getUniqueCoverUrls();
      toast.info(`Found ${coverUrls.length} unique album covers to transform`);

      const initialResults: TransformResult[] = coverUrls.map(url => ({
        originalUrl: url,
        newUrl: null,
        status: 'pending',
      }));
      setResults(initialResults);

      for (let i = 0; i < coverUrls.length; i++) {
        const url = coverUrls[i];
        
        setResults(prev => prev.map(r => 
          r.originalUrl === url ? { ...r, status: 'processing' } : r
        ));

        try {
          // Transform the image
          const transformedBase64 = await transformCover(url);
          
          // Upload to Supabase Storage
          const newUrl = await uploadToSupabase(transformedBase64, url);
          
          // Update database
          await updateDatabase(url, newUrl);

          setResults(prev => prev.map(r => 
            r.originalUrl === url ? { ...r, status: 'success', newUrl } : r
          ));

          toast.success(`Transformed cover ${i + 1}/${coverUrls.length}`);
        } catch (error) {
          console.error(`Error transforming ${url}:`, error);
          setResults(prev => prev.map(r => 
            r.originalUrl === url 
              ? { ...r, status: 'error', error: error instanceof Error ? error.message : 'Unknown error' } 
              : r
          ));
          toast.error(`Failed to transform cover ${i + 1}`);
        }

        setProgress(((i + 1) / coverUrls.length) * 100);
      }

      toast.success('All album covers transformed!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to transform album covers');
    } finally {
      setIsTransforming(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-screen-xl mx-auto p-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Transform Album Covers</h1>
          <p className="text-muted-foreground">
            Transform all AI-generated album covers to look more realistic and photorealistic
          </p>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <Button
              onClick={handleTransformAll}
              disabled={isTransforming}
              size="lg"
              className="w-full"
            >
              {isTransforming ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Transforming...
                </>
              ) : (
                'Start Transformation'
              )}
            </Button>

            {isTransforming && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-center text-muted-foreground">
                  {Math.round(progress)}% Complete
                </p>
              </div>
            )}
          </div>
        </Card>

        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Transformation Results</h2>
            <div className="grid gap-4">
              {results.map((result, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {result.status === 'pending' && (
                        <div className="w-6 h-6 rounded-full bg-muted" />
                      )}
                      {result.status === 'processing' && (
                        <Loader2 className="w-6 h-6 text-primary animate-spin" />
                      )}
                      {result.status === 'success' && (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      )}
                      {result.status === 'error' && (
                        <XCircle className="w-6 h-6 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {result.originalUrl.split('/').pop()}
                      </p>
                      {result.error && (
                        <p className="text-xs text-red-500 mt-1">{result.error}</p>
                      )}
                      {result.newUrl && (
                        <p className="text-xs text-green-500 mt-1">
                          Uploaded to: {result.newUrl.split('/').pop()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {result.originalUrl && (
                        <img
                          src={result.originalUrl}
                          alt="Original"
                          className="w-16 h-16 rounded object-cover"
                        />
                      )}
                      {result.newUrl && (
                        <img
                          src={result.newUrl}
                          alt="Transformed"
                          className="w-16 h-16 rounded object-cover border-2 border-primary"
                        />
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
