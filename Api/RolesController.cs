using System.Net;
using System.Net.Http;
using System.Web.Http;
using Connect.DNN.Modules.RoleManager.Common;
using DotNetNuke.Entities.Users;
using System.Linq;
using System.Collections.Generic;
using DotNetNuke.Data;
using DotNetNuke.Web.Api;
using DotNetNuke.Security.Roles;

namespace Connect.DNN.Modules.RoleManager.Api
{
    public class RolesController : RoleManagerApiController
    {

        public class RMUser
        {
            public int UserId { get; set; }
            public string DisplayName { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string Email { get; set; }
        }

        [HttpGet()]
        [RoleManagerAuthorize(SecurityLevel = SecurityAccessLevel.View)]
        public HttpResponseMessage Users(int id)
        {
            var role = (new RoleController()).GetRoleById(ActiveModule.PortalID, id);
            IEnumerable<RMUser> members;
            using (var context = DataContext.Instance())
            {
                members = context.ExecuteQuery<RMUser>(System.Data.CommandType.StoredProcedure,
                    "{databaseOwner}{objectQualifier}GetUsersByRolename", ActiveModule.PortalID,
                    role.RoleName).OrderBy(u => u.LastName).OrderBy(u => u.FirstName);
            }
            return Request.CreateResponse(HttpStatusCode.OK, members);
        }

        public class AutocompletePair
        {
            public string label { get; set; }
            public string value { get; set; }
        }

        [HttpGet()]
        [RoleManagerAuthorize(SecurityLevel = SecurityAccessLevel.Manager)]
        public HttpResponseMessage SearchUsers(string searchTerm)
        {
            List<AutocompletePair> res = new List<AutocompletePair>();
            using (var context = DataContext.Instance())
            {
                res = context.ExecuteQuery<RMUser>(System.Data.CommandType.Text,
                    "SELECT * FROM {databaseOwner}{objectQualifier}vw_Users WHERE PortalId=@0 AND (DisplayName LIKE '%' + @1 + '%' OR LastName LIKE '%' + @1 + '%' OR FirstName LIKE '%' + @1 + '%' OR Email LIKE '%' + @1 + '%') ORDER BY LastName, FirstName", ActiveModule.PortalID,
                    searchTerm).Select(u => new AutocompletePair()
                    {
                        label = string.Format("{0} ({1}, {2})", u.DisplayName, u.LastName, u.FirstName),
                        value = u.UserId.ToString()
                    }).ToList();
            }
            return Request.CreateResponse(HttpStatusCode.OK, res);
        }

        public class AddRemoveUserDTO
        {
            public int UserId { get; set; }
        }

        [HttpPost]
        [RoleManagerAuthorize(SecurityLevel = SecurityAccessLevel.Manager)]
        [ValidateAntiForgeryToken]
        public HttpResponseMessage Add(int id, [FromBody]AddRemoveUserDTO data)
        {
            var uc = new RoleController();
            if (uc.GetUserRole(ActiveModule.PortalID, data.UserId, id) != null)
            {
                return Request.CreateResponse(HttpStatusCode.OK);
            }
            uc.AddUserRole(ActiveModule.PortalID, data.UserId, id, System.DateTime.MinValue, System.DateTime.MinValue);
            var u = UserController.GetUserById(ActiveModule.PortalID, data.UserId);
            var res = new RMUser()
            {
                UserId = u.UserID,
                FirstName = u.FirstName,
                LastName = u.LastName,
                DisplayName = u.DisplayName,
                Email = u.Email
            };
            return Request.CreateResponse(HttpStatusCode.OK, res);
        }

        [HttpPost]
        [RoleManagerAuthorize(SecurityLevel = SecurityAccessLevel.Manager)]
        [ValidateAntiForgeryToken]
        public HttpResponseMessage Remove(int id, [FromBody]AddRemoveUserDTO data)
        {
            var uc = new RoleController();
            if (uc.GetUserRole(ActiveModule.PortalID, data.UserId, id) == null)
            {
                return Request.CreateResponse(HttpStatusCode.OK);
            }
            uc.UpdateUserRole(ActiveModule.PortalID, data.UserId, id, RoleStatus.Disabled, false, true);
            return Request.CreateResponse(HttpStatusCode.OK, true);
        }

    }
}