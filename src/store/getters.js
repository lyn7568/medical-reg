const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  account: state => state.user.account,
  userid: state => state.user.userid,
  name: state => state.user.name,
  roles: state => state.user.roles,
  hospital: state => state.user.hospital,
  department: state => state.user.department,
  session: state => state.user.session,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters
}
export default getters
