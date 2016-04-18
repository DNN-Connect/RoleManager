<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="Settings.ascx.cs" Inherits="Connect.DNN.Modules.RoleManager.Settings" %>
<%@ Register TagName="label" TagPrefix="dnn" Src="~/controls/labelcontrol.ascx" %>

<fieldset>
 <div class="dnnFormItem">
  <dnn:label id="lblView" runat="server" controlname="ddView" suffix=":" />
  <asp:DropDownList runat="server" ID="ddView" />
 </div>
 <div class="dnnFormItem">
  <dnn:label id="lblRoles" runat="server" controlname="chkRoles" suffix=":" />
  <asp:checkboxlist Runat="server" ID="chkRoles" RepeatColumns="2" DataTextField="RoleName" DataValueField="RoleID" CssClass="Normal" />
 </div>
</fieldset>
