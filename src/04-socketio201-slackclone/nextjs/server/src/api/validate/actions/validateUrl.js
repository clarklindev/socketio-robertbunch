const IMAGE_CONTENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/svg+xml',
  'image/webp',
  'image/bmp',
  'image/tiff',
  // Add more image content types if needed
];

export async function validateUrl(req, res){
  const { url } = req.query;
  console.log('url: ', url);

  if (!url) {
    return res.status(400).json({ valid: false, message: 'URL is required' });
  }

  try {
    const response = await fetch(url, { method: 'HEAD' });

    if (response.ok) {
      const contentType = response.headers.get('Content-Type');
      
      console.log(`URL: ${url}`);
      console.log(`Status: ${response.status} ${response.statusText}`);
      console.log(`Content-Type: ${contentType}`);
      console.log('-------');

      // Handle redirects
      if (response.redirected) {
        console.log(`Redirected to: ${response.url}`);
      }
      
      if (IMAGE_CONTENT_TYPES.includes(contentType)) {
        return res.status(200).json({ valid: true, message: 'URL points to an image' });
      } else {
        return res.status(200).json({ valid: false, message: 'URL does not point to an image' });
      }
   
    } else {
      return res.status(200).json({ valid: false });
    }
  } catch (error) {
    return res.status(500).json({ valid: false, message: error.message });
  }
}