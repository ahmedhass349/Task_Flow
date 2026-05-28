/*
  FILE: Repositories/GenericRepository.cs
  PHASE: 3
  MISSION: 2-Performance
  CHANGES:
    - GetAllAsync: added .AsNoTracking() — all callers are read-only; eliminates EF change-tracking
      overhead per row (identity map entry, property snapshot, reverse-lookup bookkeeping).
    - FindAsync: added .AsNoTracking() — same reason; always used for read-only lookups.
    - Query: added .AsNoTracking() — complex LINQ reads with .Include() still work correctly with
      AsNoTracking (EF Core fully supports eager loading on no-tracking queries). All write callers
      already call _dbSet.Update(entity) explicitly, so tracking is not required.
    - GetByIdAsync / FirstOrDefaultAsync: intentionally left TRACKED — these are used in
      load→modify→save write patterns throughout the services.
    - ExistsAsync / CountAsync: unchanged — aggregate operations never load entities into the
      change tracker regardless.
*/
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using taskflow.Data;
using taskflow.Repositories.Interfaces;

namespace taskflow.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        protected readonly AppDbContext _context;
        protected readonly DbSet<T> _dbSet;

        public GenericRepository(AppDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }

        public async Task<T?> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _dbSet.AsNoTracking().ToListAsync();
        }

        public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbSet.AsNoTracking().Where(predicate).ToListAsync();
        }

        public async Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbSet.FirstOrDefaultAsync(predicate);
        }

        public async Task AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
        }

        public void Update(T entity)
        {
            _dbSet.Update(entity);
        }

        public void Remove(T entity)
        {
            _dbSet.Remove(entity);
        }

        public async Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbSet.AnyAsync(predicate);
        }

        public async Task<int> CountAsync(Expression<Func<T, bool>>? predicate = null)
        {
            if (predicate == null)
                return await _dbSet.CountAsync();

            return await _dbSet.CountAsync(predicate);
        }

        public IQueryable<T> Query()
        {
            return _dbSet.AsNoTracking().AsQueryable();
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
