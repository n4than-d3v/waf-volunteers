namespace Api.Database.Entities.Notices;

public class Notice : Entity
{
    public string Title { get; set; }
    public string Content { get; set; }
    public DateTime Created { get; set; }

    public Notice()
    {
    }

    public Notice(string title, string content) : this(title, content, DateTime.UtcNow)
    {
    }

    public Notice(string title, string content, DateTime created)
    {
        Title = title;
        Content = content;
        Created = created;
    }
}
