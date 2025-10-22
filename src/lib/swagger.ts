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
  return spec;
};
