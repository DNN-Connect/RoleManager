using System.Web.Mvc;
using Connect.DNN.Modules.RoleManager.Common;

namespace Connect.DNN.Modules.RoleManager.Controllers
{
    public class HomeController: RoleManagerMvcController
    {
        [HttpGet]
        public ActionResult Index()
        {
            return View(RoleManagerModuleContext.Settings.View);
        }
    }
}
