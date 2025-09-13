using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Database;

public abstract class Entity
{
    /// <summary>
    /// Unique identifier for record
    /// </summary>
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
}
