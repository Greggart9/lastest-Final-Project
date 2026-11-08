let app;

export default async function handler(req, res) {
  try {
    if (!app) {
      const serverModule = await import('../src/server.js');
      app = serverModule.default || serverModule;
    }
    return app(req, res);
  } catch (error) {
    console.error('Serverless function error:', error);
    res.status(500).json({
      error: 'CRASH_ON_BOOT',
      message: error.message,
      stack: error.stack
    });
  }
}
