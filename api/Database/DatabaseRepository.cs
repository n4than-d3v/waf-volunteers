using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using System;
using System.Linq.Expressions;

namespace Api.Database;

public interface IDatabaseRepository
{
    Task<TEntity?> Get<TEntity>(int id, bool tracking = true, Func<DbSet<TEntity>, IQueryable<TEntity>>? action = null) where TEntity : Entity;
    Task<TEntity?> Get<TEntity>(Expression<Func<TEntity, bool>> expression, bool tracking = true, Func<DbSet<TEntity>, IQueryable<TEntity>>? action = null) where TEntity : Entity;
    Task<IReadOnlyList<TEntity>> GetAll<TEntity>(Expression<Func<TEntity, bool>> expression, bool tracking = true, Func<DbSet<TEntity>, IQueryable<TEntity>>? action = null) where TEntity : Entity;
    void Create<TEntity>(TEntity entity) where TEntity : Entity;
    void Create<TEntity>(ICollection<TEntity> entities) where TEntity : Entity;
    void Delete<TEntity>(TEntity entity) where TEntity : Entity;
    Task SaveChangesAsync();
}

public class DatabaseRepository : IDatabaseRepository
{
    private readonly DatabaseContext _context;

    public DatabaseRepository(DatabaseContext context)
    {
        _context = context;
    }

    private DbSet<TEntity> GetSet<TEntity>() where TEntity : Entity
        => _context.Set<TEntity>();

    private IQueryable<TEntity> GetQueryable<TEntity>(bool tracking, Func<DbSet<TEntity>, IQueryable<TEntity>>? action) where TEntity : Entity
    {
        var set = GetSet<TEntity>();
        IQueryable<TEntity> queryable = (action != null) ? action(set) : set.AsQueryable();
        return tracking ? queryable : queryable.AsNoTracking();
    }

    public async Task<TEntity?> Get<TEntity>(int id, bool tracking, Func<DbSet<TEntity>, IQueryable<TEntity>>? action) where TEntity : Entity =>
         await GetQueryable<TEntity>(tracking, action).FirstOrDefaultAsync(x => x.Id == id);

    public async Task<TEntity?> Get<TEntity>(Expression<Func<TEntity, bool>> expression, bool tracking, Func<DbSet<TEntity>, IQueryable<TEntity>>? action) where TEntity : Entity =>
         await GetQueryable<TEntity>(tracking, action).FirstOrDefaultAsync(expression);

    public async Task<IReadOnlyList<TEntity>> GetAll<TEntity>(Expression<Func<TEntity, bool>> expression, bool tracking, Func<DbSet<TEntity>, IQueryable<TEntity>>? action) where TEntity : Entity
        => await GetQueryable<TEntity>(tracking, action).Where(expression).ToListAsync();

    public void Create<TEntity>(TEntity entity) where TEntity : Entity
        => GetSet<TEntity>().Add(entity);

    public void Create<TEntity>(ICollection<TEntity> entities) where TEntity : Entity
        => GetSet<TEntity>().AddRange(entities);

    public void Delete<TEntity>(TEntity entity) where TEntity : Entity
        => GetSet<TEntity>().Remove(entity);

    public async Task SaveChangesAsync()
        => await _context.SaveChangesAsync();
}
