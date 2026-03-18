using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using ClaimManagementApi.Data;
using ClaimManagementApi.DTOs;
using ClaimManagementApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace ClaimManagementApi.Tests.Integration;

public class ClaimsAuthorizationTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;
    private readonly HttpClient _client;

    public ClaimsAuthorizationTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetClaims_ShouldReturnUnauthorized_WhenNoTokenIsProvided()
    {
        // Act
        var response = await _client.GetAsync("/api/claims");

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task DeleteClaim_ShouldReturnForbidden_ForAdjuster()
    {
        // Arrange
        var token = await RegisterAndLoginAsync("adjuster-delete@test.com", "Password123");

        var claimId = await SeedClaimAsync();

        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        // Act
        var response = await _client.DeleteAsync($"/api/claims/{claimId}");

        // Assert
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task DeleteClaim_ShouldReturnNoContent_ForAdmin()
    {
        // Arrange
        await RegisterAsync("admin-delete@test.com", "Password123");

        await PromoteUserToAdminAsync("admin-delete@test.com");

        var token = await LoginAsync("admin-delete@test.com", "Password123");

        var claimId = await SeedClaimAsync();

        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        // Act
        var response = await _client.DeleteAsync($"/api/claims/{claimId}");

        // Assert
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
    }

    private async Task RegisterAsync(string email, string password)
    {
        var dto = new RegisterUserDto
        {
            Email = email,
            Password = password
        };

        await _client.PostAsJsonAsync("/api/auth/register", dto);
    }

    private async Task<string> RegisterAndLoginAsync(string email, string password)
    {
        await RegisterAsync(email, password);
        return await LoginAsync(email, password);
    }

    private async Task<string> LoginAsync(string email, string password)
    {
        var dto = new LoginDto
        {
            Email = email,
            Password = password
        };

        var response = await _client.PostAsJsonAsync("/api/auth/login", dto);
        response.EnsureSuccessStatusCode();

        var authResponse = await response.Content.ReadFromJsonAsync<AuthResponseDto>();

        return authResponse!.Token;
    }

    private async Task<int> SeedClaimAsync()
    {
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var claim = new Claim
        {
            Title = "Integration Test Claim",
            Description = "Created for authorization test",
            Amount = 123.45m,
            Status = "Open",
            CreatedAt = DateTime.UtcNow
        };

        context.Claims.Add(claim);
        await context.SaveChangesAsync();

        return claim.Id;
    }

    private async Task PromoteUserToAdminAsync(string email)
    {
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var user = await context.Users.FirstAsync(u => u.Email == email);
        user.Role = "Admin";

        await context.SaveChangesAsync();
    }
}