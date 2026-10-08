const fs = require('fs');
const path = require('path');
const axios = require('axios');

/**
 * Generates an MP3 audio file from news text script and saves it to local storage.
 * 
 * @param {Object} options
 * @param {string} options.text Script text to convert to speech
 * @param {string} options.outputPath Destination path to save the generated MP3 file
 * @param {string} [options.lang='en'] Speech language code
 */
async function generateVoiceover({ text, outputPath, lang = 'en' }) {
  console.log('🎙️ Generating TTS voiceover audio...');

  if (!text || text.trim().length === 0) {
    throw new Error('TTS Error: Input text cannot be empty.');
  }

  const resolvedPath = path.resolve(outputPath);
  const dir = path.dirname(resolvedPath);

  // Ensure output directory exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  try {
    // Standard Google Translate TTS public endpoint for lightweight voice generation
    const encodedText = encodeURIComponent(text);
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=${lang}&client=tw-ob`;

    const response = await axios({
      method: 'get',
      url: ttsUrl,
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });

    // Save audio stream to disk
    const writer = fs.createWriteStream(resolvedPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log(`✅ Voiceover audio successfully saved to: ${resolvedPath}`);
        resolve(resolvedPath);
      });
      writer.on('error', (err) => {
        console.error('❌ Error writing audio file to disk:', err.message);
        reject(err);
      });
    });

  } catch (error) {
    console.error('❌ Failed to generate TTS voiceover:', error.message);
    throw error;
  }
}
(async () => {
  try {
    const result = await generateVoiceover({
      text: "Hello, this is a local test for the TTS service.",
      outputPath: "./output/test.mp3",
      lang: "en"
    });
    console.log("Test execution finished successfully:", result);
  } catch (error) {
    console.error("Test execution failed:", error);
  }
})();


module.exports = { generateVoiceover };

