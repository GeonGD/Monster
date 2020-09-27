import BlockGroup from "./BlockGroup";
import DataManager from "./DataManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RouteEditor extends cc.Component {

  private _blockGroup: BlockGroup;

  public init(blockGroup: BlockGroup) {
    this._blockGroup = blockGroup;
  }

  // touch start
  public touchStartandle(event: cc.Touch): void {
    let endPos: cc.Vec2 = event.getLocation();
    let mapSprite: cc.Sprite = this._blockGroup.getEndSelectSprite(endPos);
    DataManager.Instance.setRouteData(mapSprite.selfIndex);
    this._blockGroup.setRouteMap();
  }

  // touch move
  public touchMoveHandle(event: cc.Touch): void {

  }

  // touch end || cancel
  public touchEndHandle(event: cc.Touch): void {

  }
}