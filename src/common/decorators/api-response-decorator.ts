import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  SuccessResponseDto,
  ErrorResponseDto,
  PaginationMetaDto,
} from '../dto/api-response.dto';

export interface UseApiDocsOptions {
  ok?: boolean;
  created?: boolean;
  notFound?: boolean;
  unprocessable?: boolean;
  serverError?: boolean;
  isArray?: boolean;
  paginated?: boolean;
}

export function UseApiDocs(
  model: Type<unknown>,
  options: UseApiDocsOptions = { ok: true, serverError: true },
): MethodDecorator {
  const decorators = [
    ApiExtraModels(
      SuccessResponseDto,
      ErrorResponseDto,
      model,
      PaginationMetaDto,
    ),
  ];

  const isArray = options.isArray ?? false;
  const isPaginated = options.paginated ?? false;

  let dataSchema;

  if (isPaginated) {
    dataSchema = {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: { $ref: getSchemaPath(model) },
        },
        meta: {
          $ref: getSchemaPath(PaginationMetaDto),
        },
      },
      required: ['items', 'meta'],
    };
  } else if (isArray) {
    dataSchema = {
      type: 'array',
      items: { $ref: getSchemaPath(model) },
    };
  } else {
    dataSchema = { $ref: getSchemaPath(model) };
  }

  const successSchema = {
    allOf: [
      { $ref: getSchemaPath(SuccessResponseDto) },
      {
        properties: {
          success: { example: true },
          message: { example: 'Success message' },
          data: dataSchema,
        },
        required: ['success', 'message', 'data'],
      },
    ],
  };

  const errorSchema = {
    allOf: [
      { $ref: getSchemaPath(ErrorResponseDto) },
      {
        properties: {
          success: { example: false },
          message: { example: 'Error message' },
          error: {
            example: { message: 'Error message', error: 'Error Detail' },
          },
        },
        required: ['success', 'message', 'error'],
      },
    ],
  };

  if (options.ok) {
    decorators.push(
      ApiOkResponse({
        description: 'Successful response',
        schema: successSchema,
      }),
    );
  }

  if (options.created) {
    decorators.push(
      ApiCreatedResponse({
        description: 'Created successfully',
        schema: successSchema,
      }),
    );
  }

  if (options.notFound) {
    decorators.push(
      ApiResponse({
        status: 404,
        description: 'Resource not found',
        schema: errorSchema,
      }),
    );
  }

  if (options.unprocessable) {
    decorators.push(
      ApiResponse({
        status: 422,
        description: 'Unprocessable Entity',
        schema: errorSchema,
      }),
    );
  }

  if (options.serverError) {
    decorators.push(
      ApiResponse({
        status: 500,
        description: 'Internal Server Error',
        schema: errorSchema,
      }),
    );
  }

  return applyDecorators(...decorators);
}
