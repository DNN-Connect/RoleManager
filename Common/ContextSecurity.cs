using System.Linq;
using DotNetNuke.Entities.Modules;
using DotNetNuke.Entities.Portals;
using DotNetNuke.Entities.Users;
using DotNetNuke.Security;
using DotNetNuke.Security.Permissions;

namespace Connect.DNN.Modules.RoleManager.Common
{
    public class ContextSecurity
    {
        public bool CanView { get; set; }
        public bool CanEdit { get; set; }
        public bool IsManager { get; set; }
        public bool IsAdmin { get; set; }
        private UserInfo user { get; set; }
        
        public int UserId
        {
            get
            {
                return user.UserID;
            }
        }

        public ContextSecurity(ModuleInfo objModule)
        {
            user = UserController.Instance.GetCurrentUserInfo();
            if (user.IsSuperUser)
            {
                CanView = CanEdit = IsAdmin = IsManager = true;
            }
            else
            {
                IsAdmin = PortalSecurity.IsInRole(PortalSettings.Current.AdministratorRoleName);
                if (IsAdmin)
                {
                    CanView = CanEdit = IsManager = IsManager = true;
                }
                else
                {
                    CanView = ModulePermissionController.CanViewModule(objModule);
                    CanEdit = ModulePermissionController.HasModulePermission(objModule.ModulePermissions, "EDIT");
                    IsManager = ModulePermissionController.HasModulePermission(objModule.ModulePermissions, "MANAGER");
                }
            }
        }

    }
}