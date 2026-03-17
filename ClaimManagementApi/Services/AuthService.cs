using System.IdentityModel.Tokens.Jwt;
using SecurityClaim = System.Security.Claims.Claim;
using System.Text;
using ClaimManagementApi.Data;
using ClaimManagementApi.DTOs;
using ClaimManagementApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;


namespace ClaimManagementApi.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthService(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterUserDto registerUserDto)
    {
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == registerUserDto.Email);

        if (existingUser is not null)
        {
            throw new Exception("A user with that email already exists.");
        }

        var user = new User
        {
            Email = registerUserDto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerUserDto.Password),
            Role = "Adjuster"
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var token = GenerateJwtToken(user);

        return new AuthResponseDto
        {
            Email = user.Email,
            Role = user.Role,
            Token = token
        };
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginDto loginDto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

        if (user is null)
        {
            return null;
        }

        var passwordIsValid = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash);

        if (!passwordIsValid)
        {
            return null;
        }

        var token = GenerateJwtToken(user);

        return new AuthResponseDto
        {
            Email = user.Email,
            Role = user.Role,
            Token = token
        };
    }

    private string GenerateJwtToken(User user)
    {
        var jwtSettings = _configuration.GetSection("Jwt");

        var key = jwtSettings["Key"] ?? throw new Exception("JWT Key is missing.");
        var issuer = jwtSettings["Issuer"] ?? throw new Exception("JWT Issuer is missing.");
        var audience = jwtSettings["Audience"] ?? throw new Exception("JWT Audience is missing.");

        var claims = new List<SecurityClaim>
            {
                new SecurityClaim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new SecurityClaim(ClaimTypes.Email, user.Email),
                new SecurityClaim(ClaimTypes.Role, user.Role)
            };

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(2),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}