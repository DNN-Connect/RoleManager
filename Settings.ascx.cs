using System;
using System.IO;
using System.Web.UI.WebControls;
using DotNetNuke.Entities.Modules;
using DotNetNuke.Services.Exceptions;
using DotNetNuke.Security.Roles;
using System.Linq;
using System.Collections.Generic;

namespace Connect.DNN.Modules.RoleManager
{
    public partial class Settings : ModuleSettingsBase
    {
        #region Properties
        private Common.ModuleSettings _settings;
        public Common.ModuleSettings ModSettings
        {
            get { return _settings ?? (_settings = Common.ModuleSettings.GetSettings(ModuleContext.Configuration)); }
        }
        #endregion

        #region Base Method Implementations
        public override void LoadSettings()
        {
            try
            {
                if (Page.IsPostBack == false)
                {
                    ddView.Items.Clear();
                    ddView.Items.Add(new ListItem(LocalizeString("Default"), "Index"));
                    System.IO.DirectoryInfo viewDir = new DirectoryInfo(Server.MapPath("~/DesktopModules/MVC/Connect/RoleManager/Views"));
                    foreach (var f in viewDir.GetFiles("*.cshtml"))
                    {
                        string vwName = Path.GetFileNameWithoutExtension(f.Name);
                        if (vwName.ToLower() != "index")
                        {
                            ddView.Items.Add(new ListItem(vwName, vwName));
                        }
                    }
                    try
                    {
                        ddView.Items.FindByValue(ModSettings.View).Selected = true;
                    }
                    catch { }
                    var rc = new RoleController();
                    chkRoles.DataSource = rc.GetRoles(PortalId);
                    chkRoles.DataBind();
                    var roleIds = ModSettings.RoleListIds().ToList();
                    foreach (ListItem itm in chkRoles.Items)
                    {
                        if (roleIds.Contains(int.Parse(itm.Value)))
                        {
                            itm.Selected = true;
                        }
                    }
                }
            }
            catch (Exception exc) //Module failed to load
            {
                Exceptions.ProcessModuleLoadException(this, exc);
            }
        }

        public override void UpdateSettings()
        {
            try
            {
                ModSettings.View = ddView.SelectedValue;
                var roleIds = new List<int>();
                foreach (ListItem itm in chkRoles.Items)
                {
                    if (itm.Selected)
                    {
                        roleIds.Add(int.Parse(itm.Value));
                    }
                }
                ModSettings.RoleList = string.Join(";", roleIds);
                ModSettings.SaveSettings(ModuleContext.Configuration);
            }
            catch (Exception exc) //Module failed to load
            {
                Exceptions.ProcessModuleLoadException(this, exc);
            }
        }

        #endregion
    }
}