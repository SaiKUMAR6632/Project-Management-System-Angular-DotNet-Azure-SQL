namespace PMS.Application.DTOs.Auth;

public record LoginRequestDto(
    string Email,
    string Password
);
