import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import puppeteer from 'puppeteer';

export async function POST(req) {
  try {
    const data = await req.json(); // Get dynamic data from the request body

    // Path to the HTML template
    const templatePath = path.join(process.cwd(), 'src/pdf/100-MPI-Informe-Template.html');
    const templateSource = fs.readFileSync(templatePath, 'utf-8');
    const template = Handlebars.compile(templateSource);
    const html = template(data);

    // Launch Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    await page.emulateMediaType('screen');

    // Generate PDF
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    // Respond with the PDF
    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Informe.pdf"',
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
