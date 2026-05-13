// FILE: Validators/LoginRequestValidator.cs
// PHASE: Phase 5
// CHANGES: S-05 — added MaximumLength(200) on Password to bound input at the API boundary.
using FluentValidation;
using taskflow.DTOs.Auth;

namespace taskflow.Validators
{
    public class LoginRequestValidator : AbstractValidator<LoginRequest>
    {
        public LoginRequestValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required.")
                .EmailAddress().WithMessage("A valid email address is required.");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required.")
                .MinimumLength(6).WithMessage("Password must be at least 6 characters.")
                .MaximumLength(200).WithMessage("Password must not exceed 200 characters.");
        }
    }
}
