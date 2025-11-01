import { NotFoundException } from '@/core/exceptions/NotFoundException';
// import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Request, Response } from 'express';
// import { z } from 'zod';
import { HttpErrorHandler } from './HttpErrorHandler';

describe('HttpError Handler', () => {
  let httpError: HttpErrorHandler;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    httpError = new HttpErrorHandler();

    mockJson = jest.fn().mockReturnThis();
    mockStatus = jest.fn().mockReturnThis();

    mockRequest = {
      url: '/test-route'
    };

    mockResponse = {
      status: mockStatus,
      json: mockJson
    };
  });


  describe('NotFoundException handling', () => {
    it('should return 404 status with custom message for NotFoundException', () => {
      const notFoundError = new NotFoundException('Pokemon not found');

      httpError.handle(mockRequest as Request, mockResponse as Response, notFoundError);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Pokemon not found'
      });
    });
  });

  describe('Generic error handling', () => {
    it('should return 500 status for generic error with message', () => {
      const genericError = new Error('Database connection failed');

      httpError.handle(mockRequest as Request, mockResponse as Response, genericError);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Database connection failed'
      });
    });

    it('should return 500 with default message for error without message', () => {
      const errorWithoutMessage = {};

      httpError.handle(mockRequest as Request, mockResponse as Response, errorWithoutMessage);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Internal Server Error'
      });
    });

    it('should use custom error code when provided', () => {
      const errorWithCode = { code: 422, message: 'Unprocessable Entity' };

      httpError.handle(mockRequest as Request, mockResponse as Response, errorWithCode);

      expect(mockStatus).toHaveBeenCalledWith(422);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Unprocessable Entity'
      });
    });
  });

  // describe('ZodError handling', () => {
  //   it('should return 400 status with validation message for ZodError', () => {
  //     const zodSchema = z.object({ name: z.string() });
  //     const zodError = zodSchema.safeParse({ name: 123 }).error!;

  //     httpError.handle(mockRequest as Request, mockResponse as Response, zodError);

  //     expect(mockStatus).toHaveBeenCalledWith(400);
  //     expect(mockJson).toHaveBeenCalledWith({
  //       message: 'Invalid input',
  //       fieldErrors: expect.any(String)
  //     });
  //   });
  // });

  // describe('PrismaClientKnownRequestError handling', () => {
  //   it('should return 409 for duplicate resource (P2002)', () => {
  //     const prismaError = new PrismaClientKnownRequestError('Duplicate', {
  //       code: 'P2002',
  //       clientVersion: '5.0.0'
  //     });

  //     httpError.handle(mockRequest as Request, mockResponse as Response, prismaError);

  //     expect(mockStatus).toHaveBeenCalledWith(409);
  //     expect(mockJson).toHaveBeenCalledWith({
  //       message: 'Duplicate resource'
  //     });
  //   });

  //   it('should return 404 for related resource not found (P2003)', () => {
  //     const prismaError = new PrismaClientKnownRequestError('Related not found', {
  //       code: 'P2003',
  //       clientVersion: '5.0.0'
  //     });

  //     httpError.handle(mockRequest as Request, mockResponse as Response, prismaError);

  //     expect(mockStatus).toHaveBeenCalledWith(404);
  //     expect(mockJson).toHaveBeenCalledWith({
  //       message: 'Related resource not found'
  //     });
  //   });

  //   it('should return 400 for null constraint violation (P2011)', () => {
  //     const prismaError = new PrismaClientKnownRequestError('Null constraint', {
  //       code: 'P2011',
  //       clientVersion: '5.0.0'
  //     });

  //     httpError.handle(mockRequest as Request, mockResponse as Response, prismaError);

  //     expect(mockStatus).toHaveBeenCalledWith(400);
  //     expect(mockJson).toHaveBeenCalledWith({
  //       message: 'Null constraint violation'
  //     });
  //   });

  //   it('should return 404 for resource not found (P2025)', () => {
  //     const prismaError = new PrismaClientKnownRequestError('Record not found', {
  //       code: 'P2025',
  //       clientVersion: '5.0.0'
  //     });

  //     httpError.handle(mockRequest as Request, mockResponse as Response, prismaError);

  //     expect(mockStatus).toHaveBeenCalledWith(404);
  //     expect(mockJson).toHaveBeenCalledWith({
  //       message: 'Resource not found'
  //     });
  //   });

  //   it('should return 404 for missing field (P2012)', () => {
  //     const prismaError = new PrismaClientKnownRequestError('Missing field', {
  //       code: 'P2012',
  //       clientVersion: '5.0.0'
  //     });

  //     httpError.handle(mockRequest as Request, mockResponse as Response, prismaError);

  //     expect(mockStatus).toHaveBeenCalledWith(400);
  //     expect(mockJson).toHaveBeenCalledWith({
  //       message: 'Missing required field'
  //     });
  //   });

  //   it('should return 404 for relation violation (P2014)', () => {
  //     const prismaError = new PrismaClientKnownRequestError('Relation violation', {
  //       code: 'P2014',
  //       clientVersion: '5.0.0'
  //     });

  //     httpError.handle(mockRequest as Request, mockResponse as Response, prismaError);

  //     expect(mockStatus).toHaveBeenCalledWith(400);
  //     expect(mockJson).toHaveBeenCalledWith({
  //       message: 'Relation violation'
  //     });
  //   });
  // });
});