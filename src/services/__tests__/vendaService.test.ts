// Mocks must be set up before importing the service

const mockFindById = jest.fn();
const mockVendaCreate = jest.fn();
const mockEstoqueCreate = jest.fn();
const mockProdutoUpdate = jest.fn();

jest.mock('@/repository/ProdutoRepository', () => ({
  produtoRepository: {
    findById: (...args: any[]) => mockFindById(...args),
    update: (...args: any[]) => mockProdutoUpdate(...args),
  },
}));

jest.mock('@/repository/VendaRepository', () => ({
  vendaRepository: {
    create: (...args: any[]) => mockVendaCreate(...args),
  },
}));

jest.mock('@/repository/EstoqueRepository', () => ({
  estoqueRepository: {
    create: (...args: any[]) => mockEstoqueCreate(...args),
  },
}));

import { createVenda, ServiceError } from '@/services/vendaService';

describe('vendaService.createVenda', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates sale and updates stock when enough inventory', async () => {
    // product with sufficient stock
    mockFindById.mockResolvedValueOnce({ id: 'p1', nome: 'Produto 1', estoque: 5 });
    mockFindById.mockResolvedValueOnce({ id: 'p1', nome: 'Produto 1', estoque: 5 });

    // vendaRepository.create returns venda with id
    mockVendaCreate.mockResolvedValue({ id: 'v1', usuarioId: 'u1' });

    const body = {
      usuarioId: 'u1',
      itens: [
        { produtoId: 'p1', quantidade: 2, precoUnitario: 10 },
      ],
      valorTotal: 20,
    };

    const venda = await createVenda(body);
    expect(venda).toEqual({ id: 'v1', usuarioId: 'u1' });

    // estoque.create must be called with descricao containing venda id
    expect(mockEstoqueCreate).toHaveBeenCalledWith(expect.objectContaining({
      produtoId: 'p1',
      tipo: 'saida',
      quantidade: 2,
      descricao: expect.stringContaining('v1'),
    }));

    // produtoRepository.update should be called to decrement stock
    expect(mockProdutoUpdate).toHaveBeenCalledWith(expect.objectContaining({
      id: 'p1',
      estoque: 3,
    }));
  });

  it('throws 400 when insufficient stock', async () => {
    mockFindById.mockResolvedValue({ id: 'p2', nome: 'Produto 2', estoque: 1 });

    const body = {
      usuarioId: 'u1',
      itens: [
        { produtoId: 'p2', quantidade: 2, precoUnitario: 5 },
      ],
      valorTotal: 10,
    };

    await expect(createVenda(body)).rejects.toThrow(ServiceError);
    await expect(createVenda(body)).rejects.toMatchObject({ status: 400 });
  });

  it('throws 404 when produto not found', async () => {
    mockFindById.mockResolvedValue(null);

    const body = {
      usuarioId: 'u1',
      itens: [
        { produtoId: 'pX', quantidade: 1, precoUnitario: 5 },
      ],
      valorTotal: 5,
    };

    await expect(createVenda(body)).rejects.toThrow(ServiceError);
    await expect(createVenda(body)).rejects.toMatchObject({ status: 404 });
  });
});
