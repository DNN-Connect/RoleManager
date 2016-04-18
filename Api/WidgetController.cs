using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web;
using DotNetNuke.Web.Api;
using Connect.RoleManager.Core.Repositories;

namespace Connect.DNN.Modules.RoleManager.Api
{

    public partial class WidgetController : RoleManagerApiController
    {
        private readonly IWidgetRepository _repository;

        public WidgetController() : this(WidgetRepository.Instance) { }

        public WidgetController(IWidgetRepository repository)
        {
            Requires.NotNull(repository);
            _repository = repository;
        }

    }
}
