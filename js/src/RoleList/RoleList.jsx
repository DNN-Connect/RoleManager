var Member = require('./Member.jsx');

module.exports = React.createClass({

  newUserId: -1,

  getInitialState() {
    return {
      users: []
    }
  },

  componentDidMount() {
    this.props.module.service.getUsers(this.props.roleId, (data) => {
      this.setState({
        users: data
      });
    });
    $(this.refs.newUser).autocomplete({
      minLength: 1,
      source: function (request, response) {
        this.newUserId = -1;
        this.props.module.service.searchUsers(request.term, function (data) {
          response(data);
        });
      }.bind(this),
      select: function (event, ui) {
        this.newUserId = ui.item.value;
        this.refs.newUser.value = ui.item.label;
        event.preventDefault();
      }.bind(this),
      close: function () {
      }.bind(this)
    });
  },

  render() {
    var colClass = 'col-sm-' + this.props.colWidth + ' col-xs-12';
    var users = this.state.users.map((user) => {
      return <Member module={this.props.module} user={user} key={user.UserId} deleteMember={this.deleteMember} />;
    });
    var addUserRow = null;
    if (this.props.module.security.IsManager) {
      addUserRow = (
          <tr>
           <td colspan="2">
            <input type="text" width="40" ref="newUser" className="form-control" onChange={this.searchUser} />
           </td>
           <td>
            <a href="#" ref="addUser"
                        onClick={this.addUser}
                        className="btn btn-sm btn-default glyphicon glyphicon-plus" 
                        title={this.props.module.resources.Add}></a>
           </td>
          </tr>
        );
    }
    return (
      <div className={colClass}>
        <h2>{this.props.roleName}</h2>
        <table className="table table-condensed table-hover table-striped">
         <thead>
          <tr>
           <th>Name</th>
           <th className="iconCol"></th>
          </tr>
          {addUserRow}
          {users}
         </thead>
        </table>
      </div>
    );
  },

  deleteMember(userToDelete, e) {
    if (confirm(this.props.module.resources.RemoveUser.replace('{0}', userToDelete.DisplayName)))
    {
      this.props.module.service.removeUser(this.props.roleId, userToDelete.UserId, (data) => {
        var newList = [];
        for (var i=0; i<this.state.users.length; i++) {
          var user = this.state.users[i];
          if (user.UserId != userToDelete.UserId) {
            newList.push(user);
          }
        }
        this.setState({
          users: newList
        });
      });
    }
  },

  addUser() {
    this.props.module.service.addUser(this.props.roleId, this.newUserId, (data) => {
      this.refs.newUser.value = '';
      this.newUserId = -1;
      var added = false;
      var newList = [];
      for (var i=0; i<this.state.users.length; i++) {
        var user = this.state.users[i];
        if (user.UserId == this.newUserId) {
          newList.push(user);
        } else {
          if (user.LastName < data.LastName) {
            newList.push(user);
          }
          else {
            if (added) {
              newList.push(user);
            }
            if (user.FirstName < data.FirstName) {
              newList.push(user);
            } else {
              newList.push(data);
              newList.push(user);
              added = true;
            }
          }
        }
      }
      if (!added) {
        newList.push(data);
      }
      this.setState({
        users: newList
      });
    });
  }

});
