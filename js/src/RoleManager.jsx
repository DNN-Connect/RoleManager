var RoleList = require('./RoleList/RoleList.jsx');

(function($, window, document, undefined) {

  $(document).ready(function() {
    ConnectRoleManager.loadData();
  });

  window.ConnectRoleManager = {
    modules: {},

    loadData: function() {
      $('.connectRoleMgr').each(function(i, el) {
        var moduleId = $(el).data('moduleid');
        var resources = $(el).data('resources');
        var security = $(el).data('security');
        ConnectRoleManager.modules[moduleId] = {
          service: new ConnectRoleManagerService($, moduleId),
          resources: resources,
          security: security
        };
      });
      $('.roleMgr').each(function(i, el) {
        ReactDOM.render(<RoleList module={ConnectRoleManager.modules[$(el).data('moduleid')]}
                               roleId={$(el).data('roleid')}
                               roleName={$(el).data('rolename')}
                               colWidth={$(el).data('colwidth')} />, el);
      });
    }

  }


})(jQuery, window, document);
