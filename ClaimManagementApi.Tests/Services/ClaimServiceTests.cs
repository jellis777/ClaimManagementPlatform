using ClaimManagementApi.Data;
using ClaimManagementApi.DTOs;
using ClaimManagementApi.Models;
using ClaimManagementApi.Services;
using Microsoft.EntityFrameworkCore;

namespace ClaimManagementApi.Tests.Services;

public class ClaimServiceTests
{
    private static AppDbContext CreateDbContext(string databaseName)
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName)
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task GetClaimsAsync_ShouldReturnAllClaims()
    {
        // Arrange
        using var context = CreateDbContext(nameof(GetClaimsAsync_ShouldReturnAllClaims));

        context.Claims.AddRange(
            new Claim
            {
                Title = "Claim One",
                Description = "First claim description",
                Amount = 100.00m,
                Status = "Open",
                CreatedAt = DateTime.UtcNow
            },
            new Claim
            {
                Title = "Claim Two",
                Description = "Second claim description",
                Amount = 250.00m,
                Status = "Closed",
                CreatedAt = DateTime.UtcNow
            }
        );

        await context.SaveChangesAsync();

        var service = new ClaimService(context);

        // Act
        var result = await service.GetClaimsAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.Count());
    }

    [Fact]
    public async Task GetClaimByIdAsync_ShouldReturnClaim_WhenClaimExists()
    {
        // Arrange
        using var context = CreateDbContext(nameof(GetClaimByIdAsync_ShouldReturnClaim_WhenClaimExists));

        var claim = new Claim
        {
            Title = "Existing Claim",
            Description = "Claim description",
            Amount = 175.00m,
            Status = "Open",
            CreatedAt = DateTime.UtcNow
        };

        context.Claims.Add(claim);
        await context.SaveChangesAsync();

        var service = new ClaimService(context);

        // Act
        var result = await service.GetClaimByIdAsync(claim.Id);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Existing Claim", result!.Title);
        Assert.Equal(175.00m, result.Amount);
    }

    [Fact]
    public async Task GetClaimByIdAsync_ShouldReturnNull_WhenClaimDoesNotExist()
    {
        // Arrange
        using var context = CreateDbContext(nameof(GetClaimByIdAsync_ShouldReturnNull_WhenClaimDoesNotExist));
        var service = new ClaimService(context);

        // Act
        var result = await service.GetClaimByIdAsync(999);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task CreateClaimAsync_ShouldCreateAndReturnClaim()
    {
        // Arrange
        using var context = CreateDbContext(nameof(CreateClaimAsync_ShouldCreateAndReturnClaim));
        var service = new ClaimService(context);

        var dto = new CreateClaimDto
        {
            Title = "New Claim",
            Description = "New claim description",
            Amount = 300.00m
        };

        // Act
        var result = await service.CreateClaimAsync(dto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("New Claim", result.Title);
        Assert.Equal("New claim description", result.Description);
        Assert.Equal(300.00m, result.Amount);

        var savedClaim = await context.Claims.FirstOrDefaultAsync(c => c.Title == "New Claim");
        Assert.NotNull(savedClaim);
    }

    [Fact]
    public async Task UpdateClaimAsync_ShouldUpdateClaim_WhenClaimExists()
    {
        // Arrange
        using var context = CreateDbContext(nameof(UpdateClaimAsync_ShouldUpdateClaim_WhenClaimExists));

        var claim = new Claim
        {
            Title = "Old Title",
            Description = "Old description",
            Amount = 120.00m,
            Status = "Open",
            CreatedAt = DateTime.UtcNow
        };

        context.Claims.Add(claim);
        await context.SaveChangesAsync();

        var service = new ClaimService(context);

        var dto = new UpdateClaimDto
        {
            Title = "Updated Title",
            Description = "Updated description",
            Amount = 500.00m,
            Status = "Closed"
        };

        // Act
        var result = await service.UpdateClaimAsync(claim.Id, dto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Updated Title", result!.Title);
        Assert.Equal("Updated description", result.Description);
        Assert.Equal(500.00m, result.Amount);
        Assert.Equal("Closed", result.Status);
    }

    [Fact]
    public async Task UpdateClaimAsync_ShouldReturnNull_WhenClaimDoesNotExist()
    {
        // Arrange
        using var context = CreateDbContext(nameof(UpdateClaimAsync_ShouldReturnNull_WhenClaimDoesNotExist));
        var service = new ClaimService(context);

        var dto = new UpdateClaimDto
        {
            Title = "Updated Title",
            Description = "Updated description",
            Amount = 500.00m,
            Status = "Closed"
        };

        // Act
        var result = await service.UpdateClaimAsync(999, dto);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task DeleteClaimAsync_ShouldReturnTrue_WhenClaimExists()
    {
        // Arrange
        using var context = CreateDbContext(nameof(DeleteClaimAsync_ShouldReturnTrue_WhenClaimExists));

        var claim = new Claim
        {
            Title = "Delete Me",
            Description = "Delete this claim",
            Amount = 220.00m,
            Status = "Open",
            CreatedAt = DateTime.UtcNow
        };

        context.Claims.Add(claim);
        await context.SaveChangesAsync();

        var service = new ClaimService(context);

        // Act
        var result = await service.DeleteClaimAsync(claim.Id);

        // Assert
        Assert.True(result);
        Assert.Empty(context.Claims);
    }

    [Fact]
    public async Task DeleteClaimAsync_ShouldReturnFalse_WhenClaimDoesNotExist()
    {
        // Arrange
        using var context = CreateDbContext(nameof(DeleteClaimAsync_ShouldReturnFalse_WhenClaimDoesNotExist));
        var service = new ClaimService(context);

        // Act
        var result = await service.DeleteClaimAsync(999);

        // Assert
        Assert.False(result);
    }
}