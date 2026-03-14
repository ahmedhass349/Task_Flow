using System.Threading.Tasks;
using taskflow.Data.Entities;

namespace taskflow.Repositories.Interfaces
{
    public interface IUserRepository : IGenericRepository<AppUser>
    {
        Task<AppUser?> GetByEmailAsync(string email);
    }
}
