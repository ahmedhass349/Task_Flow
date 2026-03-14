using FluentValidation;
using taskflow.DTOs.Teams;
using taskflow.Data.Entities;

namespace taskflow.Validators
{
    public class AddTeamMemberRequestValidator : AbstractValidator<AddTeamMemberRequest>
    {
        public AddTeamMemberRequestValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required.")
                .EmailAddress().WithMessage("A valid email address is required.");

            RuleFor(x => x.Role)
                .IsInEnum().WithMessage("Role must be a valid team role (Member or Admin).");
        }
    }
}
