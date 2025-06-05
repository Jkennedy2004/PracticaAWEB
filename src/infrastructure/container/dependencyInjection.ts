import 'reflect-metadata';
import { Container } from 'inversify';
import { IProductoRepository } from '../../domain/interfaces/IProductoRepository';
import { ProductoService } from '../../application/services/ProductoService';
import { ProductoController } from '../../presentation/controllers/ProductoController';

// Importar las implementaciones de repositorios
import { SequelizeProductoRepository } from '../data/sequelize/repositories/SequelizeProductoRepository';
import { TypeORMProductoRepository } from '../data/typeorm/repositories/TypeORMProductoRepository';

// Definir símbolos para la inyección de dependencias
const TYPES = {
  ProductoRepository: Symbol.for('ProductoRepository'),
  ProductoService: Symbol.for('ProductoService'),
  ProductoController: Symbol.for('ProductoController')
};

const container = new Container();

// Configurar qué implementación usar según variable de entorno
const ORM_TYPE = process.env.ORM_TYPE ?? 'typeorm'; // 'typeorm' o 'sequelize'

console.log(`🔧 Configurando container con ORM: ${ORM_TYPE}`);

// Bind del repositorio
if (ORM_TYPE === 'sequelize') {
  container.bind<IProductoRepository>(TYPES.ProductoRepository).to(SequelizeProductoRepository).inSingletonScope();
} else {
  container.bind<IProductoRepository>(TYPES.ProductoRepository).to(TypeORMProductoRepository).inSingletonScope();
}

// Bind del servicio - usando inject decorator
container.bind<ProductoService>(TYPES.ProductoService).to(ProductoService).inSingletonScope();

// Bind del controlador - usando inject decorator  
container.bind<ProductoController>(TYPES.ProductoController).to(ProductoController).inSingletonScope();

export { container, TYPES };