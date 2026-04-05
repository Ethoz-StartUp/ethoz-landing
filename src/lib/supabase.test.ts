import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the supabase client
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockEq = vi.fn();
const mockIn = vi.fn();
const mockOrder = vi.fn();
const mockLimit = vi.fn();
const mockSelect = vi.fn();

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({
      insert: mockInsert,
      select: (...args: any[]) => {
        mockSelect(...args);
        return {
          eq: (...eqArgs: any[]) => {
            mockEq(...eqArgs);
            return {
              in: (...inArgs: any[]) => {
                mockIn(...inArgs);
                return {
                  order: (...orderArgs: any[]) => {
                    mockOrder(...orderArgs);
                    return { limit: mockLimit };
                  },
                };
              },
            };
          },
        };
      },
      update: (...args: any[]) => {
        mockUpdate(...args);
        return { eq: mockEq };
      },
    }),
  }),
}));

// Import after mock is set up
const { saveLead, updateLeadStatus } = await import('./supabase');

const baseLead = {
  school_name: 'Colegio Test',
  contact_name: 'Test User',
  contact_role: 'Director',
  contact_email: 'test@example.com',
  status: 'new' as const,
};

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe('saveLead', () => {
  it('returns ok:true on success', async () => {
    mockInsert.mockResolvedValue({ error: null });
    const result = await saveLead(baseLead);
    expect(result).toEqual({ ok: true });
  });

  it('returns ok:false with error message on failure', async () => {
    mockInsert.mockResolvedValue({ error: { message: 'DB error' } });
    const result = await saveLead(baseLead);
    expect(result).toEqual({ ok: false, error: 'DB error' });
  });

  it('flags test emails — notes should be "[TEST] Internal team"', async () => {
    mockInsert.mockResolvedValue({ error: null });
    await saveLead({ ...baseLead, contact_email: 'ignacioaraya1995@gmail.com' });
    const insertCall = mockInsert.mock.calls[0][0];
    expect(insertCall[0].notes).toBe('[TEST] Internal team');
  });

  it('does not flag non-test emails', async () => {
    mockInsert.mockResolvedValue({ error: null });
    await saveLead({ ...baseLead, contact_email: 'real@school.cl' });
    const insertCall = mockInsert.mock.calls[0][0];
    expect(insertCall[0].notes).not.toBe('[TEST] Internal team');
  });
});

describe('updateLeadStatus', () => {
  it('returns ok:false when lead not found', async () => {
    mockLimit.mockResolvedValue({ data: [], error: null });
    const result = await updateLeadStatus('notfound@example.com', 'contacted');
    expect(result).toEqual({ ok: false, error: 'Lead not found' });
  });

  it('returns ok:false on select error', async () => {
    mockLimit.mockResolvedValue({ data: null, error: { message: 'select error' } });
    const result = await updateLeadStatus('test@example.com', 'contacted');
    expect(result).toEqual({ ok: false, error: 'select error' });
  });

  it('returns ok:true on successful status update', async () => {
    mockLimit.mockResolvedValue({ data: [{ id: '123', status: 'new' }], error: null });
    mockEq.mockResolvedValue({ error: null });
    const result = await updateLeadStatus('test@example.com', 'contacted');
    expect(result).toEqual({ ok: true });
  });

  it('is idempotent — skips update when already at target status', async () => {
    mockLimit.mockResolvedValue({ data: [{ id: '123', status: 'contacted' }], error: null });
    const result = await updateLeadStatus('test@example.com', 'contacted');
    expect(result).toEqual({ ok: true });
    expect(mockUpdate).not.toHaveBeenCalled();
  });
});
