using DotNetNuke.Web.Mvc.Framework.Controllers;
using DotNetNuke.Web.Mvc.Routing;
using System.Web.Mvc;
using System.Web.Routing;

namespace Connect.DNN.Modules.RoleManager.Common
{
    public class RoleManagerMvcController : DnnController
    {

        private ContextHelper _rolemanagerModuleContext;
        public ContextHelper RoleManagerModuleContext
        {
            get { return _rolemanagerModuleContext ?? (_rolemanagerModuleContext = new ContextHelper(this)); }
        }

    }
}