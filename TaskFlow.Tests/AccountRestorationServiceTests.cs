// FILE: TaskFlow.Tests/AccountRestorationServiceTests.cs
// PURPOSE: Unit tests for AccountRestorationService — the core of the reinstall-login fix.
//
// Scenarios covered:
//   1. No MongoDB backup exists (user offline or never registered) → returns null
//   2. Backup found but password wrong → throws UnauthorizedAccessException
//   3. Backup found, correct password, no presence data → user restored, IsBackedUpToMongo = true
//   4. Backup found, correct password, presence data present → full name/avatar populated
//   5. Presence data exists but no entry matches this email → still restores with empty name

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using taskflow.Data.Entities;
using taskflow.DTOs.Mongo;
using taskflow.Models.Mongo;
using taskflow.Repositories.Interfaces;
using taskflow.Services;
using taskflow.Services.Interfaces;
using Xunit;

namespace TaskFlow.Tests
{
    public class AccountRestorationServiceTests
    {
        private readonly Mock<IMongoService> _mongoMock = new();
        private readonly Mock<IUserRepository> _userRepoMock = new();
        private readonly AccountRestorationService _sut;

        // Pre-computed BCrypt hash of "correct_pass" — avoids re-hashing on every test run
        // while still exercising the real BCrypt.Verify path inside AccountRestorationService.
        private static readonly string _validHash =
            BCrypt.Net.BCrypt.HashPassword("correct_pass");

        public AccountRestorationServiceTests()
        {
            _sut = new AccountRestorationService(
                _mongoMock.Object,
                _userRepoMock.Object,
                NullLogger<AccountRestorationService>.Instance);
        }

        // ── Scenario 1 ────────────────────────────────────────────────────────

        [Fact]
        public async Task TryRestoreAsync_Returns_Null_When_No_MongoDB_Backup()
        {
            // Arrange — MongoDB has no credential record for this address
            _mongoMock.Setup(m => m.FindAccountForRestorationAsync("alice@example.com"))
                      .ReturnsAsync((UserAccount?)null);

            // Act
            var result = await _sut.TryRestoreAsync("alice@example.com", "any_password");

            // Assert — null signals "unknown user (or offline); show generic error"
            Assert.Null(result);
            _userRepoMock.Verify(r => r.AddAsync(It.IsAny<AppUser>()), Times.Never,
                "SQLite must not be written when no backup is found");
        }

        // ── Scenario 2 ────────────────────────────────────────────────────────

        [Fact]
        public async Task TryRestoreAsync_Throws_UnauthorizedAccess_When_Password_Wrong()
        {
            // Arrange — backup found but the caller supplies the wrong password
            _mongoMock.Setup(m => m.FindAccountForRestorationAsync("alice@example.com"))
                      .ReturnsAsync(new UserAccount
                      {
                          Email = "alice@example.com",
                          PasswordHash = _validHash,
                          SqliteId = 1
                      });

            // Act + Assert
            await Assert.ThrowsAsync<UnauthorizedAccessException>(
                () => _sut.TryRestoreAsync("alice@example.com", "wrong_pass"));

            _userRepoMock.Verify(r => r.AddAsync(It.IsAny<AppUser>()), Times.Never,
                "SQLite must not be written when the password is incorrect");
        }

        // ── Scenario 3 ────────────────────────────────────────────────────────

        [Fact]
        public async Task TryRestoreAsync_Returns_RestoredUser_When_Credentials_Valid()
        {
            // Arrange
            _mongoMock.Setup(m => m.FindAccountForRestorationAsync("alice@example.com"))
                      .ReturnsAsync(new UserAccount
                      {
                          Email = "alice@example.com",
                          PasswordHash = _validHash,
                          SqliteId = 1
                      });
            _mongoMock.Setup(m => m.SearchUsersAsync(It.IsAny<string>(), It.IsAny<string>()))
                      .ReturnsAsync(new List<UserSearchResultDto>());  // no presence data

            // Act
            var result = await _sut.TryRestoreAsync("alice@example.com", "correct_pass");

            // Assert
            Assert.NotNull(result);
            Assert.Equal("alice@example.com", result.Email);
            Assert.Equal(_validHash, result.PasswordHash);   // hash is reused, not re-hashed
            Assert.True(result.IsBackedUpToMongo,
                "Restored user should be flagged so BulkSync doesn't try to push again");

            _userRepoMock.Verify(r => r.AddAsync(It.IsAny<AppUser>()), Times.Once,
                "Restored user must be persisted to SQLite");
            _userRepoMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        }

        // ── Scenario 4 ────────────────────────────────────────────────────────

        [Fact]
        public async Task TryRestoreAsync_Enriches_Profile_From_Presence_Data()
        {
            // Arrange — MongoDB user_presence has a matching entry
            _mongoMock.Setup(m => m.FindAccountForRestorationAsync("alice@example.com"))
                      .ReturnsAsync(new UserAccount
                      {
                          Email = "alice@example.com",
                          PasswordHash = _validHash,
                          SqliteId = 1
                      });
            _mongoMock.Setup(m => m.SearchUsersAsync(It.IsAny<string>(), It.IsAny<string>()))
                      .ReturnsAsync(new List<UserSearchResultDto>
                      {
                          new()
                          {
                              Email = "alice@example.com",
                              FullName = "Alice Smith",
                              AvatarUrl = "https://cdn.example.com/alice.png"
                          }
                      });

            // Act
            var result = await _sut.TryRestoreAsync("alice@example.com", "correct_pass");

            // Assert — name parts and avatar populated from presence record
            Assert.NotNull(result);
            Assert.Equal("Alice Smith", result.FullName);
            Assert.Equal("Alice", result.FirstName);
            Assert.Equal("Smith", result.LastName);
            Assert.Equal("https://cdn.example.com/alice.png", result.AvatarUrl);
        }

        // ── Scenario 5 ────────────────────────────────────────────────────────

        [Fact]
        public async Task TryRestoreAsync_Handles_Presence_With_No_Matching_Email()
        {
            // Arrange — presence collection has data, but none for this specific email
            _mongoMock.Setup(m => m.FindAccountForRestorationAsync("bob@example.com"))
                      .ReturnsAsync(new UserAccount
                      {
                          Email = "bob@example.com",
                          PasswordHash = _validHash,
                          SqliteId = 2
                      });
            _mongoMock.Setup(m => m.SearchUsersAsync(It.IsAny<string>(), It.IsAny<string>()))
                      .ReturnsAsync(new List<UserSearchResultDto>
                      {
                          // Different user's entry — should not be picked up
                          new() { Email = "carol@example.com", FullName = "Carol", AvatarUrl = "" }
                      });

            // Act
            var result = await _sut.TryRestoreAsync("bob@example.com", "correct_pass");

            // Assert — restores successfully but with empty profile fields
            Assert.NotNull(result);
            Assert.Equal("bob@example.com", result.Email);
            Assert.Equal(string.Empty, result.FullName);
            Assert.True(result.IsBackedUpToMongo);
        }
    }
}
