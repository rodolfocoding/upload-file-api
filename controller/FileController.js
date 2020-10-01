const { fs, readdirSync, statSync } = require("fs");
const { path, join } = require("path");

module.exports = {
  //LISTA TODOS OS ARQUIVOS EM DETERMINADO DIRETÓRIO
  async index(request, response) {
    const directoryPath = path.join("C:/uploads");
    fs.readdir(directoryPath, function (err, files) {
      if (err) {
        return console.log("Unable to scan directory: " + err);
      }

      files.forEach(function (file) {
        return response.json({
          files,
        });
      });
    });
  },

  //RETORNA OS ARQUIVOS COM A EXTENSÃO ENVIADA NO CORPO DA REQUISIÇÃO
  async findByExt(request, response) {
    const getAllFiles = (dir, extn, files, result, regex) => {
      files = files || readdirSync(dir);
      result = result || [];
      regex = regex || new RegExp(`\\${extn}$`);

      for (let i = 0; i < files.length; i++) {
        let file = join(dir, files[i]);
        if (statSync(file).isDirectory()) {
          try {
            result = getAllFiles(file, extn, readdirSync(file), result, regex);
          } catch (error) {
            continue;
          }
        } else {
          if (regex.test(file)) {
            result.push(file);
          }
        }
      }
      return result;
    };
    const { ext } = request.body;
    const result = getAllFiles("C:/uploads/", ext);
    response.json({
      files: result,
    });
  },

  //UPLOAD DE ARQUIVOS EM DETERMINADO DIRETÓRIO
  async store(request, response) {
    response.send("Received file!");
  },

  //DELETA UM ARQUIVO NO DIRETÓRIO
  async delete(request, response) {
    const { file } = request.body;

    fs.unlink("C:/uploads/" + file, function (err) {
      if (err) {
        throw err;
      } else {
        response.send("Successfully deleted the file.");
      }
    });
  },

  //FAZ O DOWNLOAD DE DETERMINADO ARQUIVO EM UM DIRETÓRIO
  async download(request, response) {
    const fileDownload = request.params.fileDownload;
    const file = "C:/uploads/" + fileDownload;
    response.download(file);
  },
};
