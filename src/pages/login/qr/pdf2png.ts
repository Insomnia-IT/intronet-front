declare global {
  export const pdfjsLib: any;
}
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

export async function pdf2png(file: File) {
  const pdf = await new Promise<any>(async resolve => {
    const pdf = await pdfjsLib.getDocument({
      data: await file.arrayBuffer()
    });
    pdf.onProgress = ({loaded, total}) => {
      if (loaded == total)
        resolve(pdf);
    }
  });
  const page = await pdf._transport.getPage(1);
  const viewport = page.getViewport({scale: 1});
  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const context = canvas.getContext('2d');
  const renderTask = await page.render({canvasContext: context, viewport});
  await renderTask.promise;
  return canvas;
}
