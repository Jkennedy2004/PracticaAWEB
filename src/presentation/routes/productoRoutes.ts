// src/presentation/routes/productoRoutes.ts
import { Router } from 'express';
import { ProductoController } from '../controllers/ProductoController';
import { ProductoService } from '../../application/services/ProductoService';
import { TypeORMProductoRepository } from '../../infrastructure/data/typeorm/repositories/TypeORMProductoRepository';
import { SequelizeProductoRepository } from '../../infrastructure/data/sequelize/repositories/SequelizeProductoRepository';

const router = Router();

// Crear instancias manualmente para testing
const ORM_TYPE = process.env.ORM_TYPE ?? 'typeorm';

let repository;
if (ORM_TYPE === 'sequelize') {
  repository = new SequelizeProductoRepository();
} else {
  repository = new TypeORMProductoRepository();
}

const productoService = new ProductoService(repository);
const productoController = new ProductoController(productoService);

// Bind methods to maintain context
const controller = {
  crear: productoController.crear.bind(productoController),
  obtener: productoController.obtener.bind(productoController),
  listar: productoController.listar.bind(productoController),
  actualizar: productoController.actualizar.bind(productoController)
};

router.post('/', controller.crear);
router.get('/', controller.listar);
router.get('/:id', controller.obtener);
router.put('/:id', controller.actualizar);

export { router as productoRoutes };