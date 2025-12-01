namespace Api.Database.Entities.Notices;

public class NoticeAttachment : Entity
{
    public Notice Notice { get; set; }
    public string FileName { get; set; }
    public string ContentType { get; set; }
    public byte[] Data { get; set; }
}
