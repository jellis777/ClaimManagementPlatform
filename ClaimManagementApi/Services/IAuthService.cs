using ClaimManagementApi.DTOs;

namespace ClaimManagementApi.Services;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterUserDto registerUserDto);
    Task<AuthResponseDto?> LoginAsync(LoginDto loginDto);
}