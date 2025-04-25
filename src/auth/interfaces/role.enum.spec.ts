import { Role } from './role.enum';

describe('Role Enum', () => {
  it('should have correct values', () => {
    expect(Role.User).toBe('user');
    expect(Role.Admin).toBe('admin');
  });

  it('should include all defined roles', () => {
    const allRoles = Object.values(Role);
    expect(allRoles).toContain('user');
    expect(allRoles).toContain('admin');
  });

  it('should not contain undefined roles', () => {
    const allRoles = Object.values(Role);
    expect(allRoles).not.toContain('superuser');
  });
});
