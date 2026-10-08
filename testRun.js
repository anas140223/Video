const path = require('path');
const { generateVoiceover } = require('./src/services/ttsService.js');
const { sendToColabForRendering } = require('./src/services/colabRenderer.js');

async function executeTestRun() {
  console.log('🚀 Starting End-to-End Pipeline Test Run...\n');

  // 1. Define test content
  const newsData = {
    headline: "TECH GIANTS UNVEIL NEXT-GEN AI ACCELERATORS",
    summary: "Major cloud infrastructure providers report record demand as enterprise adoption surges across global markets.",
    ticker: "NVDA ▲ 5.2% | AMD ▲ 3.1% | INTC ➔ 0.8% | MSFT ▲ 1.9%"
  };

  const scriptText = `${newsData.headline}. ${newsData.summary}`;
  const templatePath = path.join(__dirname, 'templates/news-template.html');
  const audioPath = path.join(__dirname, 'assets/audio/test.mp3');

  // Read static domain or dynamic ngrok URL from environment variable
  const colabUrl = process.env.COLAB_URL || "https://aerospace-turbulent-tyke.ngrok-free.dev";

  try {
    // Step 1: Generate voiceover MP3 using ttsService
    console.log('--- Step 1: Generating Test Audio ---');
    await generateVoiceover({
      text: scriptText,
      outputPath: audioPath
    });
    console.log('✔ Audio generation completed.\n');

    // Step 2: Package assets & dispatch to Colab worker using colabRenderer
    console.log('--- Step 2: Dispatching Assets to Google Colab ---');
    const result = await sendToColabForRendering({
      newsData,
      templatePath,
      audioPath,
      colabUrl,
      fps: 30,
      durationSec: 15
    });

    console.log('\n🎉 TEST RUN DISPATCH SUCCESSFUL!');
    console.log('Response from Colab Server:', result);

  } catch (error) {
    console.error('\n❌ TEST RUN FAILED!');
    console.error('Error Details:', error.message);
  }
}

executeTestRun();

