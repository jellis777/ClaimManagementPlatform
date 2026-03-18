
using ClaimManagementApi.Data;
using ClaimManagementApi.DTOs;
using ClaimManagementApi.Models;
using ClaimManagementApi.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace ClaimManagementApi.Tests.Services
{
    public class AuthServiceTests
    {
        private static AppDbContext CreateDbContext(string databaseName)
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName)
            .Options;

            return new AppDbContext(options);
        }

        private static IConfiguration CreateConfiguration()
        {
            var settings = new Dictionary<string, string?>
            {
                {"Jwt:Key", "ThisIsMySuperSecureJwtKey12345!!!!!"},
                {"Jwt:Issuer", "ClaimManagementApi"},
                {"Jwt:Audience", "ClaimManagementApiUsers"}
            };

            return new ConfigurationBuilder()
            .AddInMemoryCollection(settings)
            .Build();
        }

        [Fact]
        public async Task RegisterAsync_ShouldCreateUser_WhenEmailDoesNotExist()
        {
            // Arrange
            using var context = CreateDbContext(nameof(RegisterAsync_ShouldCreateUser_WhenEmailDoesNotExist));
            var configuration = CreateConfiguration();
            var authService = new AuthService(context, configuration);

            var dto = new RegisterUserDto
            {
                Email = "newuser@test.com",
                Password = "Password123"
            };

            // Act 
            var result = await authService.RegisterAsync(dto);

            // Assert 
            Assert.NotNull(result);
            Assert.Equal("newuser@test.com", result.Email);
            Assert.Equal("Adjuster", result.Role);
            Assert.False(string.IsNullOrWhiteSpace(result.Token));

            var savedUser = await context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            Assert.NotNull(savedUser);
            Assert.Equal("Adjuster", savedUser.Role);
            Assert.NotEqual(dto.Password, savedUser.PasswordHash);
            Assert.True(BCrypt.Net.BCrypt.Verify(dto.Password, savedUser.PasswordHash));
        }

        [Fact]
        public async Task RegisterAsync_ShouldThrowException_WhenEmailAlreadyExists()
        {
            // Arrange
            using var context = CreateDbContext(nameof(RegisterAsync_ShouldThrowException_WhenEmailAlreadyExists));
            var configuration = CreateConfiguration();

            context.Users.Add(new User
            {
                Email = "existing@test.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123"),
                Role = "Adjuster"
            });

            await context.SaveChangesAsync();

            var authService = new AuthService(context, configuration);

            var dto = new RegisterUserDto
            {
                Email = "existing@test.com",
                Password = "Password123"
            };

            // Act + Assert
            var exception = await Assert.ThrowsAsync<Exception>(() => authService.RegisterAsync(dto));
            Assert.Equal("A user with that email already exists.", exception.Message);
        }

        [Fact]
        public async Task LoginAsync_ShouldReturnAuthResponse_WhenCredentialsAreValid()
        {
            // Arrange
            using var context = CreateDbContext(nameof(LoginAsync_ShouldReturnAuthResponse_WhenCredentialsAreValid));
            var configuration = CreateConfiguration();

            var password = "Password123";

            context.Users.Add(new User
            {
                Email = "login@test.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                Role = "Admin"
            }
            );

            await context.SaveChangesAsync();

            var authService = new AuthService(context, configuration);

            var dto = new LoginDto
            {
                Email = "login@test.com",
                Password = password
            };

            // Act 
            var result = await authService.LoginAsync(dto);

            // Assert 
            Assert.NotNull(result);
            Assert.Equal("login@test.com", result!.Email);
            Assert.Equal("Admin", result.Role);
            Assert.False(string.IsNullOrWhiteSpace(result.Token));
        }

        [Fact]
        public async Task LoginAsync_ShouldReturnNull_WhenEmailDoesNotExist()
        {
            // Arrange
            using var context = CreateDbContext(nameof(LoginAsync_ShouldReturnNull_WhenEmailDoesNotExist));
            var configuration = CreateConfiguration();
            var authService = new AuthService(context, configuration);

            var dto = new LoginDto
            {
                Email = "missing@test.com",
                Password = "Password123"
            };

            // Act 
            var result = await authService.LoginAsync(dto);

            // Assert
            Assert.Null(result);

        }

        [Fact]
        public async Task LoginAsync_ShouldReturnNull_WhenPasswordIsWrong()
        {
            // Arrange 
            using var context = CreateDbContext(nameof(LoginAsync_ShouldReturnNull_WhenPasswordIsWrong));
            var configuration = CreateConfiguration();

            context.Users.Add(new User
            {
                Email = "wrongpassword@test.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("CorrectPassword123"),
                Role = "Adjuster"
            });

            await context.SaveChangesAsync();

            var authService = new AuthService(context, configuration);

            var dto = new LoginDto
            {
                Email = "wrongpassword@test.com",
                Password = "WrongPassword"
            };

            // Act 
            var result = await authService.LoginAsync(dto);

            // Assert 
            Assert.Null(result);
        }
    }
}