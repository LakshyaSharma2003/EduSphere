using EduSphere.Backend.Domain;
using EduSphere.Backend.Infrastructure;

namespace EduSphere.Backend.Services;

public sealed class AuditTrailService(EduSphereSeedStore store)
{
    public IReadOnlyList<AuditEvent> Events => store.Snapshot().AuditEvents;

    public void Record(string action, string actorId, string payloadSummary)
    {
        store.AddAudit(new AuditEvent(
            Guid.NewGuid().ToString("N"),
            action,
            actorId,
            "127.0.0.1",
            payloadSummary,
            DateTimeOffset.UtcNow));
    }
}
