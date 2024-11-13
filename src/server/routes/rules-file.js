function rulesFile(server, path) {
  server.get("/download/rulesfile", (req, res) => {
    const fileName = path.join(__dirname, '../resource/lorem-ipsum.pdf');
    res.download(fileName, 'CoffeeStoreRules.pdf');
  });
}

module.exports = rulesFile;
