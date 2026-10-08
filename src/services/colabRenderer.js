const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function sendToColabForRendering(payload) {
    try {
        console.log('📦 Packaging video assets...');

        // 1. Read local HTML file content into a string
        let htmlContent = payload.html || '';
        if (!htmlContent && payload.templatePath) {
            const absoluteTemplatePath = path.resolve(payload.templatePath);
            if (fs.existsSync(absoluteTemplatePath)) {
                htmlContent = fs.readFileSync(absoluteTemplatePath, 'utf8');
            }
        }

        // 2. Convert local audio file to Base64 string
        let audioBase64 = null;
        if (payload.audioPath) {
            const absoluteAudioPath = path.resolve(payload.audioPath);
            if (fs.existsSync(absoluteAudioPath)) {
                audioBase64 = fs.readFileSync(absoluteAudioPath).toString('base64');
            }
        }

        // 3. Construct dispatch payload
        const colabPayload = {
            job_id: `job_${Date.now()}`,
            html: htmlContent,
            audio_base64: audioBase64,
            fps: payload.fps || 30,
            duration: payload.durationSec || payload.duration || 15,
            newsData: payload.newsData || {}
        };

        const targetUrl = `${payload.colabUrl.replace(/\/$/, '')}/render`;
        console.log(`🚀 Sending payload to Google Colab worker at: ${targetUrl}`);

        const response = await axios.post(targetUrl, colabPayload, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 300000 // 5 minute timeout for 60s renders
        });

        return response.data;

    } catch (error) {
        if (error.response) {
            throw new Error(`Request failed with status code ${error.response.status}`);
        }
        throw error;
    }
}

module.exports = { sendToColabForRendering };

