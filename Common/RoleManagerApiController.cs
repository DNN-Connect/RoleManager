using DotNetNuke.Web.Api;
using System.Net;
using System.Net.Http;

namespace Connect.DNN.Modules.RoleManager.Common
{
    public class RoleManagerApiController : DnnApiController
    {
        private ContextHelper _rolemanagerModuleContext;
        public ContextHelper RoleManagerModuleContext
        {
            get { return _rolemanagerModuleContext ?? (_rolemanagerModuleContext = new ContextHelper(this)); }
        }

        public HttpResponseMessage ServiceError(string message) {
            return Request.CreateResponse(HttpStatusCode.InternalServerError, message);
        }

        public HttpResponseMessage AccessViolation(string message)
        {
            return Request.CreateResponse(HttpStatusCode.Unauthorized, message);
        }

    }
}