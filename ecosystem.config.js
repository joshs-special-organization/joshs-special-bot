module.exports = {
  apps : [{
    name   : "jsb",
    script : "pnpm run start",
    exp_backoff_restart_delay: 100,
    error_file: "/opt/pm2-logs/jsb-bot-error.log",
    out_file: "/opt/pm2-logs/jsb-bot-out.log",
  }]
}
