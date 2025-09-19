using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Api.Database;

public interface IDatabaseRepository
{
    Task<TEntity?> Get<TEntity>(int id, bool tracking = true) where TEntity : Entity;
    Task<TEntity?> Get<TEntity>(Expression<Func<TEntity, bool>> expression, bool tracking = true) where TEntity : Entity;
    Task<IReadOnlyList<TEntity>> GetAll<TEntity>(Expression<Func<TEntity, bool>> expression, bool tracking = true) where TEntity : Entity;
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

    private IQueryable<TEntity> GetQueryable<TEntity>(bool tracking) where TEntity : Entity
        => tracking ? GetSet<TEntity>().AsNoTracking() : GetSet<TEntity>();

    public async Task<TEntity?> Get<TEntity>(int id, bool tracking) where TEntity : Entity =>
         await GetQueryable<TEntity>(tracking).FirstOrDefaultAsync(x => x.Id == id);

    public async Task<TEntity?> Get<TEntity>(Expression<Func<TEntity, bool>> expression, bool tracking) where TEntity : Entity =>
         await GetQueryable<TEntity>(tracking).FirstOrDefaultAsync(expression);

    public async Task<IReadOnlyList<TEntity>> GetAll<TEntity>(Expression<Func<TEntity, bool>> expression, bool tracking) where TEntity : Entity
        => await GetQueryable<TEntity>(tracking).Where(expression).ToListAsync();

    public void Create<TEntity>(TEntity entity) where TEntity : Entity
        => GetSet<TEntity>().Add(entity);

    public void Create<TEntity>(ICollection<TEntity> entities) where TEntity : Entity
        => GetSet<TEntity>().AddRange(entities);

    public void Delete<TEntity>(TEntity entity) where TEntity : Entity
        => GetSet<TEntity>().Remove(entity);

    public async Task SaveChangesAsync()
        => await _context.SaveChangesAsync();
}
