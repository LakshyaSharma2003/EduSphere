using EduSphere.Backend.Domain;
using EduSphere.Backend.Infrastructure;
using EduSphere.Backend.Services;
using Xunit;

namespace EduSphere.Backend.Tests;

public sealed class AcademicOperationsServiceTests
{
    [Fact]
    public async Task PlaceCourseBidAsyncRejectsEmptyStudent()
    {
        var service = new AcademicOperationsService(new EduSphereSeedStore());

        var result = await service.PlaceCourseBidAsync("CS501", new CourseBidRequest("", 3));

        Assert.False(result.Accepted);
        Assert.Contains("Student id", result.Message);
    }

    [Fact]
    public async Task PlaceCourseBidAsyncAcceptsValidBid()
    {
        var service = new AcademicOperationsService(new EduSphereSeedStore());

        var result = await service.PlaceCourseBidAsync("CS501", new CourseBidRequest("STU-1001", 3));

        Assert.True(result.Accepted);
    }
}
