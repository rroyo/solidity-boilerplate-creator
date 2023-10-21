const fs = require('fs');
const path = require('path');

function replacePlaceholders(template, replacements) {
  for (let key in replacements) {
    const placeholder = `{{${key}}}`;
    const value = replacements[key];

    while (template.includes(placeholder)) {
      template = template.replace(placeholder, value);
    }
  }

  return template;
}

function determineBoilerplateType(opts) {
  if (opts.script) {
    return { folder: 'script', suffix: '.s', templateType: 'script_template' };
  }
  if (opts.test) {
    return { folder: 'test', suffix: '.t', templateType: 'test_template' };
  }
  return { folder: 'src', suffix: '', templateType: 'contract_template' };
}

function getFilePaths(contractName, folder, suffix) {
  const relativeFilePath = path.join(folder, `${contractName}${suffix}.sol`);
  const filePath = path.join(process.cwd(), relativeFilePath);
  return { relativeFilePath, filePath };
}

function readTemplates(headerPath, specificTemplatePath) {
  const headerContent = `${fs.readFileSync(headerPath, 'utf-8').trim()}\n\n`;
  const specificTemplateContent = fs.readFileSync(specificTemplatePath, 'utf-8').trim();
  return headerContent + specificTemplateContent;
}

function createBoilerplate(filename, options, templateConfig) {
  const contractName = `${filename[0].toUpperCase()}${filename.slice(1)}`;

  const { folder, suffix, templateType } = determineBoilerplateType(options);
  const { relativeFilePath, filePath } = getFilePaths(contractName, folder, suffix);

  if (!fs.existsSync(folder)) {
    console.error(
      `Error: Cannot find the folder "${folder}". Ensure you are running this command from the root folder of your contract.`
    );
    return;
  }

  if (fs.existsSync(filePath)) {
    console.error(`Error: The file "${relativeFilePath}" already exists. Aborting.`);
    return;
  }

  const headerPath = path.join(__dirname, '../templates/header_template.sol');
  const specificTemplatePath = path.join(__dirname, `../templates/${templateType}.sol`);

  const concatenatedTemplate = readTemplates(headerPath, specificTemplatePath);
  const replacements = { ...templateConfig.placeholders, CONTRACT_NAME: contractName };
  const content = replacePlaceholders(concatenatedTemplate, replacements);

  fs.writeFileSync(filePath, content);
  console.log(`File created: ${filePath}`);
}

module.exports = {
  createBoilerplate,
};
