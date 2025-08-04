module.exports = {
  apps: [
    {
      name: "backend",
      script: "./server.js",
      cwd: "./backend",
      watch: true,
    },
    {
      name: "frontend",
      script: "npm",
      args: "run dev",
      cwd: "./frontend",
      watch: false,
    },
  ],
};
