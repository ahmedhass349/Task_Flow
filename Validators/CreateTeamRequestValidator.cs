using FluentValidation;
using taskflow.DTOs.Teams;

namespace taskflow.Validators
{
    public class CreateTeamRequestValidator : AbstractValidator<CreateTeamRequest>
    {
        public CreateTeamRequestValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Team name is required.")
                .MaximumLength(150).WithMessage("Team name must not exceed 150 characters.");
        }
    }
}
