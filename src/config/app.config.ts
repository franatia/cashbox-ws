export default () => ({
  app: {
    env: process.env.APP_ENV,
    port: parseInt(process.env.APP_PORT!, 10),
  },
});