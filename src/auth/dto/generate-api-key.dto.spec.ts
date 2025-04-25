import { GenerateApiKeyDto } from './generate-api-key.dto';

describe('GenerateApiKeyDto', () => {
  it('should create DTO with role', () => {
    const dto = new GenerateApiKeyDto();
    dto.role = 'admin';

    expect(dto.role).toBe('admin');
  });

  it('should allow any string role', () => {
    const dto = new GenerateApiKeyDto();
    dto.role = 'custom-role';

    expect(dto.role).toEqual('custom-role');
  });
});
