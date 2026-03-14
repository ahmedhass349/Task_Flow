using System.Threading.Tasks;
using taskflow.DTOs.Auth;

namespace taskflow.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponse> LoginAsync(LoginRequest request);
        Task<AuthResponse> RegisterAsync(RegisterRequest request);
        Task<string> ForgotPasswordAsync(ForgotPasswordRequest request);
        Task ResetPasswordAsync(ResetPasswordRequest request);
        Task<UserDto> GetCurrentUserAsync(int userId);
    }
}
