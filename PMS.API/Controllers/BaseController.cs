using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace PMS.API.Controllers;

public class BaseController : ControllerBase
{
    protected Guid UserId =>
  Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
}
