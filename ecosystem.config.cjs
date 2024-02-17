//Aqui uso a biblioteca PM2 para que ela fique observando o servidor para mante-lo sempre rodando.

module.exports = {
  apps: [
    {
      name: 'app',
      script: './src/server.js',
      instances: 'max',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};