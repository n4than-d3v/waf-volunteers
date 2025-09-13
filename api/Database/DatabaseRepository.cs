namespace Api.Database;

public interface IDatabaseRepository
{
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

    public async void Create<TEntity>(TEntity entity) where TEntity : Entity
    {
        _context.Add(entity);
    }

    public async void Create<TEntity>(ICollection<TEntity> entities) where TEntity : Entity
    {
        _context.Add(entities);
    }

    public async void Delete<TEntity>(TEntity entity) where TEntity : Entity
    {
        _context.Remove(entity);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
