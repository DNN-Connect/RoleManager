window.ConnectRoleManagerService = function($, mid) {
    var moduleId = mid;

    this.ServicePath = $.dnnSF(moduleId).getServiceRoot('Connect/RoleManager');

    this.ajaxCall = function(type, controller, action, id, data, success, fail) {
        // showLoading();
        $.ajax({
            type: type,
            url: this.ServicePath + controller + '/' + action + (id != null ? '/' + id : ''),
            beforeSend: $.dnnSF(moduleId).setModuleHeaders,
            data: data
        }).done(function(retdata) {
            // hideLoading();
            if (success != undefined) {
                success(retdata);
            }
        }).fail(function(xhr, status) {
            // showError(xhr.responseText);
            if (fail != undefined) {
                fail(xhr.responseText);
            }
        });
    }

    this.getUsers = function(roleId, success, fail) {
        this.ajaxCall('GET', 'Roles', 'Users', roleId, null, success, fail);
    }

    this.removeUser = function(roleId, userId, success, fail) {
        this.ajaxCall('POST', 'Roles', 'Remove', roleId, { UserId: userId }, success, fail);
    }

    this.addUser = function(roleId, userId, success, fail) {
        this.ajaxCall('POST', 'Roles', 'Add', roleId, { UserId: userId }, success, fail);
    }

    this.searchUsers = function(searchTerm, success, fail) {
        this.ajaxCall('GET', 'Roles', 'SearchUsers', null, { SearchTerm: searchTerm }, success, fail);
    }

}
