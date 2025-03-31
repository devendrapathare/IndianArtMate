import fs from 'fs';
import PDFDocument from 'pdfkit';
import path from 'path';
import { fileURLToPath } from 'url'; // Import fileURLToPath
import User from '../models/userModels.js';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateCertificate = async (post) => {
    try {
        const artist = await User.findById(post.userId);
        const artistName = artist ? artist.userName : 'Unknown Artist';

        const certificatesDir = path.join(__dirname, '..', 'uploads', 'certificates');

        // Ensure the directory exists
        if (!fs.existsSync(certificatesDir)) {
            fs.mkdirSync(certificatesDir, { recursive: true });
        }

        const certificateFileName = `${post._id}.pdf`;
        const certificatePath = path.join(certificatesDir, certificateFileName);

        const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 40 });

        doc.pipe(fs.createWriteStream(certificatePath));

        // Background Image
        const backgroundImage = path.join(__dirname, '..', '..', 'uploads', 'assets', 'certificate_background.jpeg');
        if (fs.existsSync(backgroundImage)) {
            doc.image(backgroundImage, 0, 0, { width: 842, height: 595 });
        }

        // Golden Border
        doc.lineWidth(4);
        doc.strokeColor('#D4AF37');
        doc.rect(10, 10, 822, 575).stroke();

        // Header
        doc.font('Helvetica-Bold').fontSize(32).fillColor('#333')
            .text('Certificate of Authenticity', { align: 'center' });

        doc.moveDown(1);
        doc.font('Helvetica').fontSize(16).fillColor('#666')
            .text('This certificate authenticates the originality of the artwork.', { align: 'center' });

        doc.moveDown(2);

        // Certificate Details (Aligned Left & Right)
        const leftX = 100; // Left column
        const rightX = 400; // Right column
        const startY = 200;
        const lineGap = 40;
        doc.fillColor('#000').font('Helvetica-Bold').fontSize(20);

        doc.text('Title:', leftX, startY);
        doc.text('Artist:', leftX, startY + lineGap);
        doc.text('Category:', leftX, startY + lineGap * 2);
        doc.text('Price:', leftX, startY + lineGap * 3);
        doc.text('Unique Image Hash:', leftX, startY + lineGap * 4);

        doc.font('Helvetica').fillColor('#444');
        doc.text(post.title, rightX, startY);
        doc.text(artistName, rightX, startY + lineGap);
        doc.text(post.category, rightX, startY + lineGap * 2);
        doc.text(`$${post.price}`, rightX, startY + lineGap * 3);
        doc.text(post.imageHash, rightX, startY + lineGap * 4);

        // Date Alignment (Above Seal & Signature)
        const dateY = startY + lineGap * 6;
        doc.fontSize(18).fillColor('#000')
            .text(`Date: ${new Date().toLocaleDateString()}`, leftX, dateY);

        // Signature & Stamp Section (Seal Centered Above Signature and Shifted Left & Down)
        const signatureY = startY + lineGap * 8;
        doc.lineWidth(2);
        doc.strokeColor('#000').moveTo(leftX, signatureY).lineTo(leftX + 200, signatureY).stroke();
        doc.text('Authorized Signature', leftX, signatureY + 10);

        const stampPath = path.join(__dirname, '..', '..', 'uploads', 'assets', 'seal.png');
        if (fs.existsSync(stampPath)) {
            doc.image(stampPath, leftX + 30, signatureY - 60, { width: 150, align: 'center' });
        }

        doc.end();

        // Return the relative path to the certificate
        return path.join('uploads', 'certificates', certificateFileName);
    } catch (error) {
        console.error("Error generating certificate:", error.message);
        throw new Error("Failed to generate certificate");
    }
};

export default generateCertificate;
