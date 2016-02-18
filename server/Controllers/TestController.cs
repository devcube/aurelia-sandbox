using Microsoft.AspNet.Mvc;
using Microsoft.Extensions.Logging;
using aureliasandbox.Models;

namespace aureliasandbox.Controllers
{
  public class TestController : Controller
  {
    ILogger<TestController> _logger;

    public TestController(ILogger<TestController> logger)
    {
      _logger = logger;
      _logger.LogCritical("Logger: TestController constructor");
    }

    public string Test()
    {
      _logger.LogCritical("Logger: calling /api/test/test");
      return "TestController is working!";
    }

    [HttpPost]
    public string GenerateGreeting([FromBody]TestModel testModel)
    {
      if (string.IsNullOrWhiteSpace(testModel.Name))
        return "Name is empty";

      return testModel.IsDeveloper ? $"Hello {testModel.Name}, happy coding!" : $"Hello {testModel.Name}, what do you do?";
    }
  }
}
