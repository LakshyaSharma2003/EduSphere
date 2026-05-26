using EduSphere.Backend.Domain;
using EduSphere.Backend.Infrastructure;

namespace EduSphere.Backend.Services;

public sealed class FinanceLedgerService(EduSphereSeedStore store)
{
    public FinanceLedger? GetLedger(string studentId)
    {
        return store.Snapshot()
            .FinanceLedgers
            .FirstOrDefault(ledger => ledger.StudentId.Equals(studentId, StringComparison.OrdinalIgnoreCase));
    }
}
