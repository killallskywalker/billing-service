import { UseApiDocs, UseApiDocsOptions } from './api-response-decorator';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiResponse,
} from '@nestjs/swagger';
import {
  SuccessResponseDto,
  ErrorResponseDto,
  PaginationMetaDto,
} from '../dto/api-response.dto';

class DummyDto {}

jest.mock('@nestjs/common', () => {
  const original: typeof import('@nestjs/common') =
    jest.requireActual('@nestjs/common');
  return {
    ...original,
    applyDecorators: jest.fn(() => 'mocked-decorator'),
  };
});

jest.mock('@nestjs/swagger', () => {
  const actual: typeof import('@nestjs/swagger') =
    jest.requireActual('@nestjs/swagger');
  return {
    ...actual,
    ApiExtraModels: jest.fn(),
    ApiOkResponse: jest.fn(),
    ApiCreatedResponse: jest.fn(),
    ApiResponse: jest.fn(),
    getSchemaPath: (model: string) => `#/components/schemas/${model}`,
  };
});

describe('UseApiDocs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should apply ApiExtraModels and ApiOkResponse by default', () => {
    const result = UseApiDocs(DummyDto);

    expect(ApiExtraModels).toHaveBeenCalledWith(
      SuccessResponseDto,
      ErrorResponseDto,
      DummyDto,
      PaginationMetaDto,
    );

    expect(result).toBe('mocked-decorator');
  });

  it('should apply all expected decorators when all options are true', () => {
    const options: UseApiDocsOptions = {
      ok: true,
      created: true,
      notFound: true,
      unprocessable: true,
      serverError: true,
      isArray: true,
    };

    UseApiDocs(DummyDto, options);

    expect(ApiExtraModels).toHaveBeenCalledWith(
      SuccessResponseDto,
      ErrorResponseDto,
      DummyDto,
      PaginationMetaDto,
    );
    expect(ApiOkResponse).toHaveBeenCalled();
    expect(ApiCreatedResponse).toHaveBeenCalled();
    expect(ApiResponse).toHaveBeenCalledWith(
      expect.objectContaining({ status: 404 }),
    );
    expect(ApiResponse).toHaveBeenCalledWith(
      expect.objectContaining({ status: 422 }),
    );
    expect(ApiResponse).toHaveBeenCalledWith(
      expect.objectContaining({ status: 500 }),
    );
  });
});
