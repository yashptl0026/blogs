import { NextResponse } from "next/server";

export async function GET() {
  let contentEn = `<p>Test content body.</p>\n        <div class="my-10">\n          <h3 class="text-2xl font-black font-display mb-6">Photo Gallery</h3>\n          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">\n            <img src="/uploads/1.jpg" class="w-full h-48 object-cover rounded-xl shadow-sm m-0!" />\n          </div>\n        </div>\n      `;
  
  const galleryRegex = /<div class="my-10">\s*<h3 class="text-2xl font-black font-display mb-6">Photo Gallery<\/h3>\s*<div class="grid grid-cols-2 md:grid-cols-3 gap-4">\s*([\s\S]*?)<\/div>\s*<\/div>/;
  const galleryMatch = galleryRegex.exec(contentEn);
  
  let galleryImages = [];
  if (galleryMatch) {
    const imagesHtml = galleryMatch[1];
    const srcRegex = /<img[^>]+src="([^">]+)"/g;
    let srcMatch;
    while ((srcMatch = srcRegex.exec(imagesHtml)) !== null) {
      galleryImages.push(srcMatch[1]);
    }
    contentEn = contentEn.replace(galleryRegex, "");
  }

  return NextResponse.json({
    galleryMatch: !!galleryMatch,
    galleryImages,
    finalContent: contentEn
  });
}
