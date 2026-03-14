// FILE: Validators/UpdateTeamRequestValidator.cs
// STATUS: NEW
// CHANGES: Created for missing UpdateTeam endpoint (#22)

using FluentValidation;
using taskflow.DTOs.Teams;

namespace taskflow.Validators
{
    public class UpdateTeamRequestValidator : AbstractValidator<UpdateTeamRequest>
    {
        public UpdateTeamRequestValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Team name is required.")
                .MaximumLength(150).WithMessage("Team name must not exceed 150 characters.");

            RuleFor(x => x.Description)
                .MaximumLength(500).WithMessage("Description must not exceed 500 characters.")
                .When(x => x.Description != null);
        }
    }
}
