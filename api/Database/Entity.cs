using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Database;

[PrimaryKey(nameof(Id))]
public abstract class Entity
{
    /// <summary>
    /// Unique identifier for record
    /// </summary>
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
}
