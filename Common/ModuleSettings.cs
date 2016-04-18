using System.Collections.Generic;
using System.Linq;
using DotNetNuke.Entities.Modules;
using DotNetNuke.Entities.Modules.Settings;
using DotNetNuke.Security.Roles;

namespace Connect.DNN.Modules.RoleManager.Common
{
    public class ModuleSettings
    {
        [ModuleSetting]
        public string View { get; set; } = "Index";
        [ModuleSetting]
        public string RoleList { get; set; } = "";

        private int PortalId { get; set; } = -1;

        public IEnumerable<int> RoleListIds()
        {
            return RoleList.Split(';').Where(s => !string.IsNullOrEmpty(s)).Select(s => int.Parse(s));
        }

        public IEnumerable<RoleInfo> Roles()
        {
            var rc = new RoleController();
            return RoleListIds().Select(roleId => rc.GetRoleById(PortalId, roleId));
        }

        public static ModuleSettings GetSettings(ModuleInfo module)
        {
            var repo = new ModuleSettingsRepository();
            var res = repo.GetSettings(module);
            res.PortalId = module.PortalID;
            return res;
        }

        public void SaveSettings(ModuleInfo module)
        {
            var repo = new ModuleSettingsRepository();
            repo.SaveSettings(module, this);
        }
    }
    public class ModuleSettingsRepository : SettingsRepository<ModuleSettings>
    {
    }
}