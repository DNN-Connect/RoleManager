using DotNetNuke.Web.Api;

namespace Connect.DNN.Modules.RoleManager.Api
{
    public class RouteMapper : IServiceRouteMapper
    {
        public void RegisterRoutes(IMapRoute mapRouteManager)
        {
            mapRouteManager.MapHttpRoute("Connect/RoleManager", "RoleManagerMap1", "{controller}/{action}", null, null, new[] { "Connect.DNN.Modules.RoleManager.Api" });
            mapRouteManager.MapHttpRoute("Connect/RoleManager", "RoleManagerMap2", "{controller}/{action}/{id}", null, new { id = "-?\\d+" }, new[] { "Connect.DNN.Modules.RoleManager.Api" });
        }
    }
}