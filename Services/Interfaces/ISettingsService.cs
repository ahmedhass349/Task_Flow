using System.Threading.Tasks;
using taskflow.DTOs.Settings;
using taskflow.DTOs.Auth;

namespace taskflow.Services.Interfaces
{
    public interface ISettingsService
    {
        Task<ProfileDto> GetProfileAsync(int userId);
        Task<AuthResponse> UpdateProfileAsync(int userId, UpdateProfileRequest request);
        Task ChangePasswordAsync(int userId, ChangePasswordRequest request);
        Task DeleteAccountAsync(int userId);
    }
}
