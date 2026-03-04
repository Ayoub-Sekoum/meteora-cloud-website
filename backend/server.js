// ═══════════════════════════════════════════════════════════
// Meteora Cloud - Backend Server
// Gestisce: Upload file su Google Drive + Email di notifica
// ═══════════════════════════════════════════════════════════

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const stream = require('stream');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── CORS ────────────────────────────────────────────────
app.use(cors({
    origin: ['http://localhost:3000', 'https://metteora.uk'],
    methods: ['POST', 'OPTIONS'],
}));
app.use(express.json());

// ─── Multer (upload file in memoria, max 30MB) ──────────
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 30 * 1024 * 1024 }, // 30 MB
});

// ─── Google Drive Setup ─────────────────────────────────
let driveClient = null;

function initGoogleDrive() {
    try {
        const keyPath = path.resolve(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || './credentials.json');
        if (!fs.existsSync(keyPath)) {
            console.warn('⚠️  Google Drive credentials non trovate:', keyPath);
            console.warn('   Il caricamento file su Drive sarà disabilitato.');
            console.warn('   Crea un Service Account e scarica il JSON nelle credenziali.');
            return null;
        }

        const auth = new google.auth.GoogleAuth({
            keyFile: keyPath,
            scopes: ['https://www.googleapis.com/auth/drive.file'],
        });

        driveClient = google.drive({ version: 'v3', auth });
        console.log('✅ Google Drive connesso.');
        return driveClient;
    } catch (error) {
        console.warn('⚠️  Errore inizializzazione Google Drive:', error.message);
        return null;
    }
}

// ─── Crea sottocartella su Drive con data + info cliente ─
async function createDriveFolder(nome, cognome) {
    if (!driveClient) return null;

    const date = new Date();
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
    const timeStr = date.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
    const folderName = `${dateStr}_${timeStr}_${nome}_${cognome}`;

    try {
        const response = await driveClient.files.create({
            requestBody: {
                name: folderName,
                mimeType: 'application/vnd.google-apps.folder',
                parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
            },
            fields: 'id, webViewLink',
        });

        console.log(`📁 Cartella creata: ${folderName}`);
        return {
            id: response.data.id,
            link: response.data.webViewLink,
            name: folderName,
        };
    } catch (error) {
        console.error('❌ Errore creazione cartella Drive:', error.message);
        return null;
    }
}

// ─── Carica file su Google Drive ─────────────────────────
async function uploadFileToDrive(file, folderId) {
    if (!driveClient || !file) return null;

    try {
        // Crea uno stream dal buffer del file
        const bufferStream = new stream.PassThrough();
        bufferStream.end(file.buffer);

        const response = await driveClient.files.create({
            requestBody: {
                name: file.originalname,
                parents: [folderId],
            },
            media: {
                mimeType: file.mimetype,
                body: bufferStream,
            },
            fields: 'id, webViewLink, webContentLink',
        });

        // Rendi il file accessibile con link
        await driveClient.permissions.create({
            fileId: response.data.id,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });

        console.log(`📄 File caricato: ${file.originalname}`);
        return {
            id: response.data.id,
            viewLink: response.data.webViewLink,
            downloadLink: response.data.webContentLink,
            name: file.originalname,
            size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        };
    } catch (error) {
        console.error('❌ Errore upload file:', error.message);
        return null;
    }
}

// ─── Email Setup ─────────────────────────────────────────
function createEmailTransporter() {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });
}

