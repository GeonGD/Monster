const { ccclass, property } = cc._decorator;

@ccclass
export default class Controller extends cc.Component {

  @property(cc.Toggle)
  MapToggle: cc.Toggle;

  @property(cc.Toggle)
  RouteToggle: cc.Toggle;
  

  onLoad() {

  }

  public get isMapEdit() {
    return this.MapToggle.isChecked;
  }

  public get isRouteEdit() {
    return this.RouteToggle.isChecked;
  }
}