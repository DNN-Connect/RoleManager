module.exports = React.createClass({

  getInitialState() {
    return {
    }
  },

  render() {
    var displName = this.props.user.LastName;
    if (displName == '') {
      displName = this.props.user.DisplayName;
    } else {
      displName += ', ' + this.props.user.FirstName;
    }
    var delButton = null;
    if (this.props.module.security.IsManager) {
      delButton = <a href="#" className="btn btn-sm btn-default glyphicon glyphicon-erase" title={this.props.module.resources.Delete}
                              onClick={this.props.deleteMember.bind(null, this.props.user)}></a>;
    }
    return (
      <tr>
        <td>{displName}
         <span className="userDetails">{this.props.user.DisplayName}</span>
         <span className="userDetails">{this.props.user.Email}</span>
        </td>
        <td>
          {delButton}
        </td>
      </tr>
    );
  }

});
