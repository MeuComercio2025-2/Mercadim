import { writeFileSync } from 'fs';
import yaml from "js-yaml"
import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: './src/app/api', // Caminho para suas rotas API
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API do Meu Comercio',
        version: '1.0.0',
        description: 'Documentação da API do Meu Comercio',
      },
      security: [],
    },
  });
  const yamlData = yaml.dump(spec);
  writeFileSync('./swagger.yaml', yamlData, 'utf-8');
  
   console.log("✅ Arquivo swagger.yaml gerado com sucesso!");

  return spec;
};