// ─── Invia email di notifica ─────────────────────────────
async function sendNotificationEmail(data, driveFolder, fileInfo) {
    const transporter = createEmailTransporter();

    const driveSection = driveFolder
        ? `
📁 FILE CARICATI SU GOOGLE DRIVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Cartella: ${driveFolder.name}
🔗 Link diretto: ${driveFolder.link}
${fileInfo ? `File: ${fileInfo.name} (${fileInfo.size})` : ''}
${fileInfo?.viewLink ? `📄 Vedi file: ${fileInfo.viewLink}` : ''}
`
        : '\n📎 Nessun file allegato.\n';

    const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f4f4f5; padding: 40px 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #111827, #1f2937); padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">🔔 Nuovo Contatto</h1>
            <p style="color: #9ca3af; margin: 8px 0 0; font-size: 14px;">Meteora Cloud - Form di Contatto</p>
        </div>

        <!-- Content -->
        <div style="padding: 32px;">
            <table style="width: 100%; border-collapse: separate; border-spacing: 0 12px;">
                <tr>
                    <td style="color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; padding: 4px 0;">Nome</td>
                    <td style="font-size: 16px; font-weight: 600; color: #111827; text-align: right;">${data.nome} ${data.cognome}</td>
                </tr>
                <tr>
                    <td style="color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; padding: 4px 0;">Email</td>
                    <td style="font-size: 16px; color: #111827; text-align: right;"><a href="mailto:${data.email}" style="color: #dc2626; text-decoration: none;">${data.email}</a></td>
                </tr>
                <tr>
                    <td style="color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; padding: 4px 0;">Telefono</td>
                    <td style="font-size: 16px; color: #111827; text-align: right;"><a href="tel:${data.telefono}" style="color: #111827; text-decoration: none;">${data.telefono}</a></td>
                </tr>
            </table>

            <!-- Messaggio -->
            <div style="margin-top: 24px; padding: 20px; background: #f9fafb; border-radius: 12px; border-left: 4px solid #dc2626;">
                <p style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px;">Messaggio</p>
                <p style="color: #111827; font-size: 15px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${data.messaggio}</p>
            </div>

            ${driveFolder ? `
            <!-- File Drive -->
            <div style="margin-top: 24px; padding: 20px; background: #f0fdf4; border-radius: 12px; border-left: 4px solid #22c55e;">
                <p style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px;">📁 File Caricati</p>
                <a href="${driveFolder.link}" style="display: inline-block; padding: 10px 20px; background: #22c55e; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
                    Apri Cartella Drive →
                </a>
                ${fileInfo ? `<p style="color: #6b7280; font-size: 13px; margin: 12px 0 0;">${fileInfo.name} (${fileInfo.size})</p>` : ''}
            </div>
            ` : ''}
        </div>

        <!-- Footer -->
        <div style="padding: 20px 32px; background: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">Inviato dal form di contatto di Meteora Cloud</p>
        </div>
    </div>
</body>
</html>`;

    const mailOptions = {
        from: `"Meteora Cloud" <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER,
        subject: `🔔 Nuovo Contatto: ${data.nome} ${data.cognome}`,
        text: `
NUOVO CONTATTO - METEORA CLOUD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 Nome: ${data.nome} ${data.cognome}
📧 Email: ${data.email}
📞 Telefono: ${data.telefono}

💬 MESSAGGIO:
${data.messaggio}
${driveSection}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Inviato dal form di contatto di Meteora Cloud
`,
        html: emailHtml,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('📧 Email inviata a:', process.env.GMAIL_USER);
        return true;
    } catch (error) {
        console.error('❌ Errore invio email:', error.message);
        return false;
    }
}

// ═══════════════════════════════════════════════════════════
// ROUTE: POST /api/contact
// ═══════════════════════════════════════════════════════════
app.post('/api/contact', upload.single('file'), async (req, res) => {
    try {
        const { nome, cognome, email, telefono, messaggio } = req.body;

        // Validazione
        if (!nome || !cognome || !email || !telefono || !messaggio) {
            return res.status(400).json({
                success: false,
                message: 'Tutti i campi (Nome, Cognome, Email, Telefono, Messaggio) sono obbligatori.',
            });
        }

        // Validazione lettere per nome/cognome
        const lettersOnly = /^[A-Za-zÀ-ÿ\s'-]+$/;
        if (!lettersOnly.test(nome) || !lettersOnly.test(cognome)) {
            return res.status(400).json({
                success: false,
                message: 'Nome e Cognome devono contenere solo lettere.',
            });
        }

        // Validazione numeri per telefono
        const numbersOnly = /^[0-9+\s()-]+$/;
        if (!numbersOnly.test(telefono)) {
            return res.status(400).json({
                success: false,
                message: 'Il telefono deve contenere solo numeri.',
            });
        }

        console.log('\n═══════════════════════════════════════');
        console.log(`📩 Nuovo contatto: ${nome} ${cognome}`);
        console.log(`   Email: ${email} | Tel: ${telefono}`);
        console.log('═══════════════════════════════════════');

        let driveFolder = null;
        let fileInfo = null;

        // Upload file su Google Drive (se presente)
        if (req.file) {
            console.log(`📎 File ricevuto: ${req.file.originalname} (${(req.file.size / 1024 / 1024).toFixed(2)} MB)`);

            driveFolder = await createDriveFolder(nome, cognome);

            if (driveFolder) {
                // Carica il file nella sottocartella
                fileInfo = await uploadFileToDrive(req.file, driveFolder.id);
            }
        }

        // Invia email di notifica
        const emailSent = await sendNotificationEmail(
            { nome, cognome, email, telefono, messaggio },
            driveFolder,
            fileInfo
        );

        // Risposta
        return res.status(200).json({
            success: true,
            message: 'Richiesta ricevuta con successo!',
            emailSent,
            driveFolder: driveFolder ? { link: driveFolder.link } : null,
        });

    } catch (error) {
        console.error('❌ Errore generico:', error);
        return res.status(500).json({
            success: false,
            message: 'Errore interno del server.',
        });
    }
});

// ─── Health check ────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        drive: driveClient ? 'connected' : 'disabled',
        timestamp: new Date().toISOString(),
    });
});

// ═══════════════════════════════════════════════════════════
// START
// ═══════════════════════════════════════════════════════════
initGoogleDrive();

app.listen(PORT, () => {
    console.log(`\n🚀 Meteora Backend attivo su http://localhost:${PORT}`);
    console.log(`   POST /api/contact  → Form di contatto`);
    console.log(`   GET  /api/health   → Stato del server`);
    console.log(`\n   Email: ${process.env.GMAIL_USER}`);
    console.log(`   Drive: ${driveClient ? '✅ Connesso' : '⚠️  Non configurato'}\n`);
});
