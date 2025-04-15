module.exports = {
  apps : [{
    name   : "loop",
    script : "./index.js",
    instances : "max",
    exec_mode : "cluster"
  }]
}
