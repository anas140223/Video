/t/ index.js
const { sendToColabForRendering } = require('./services/colabRenderer');

async function runPipeline() {
  // 1. Prepare news content
  const newsData = {
    headline: "MARKET RALLY: TECH STOCKS SURGE",
    summary: "Cloud and hardware providers lead index gains after quarterly beat.",
    ticker: "AAPL ▲ 2.4%  |  MSFT ▲ 1.8%  |  NVDA ▲ 4.1%"
  };

  // 2. Dispatch to Colab worker
  const COLAB_ENDPOINT = "https://aerospace-turbulent-tyke.ngrok-free.dev";

  const result = await sendToColabForRendering({
    newsData,
    templatePath: './templates/news-overlay.html',
    audioPath: './temp/voiceover.mp3',
    colabUrl: COLAB_ENDPOINT
  });

  console.log('Video rendered successfully:', result);
}

runPipeline();

